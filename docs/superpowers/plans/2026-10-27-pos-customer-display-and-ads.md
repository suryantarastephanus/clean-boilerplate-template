# POS Customer-Facing Display & Ads Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun fitur Layar Kedua Pelanggan (_Customer-Facing Display_) yang tersinkronisasi instan via `BroadcastChannel` dan modul Manajemen Iklan Promosi Toko di Dashboard dengan penjadwalan tanggal mulai–selesai serta fallback banner default.

**Architecture:** Menggunakan Laravel 12 + Inertia React 3. Data promosi disimpan di tabel `pos_advertisements` dengan isolasi multi-tenant (`tenant_id`). Layar kedua kasir (`/pos/customer-display`) menerima siaran state transaksi secara instan (0-latensi) dari terminal POS kasir (`/pos`) menggunakan HTML5 `BroadcastChannel` API. Banner iklan berotasi secara terjadwal otomatis, dan jatuh ke banner default jika tidak ada promo aktif.

**Tech Stack:** PHP 8.4, Laravel 12, Inertia.js React, TypeScript, Tailwind CSS v4, Lucide React, HTML5 BroadcastChannel API, Pest PHP.

**Spec:** [`docs/superpowers/specs/2026-10-27-pos-customer-display-and-ads-design.md`](file:///c:/Users/stanley/Documents/GitHub/kasir/docs/superpowers/specs/2026-10-27-pos-customer-display-and-ads-design.md)

---

## Global Constraints

- PHP Version: 8.4; Laravel Version: 12.
- Framework Guidelines: Semua model ber-tenant wajib menggunakan `BelongsToTenant` trait.
- Front-End Aesthetics: Mengikuti tema Terminal Precision POS (`#131316` surface, `#00a572` emerald accents, `Instrument Sans` font, formatted Indonesian Rupiah with thousand separators).
- Zero-Placeholder Policy: Tidak boleh ada kode "TODO", mock data tanpa fallback, atau fungsi kosong.
- Git Workflow: Wajib local commit setiap task selesai dan terverifikasi. Dilarang auto-push ke remote tanpa instruksi user.
- Code Formatter: Wajib mengeksekusi `vendor/bin/pint --format agent` setelah mengedit file PHP.

## Review Focus

1. **Jadwal Promo Berakhir Saat Layar Aktif:** Iklan yang tanggal `end_date`-nya baru saja terlewati harus otomatis berhenti tayang dan beralih ke promo lain atau banner default tanpa harus me-reload browser.
2. **Offline Resilience:** Layar pelanggan tetap sinkron menampilkan scan keranjang dan total tagihan kasir meskipun koneksi internet lokal drop (BroadcastChannel beroperasi di loop lokal).
3. **Multi-Tenant Ad Security:** Tenant B sama sekali tidak boleh dapat melihat, mengedit, atau menayangkan file gambar banner kepunyaan Tenant A.
4. **Validasi File Banner Rusak / Hilang:** Jika gambar banner promosi tidak dapat dimuat (404/corrupted), layar harus graceful fallback ke SVG default template toko tanpa merusak tata letak.
5. **Pop-up Blocker Protection:** Tombol "Buka Layar Pelanggan" di POS kasir harus dipicu langsung oleh event klik pengguna (`window.open`) dengan fallback notifikasi toast jika browser memblokir pop-up.

---

### Task 1: Database Migration, Model, & PlatformFeature Enum for POS Advertisements

**Files:**

- Modify: `app/Enums/PlatformFeature.php`
- Create: `database/migrations/2026_10_27_180000_create_pos_advertisements_table.php`
- Create: `app/Models/PosAdvertisement.php`
- Test: `tests/Feature/PosAdvertisementModelTest.php`

**Interfaces:**

- Consumes: `App\Models\Tenant`, `App\Models\Concerns\BelongsToTenant`
- Produces: `App\Enums\PlatformFeature::PosCustomerDisplay` ('pos_customer_display'), `App\Models\PosAdvertisement` with `scopeCurrentlyActive()`, `scopeDefaultBanners()`, and `banner_url` accessor.

- [ ] **Step 1: Write the failing test for PosAdvertisement model & scopes**

```php
<?php

use App\Models\PosAdvertisement;
use App\Models\Tenant;
use Illuminate\Support\Carbon;

beforeEach(function () {
    $this->tenant = Tenant::create([
        'store_name' => 'Toko Mart Test',
        'store_code' => 'MART_TEST_01',
        'is_active' => true,
    ]);
});

test('pos advertisement respects currently active schedule and fallback scopes', function () {
    Carbon::setTestNow('2026-10-27 10:00:00');

    // Active scheduled promo
    $activePromo = PosAdvertisement::create([
        'tenant_id' => $this->tenant->id,
        'title' => 'Promo Minyak Murah',
        'banner_image_path' => 'banners/minyak.jpg',
        'placement' => 'all',
        'start_date' => '2026-10-25 00:00:00',
        'end_date' => '2026-10-28 23:59:59',
        'is_default' => false,
        'is_active' => true,
        'display_order' => 1,
    ]);

    // Expired promo
    $expiredPromo = PosAdvertisement::create([
        'tenant_id' => $this->tenant->id,
        'title' => 'Promo Beras Lewat',
        'banner_image_path' => 'banners/beras.jpg',
        'placement' => 'all',
        'start_date' => '2026-10-20 00:00:00',
        'end_date' => '2026-10-26 23:59:59',
        'is_default' => false,
        'is_active' => true,
        'display_order' => 2,
    ]);

    // Inactive promo
    $disabledPromo = PosAdvertisement::create([
        'tenant_id' => $this->tenant->id,
        'title' => 'Promo Susu Nonaktif',
        'banner_image_path' => 'banners/susu.jpg',
        'placement' => 'all',
        'start_date' => '2026-10-25 00:00:00',
        'end_date' => '2026-10-28 23:59:59',
        'is_default' => false,
        'is_active' => false,
        'display_order' => 3,
    ]);

    // Default Fallback promo
    $defaultPromo = PosAdvertisement::create([
        'tenant_id' => $this->tenant->id,
        'title' => 'Default Banner Toko',
        'banner_image_path' => 'banners/default.jpg',
        'placement' => 'all',
        'is_default' => true,
        'is_active' => true,
        'display_order' => 99,
    ]);

    $activeBanners = PosAdvertisement::where('tenant_id', $this->tenant->id)->currentlyActive()->get();
    expect($activeBanners)->toHaveCount(1)
        ->and($activeBanners->first()->id)->toBe($activePromo->id);

    $defaultBanners = PosAdvertisement::where('tenant_id', $this->tenant->id)->defaultBanners()->get();
    expect($defaultBanners)->toHaveCount(1)
        ->and($defaultBanners->first()->id)->toBe($defaultPromo->id);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/PosAdvertisementModelTest.php`
Expected: FAIL (table and class do not exist yet)

- [ ] **Step 3: Create migration and PosAdvertisement model**

Create migration `database/migrations/2026_10_27_180000_create_pos_advertisements_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_advertisements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('title');
            $table->string('banner_image_path');
            $table->string('placement')->default('all');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->integer('duration_seconds')->default(6);
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
            $table->index(['start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_advertisements');
    }
};
```

Create model `app/Models/PosAdvertisement.php`:

```php
<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PosAdvertisement extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'title',
        'banner_image_path',
        'placement',
        'start_date',
        'end_date',
        'is_default',
        'is_active',
        'display_order',
        'duration_seconds',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
        'duration_seconds' => 'integer',
    ];

    protected $appends = ['banner_url'];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function getBannerUrlAttribute(): ?string
    {
        if (! $this->banner_image_path) {
            return null;
        }

        if (str_starts_with($this->banner_image_path, 'http://') || str_starts_with($this->banner_image_path, 'https://')) {
            return $this->banner_image_path;
        }

        return Storage::disk('public')->url($this->banner_image_path);
    }

    public function scopeCurrentlyActive(Builder $query): Builder
    {
        $now = now();

        return $query->where('is_active', true)
            ->where('is_default', false)
            ->where(function (Builder $q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function (Builder $q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->orderBy('display_order', 'asc')
            ->orderByDesc('created_at');
    }

    public function scopeDefaultBanners(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where('is_default', true)
            ->orderBy('display_order', 'asc');
    }
}
```

- [ ] **Step 4: Run migration and verify test passes**

Run:

```bash
php artisan migrate
php artisan test tests/Feature/PosAdvertisementModelTest.php
```

Expected: PASS with 1 passed test.

- [ ] **Step 5: Code format & commit**

```bash
vendor/bin/pint --format agent
git add database/migrations/*create_pos_advertisements_table.php app/Models/PosAdvertisement.php tests/Feature/PosAdvertisementModelTest.php
git commit -m "feat(promotions): add pos_advertisements table, model, and active schedule scopes"
```

---

### Task 2: Backend Controller, Storage Handling, & Routes for Promotions

**Files:**

- Create: `app/Http/Controllers/PosAdvertisementController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/PosAdvertisementControllerTest.php`

**Interfaces:**

- Consumes: `App\Models\PosAdvertisement`, `Illuminate\Http\Request`, Storage disk `public`
- Produces: Web endpoints for `/promotions` CRUD and JSON endpoint `/api/pos/customer-display/ads`

- [ ] **Step 1: Write failing controller feature test**

Create `tests/Feature/PosAdvertisementControllerTest.php`:

```php
<?php

use App\Enums\UserRole;
use App\Models\PosAdvertisement;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');

    $this->tenant = Tenant::create([
        'store_name' => 'Toko Kasir Sejahtera',
        'store_code' => 'SEJAHTERA_01',
        'is_active' => true,
    ]);

    $this->admin = User::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Admin Toko',
        'email' => 'admin@sejahtera.com',
        'password' => Hash::make('password'),
        'role' => UserRole::TenantAdmin,
        'is_active' => true,
    ]);
});

test('tenant admin can list, create, toggle, and delete advertisements', function () {
    $this->actingAs($this->admin);

    // 1. List promotions page
    $response = $this->get(route('promotions.index'));
    $response->assertOk();

    // 2. Upload advertisement
    $file = UploadedFile::fake()->image('banner_promo.jpg', 1200, 600);
    $storeResponse = $this->post(route('promotions.store'), [
        'title' => 'Diskon Awal Bulan',
        'banner_image' => $file,
        'placement' => 'all',
        'start_date' => now()->format('Y-m-d H:i:s'),
        'end_date' => now()->addDays(5)->format('Y-m-d H:i:s'),
        'is_default' => false,
        'is_active' => true,
        'duration_seconds' => 7,
    ]);
    $storeResponse->assertRedirect(route('promotions.index'));

    $ad = PosAdvertisement::where('title', 'Diskon Awal Bulan')->first();
    expect($ad)->not->toBeNull();
    Storage::disk('public')->assertExists($ad->banner_image_path);

    // 3. Toggle status
    $toggleResponse = $this->post(route('promotions.toggle-status', $ad));
    $toggleResponse->assertRedirect();
    expect($ad->fresh()->is_active)->toBeFalse();

    // 4. Delete advertisement
    $deleteResponse = $this->delete(route('promotions.destroy', $ad));
    $deleteResponse->assertRedirect();
    expect(PosAdvertisement::find($ad->id))->toBeNull();
});

test('customer display ads api returns active ads or falls back to default banner', function () {
    $this->actingAs($this->admin);

    // Create default banner
    $defaultAd = PosAdvertisement::create([
        'tenant_id' => $this->tenant->id,
        'title' => 'Default Welcome Banner',
        'banner_image_path' => 'banners/default.jpg',
        'placement' => 'all',
        'is_default' => true,
        'is_active' => true,
        'display_order' => 1,
    ]);

    $response = $this->getJson(route('api.pos.customer-display.ads'));
    $response->assertOk()
        ->assertJsonStructure(['ads', 'has_active_promos', 'is_fallback'])
        ->assertJson([
            'has_active_promos' => false,
            'is_fallback' => true,
        ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/PosAdvertisementControllerTest.php`
Expected: FAIL (route `promotions.index` not defined)

- [ ] **Step 3: Implement PosAdvertisementController and register routes**

Create `app/Http/Controllers/PosAdvertisementController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\PosAdvertisement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PosAdvertisementController extends Controller
{
    public function index(Request $request): Response|JsonResponse
    {
        $tenantId = $request->user()?->tenant_id;

        $advertisements = PosAdvertisement::where('tenant_id', $tenantId)
            ->orderByDesc('is_default')
            ->orderBy('display_order', 'asc')
            ->orderByDesc('created_at')
            ->get();

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json($advertisements);
        }

        return Inertia::render('promotions/index', [
            'advertisements' => $advertisements,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = $request->user()?->tenant_id;

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'banner_image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'placement' => ['required', 'in:all,idle_hero,sidebar'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_default' => ['boolean'],
            'is_active' => ['boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'duration_seconds' => ['nullable', 'integer', 'min:3', 'max:60'],
        ]);

        $path = $request->file('banner_image')->store("tenants/{$tenantId}/banners", 'public');

        PosAdvertisement::create([
            'tenant_id' => $tenantId,
            'title' => $validated['title'],
            'banner_image_path' => $path,
            'placement' => $validated['placement'] ?? 'all',
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'is_default' => $validated['is_default'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
            'duration_seconds' => $validated['duration_seconds'] ?? 6,
        ]);

        return redirect()->route('promotions.index')->with('success', 'Banner promosi berhasil ditambahkan.');
    }

    public function update(Request $request, PosAdvertisement $advertisement): RedirectResponse
    {
        abort_unless($advertisement->tenant_id === $request->user()?->tenant_id, 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'banner_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'placement' => ['required', 'in:all,idle_hero,sidebar'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_default' => ['boolean'],
            'is_active' => ['boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'duration_seconds' => ['nullable', 'integer', 'min:3', 'max:60'],
        ]);

        if ($request->hasFile('banner_image')) {
            if ($advertisement->banner_image_path && Storage::disk('public')->exists($advertisement->banner_image_path)) {
                Storage::disk('public')->delete($advertisement->banner_image_path);
            }
            $advertisement->banner_image_path = $request->file('banner_image')->store("tenants/{$advertisement->tenant_id}/banners", 'public');
        }

        $advertisement->update([
            'title' => $validated['title'],
            'placement' => $validated['placement'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'is_default' => $validated['is_default'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
            'duration_seconds' => $validated['duration_seconds'] ?? 6,
        ]);

        return redirect()->route('promotions.index')->with('success', 'Banner promosi berhasil diperbarui.');
    }

    public function toggleStatus(Request $request, PosAdvertisement $advertisement): RedirectResponse
    {
        abort_unless($advertisement->tenant_id === $request->user()?->tenant_id, 403);

        $advertisement->update([
            'is_active' => ! $advertisement->is_active,
        ]);

        return back()->with('success', 'Status iklan berhasil diubah.');
    }

    public function destroy(Request $request, PosAdvertisement $advertisement): RedirectResponse
    {
        abort_unless($advertisement->tenant_id === $request->user()?->tenant_id, 403);

        if ($advertisement->banner_image_path && Storage::disk('public')->exists($advertisement->banner_image_path)) {
            Storage::disk('public')->delete($advertisement->banner_image_path);
        }

        $advertisement->delete();

        return redirect()->route('promotions.index')->with('success', 'Banner promosi berhasil dihapus.');
    }

    public function activeAds(Request $request): JsonResponse
    {
        $tenantId = $request->user()?->tenant_id;

        $activeAds = PosAdvertisement::where('tenant_id', $tenantId)
            ->currentlyActive()
            ->get();

        if ($activeAds->isNotEmpty()) {
            return response()->json([
                'ads' => $activeAds,
                'has_active_promos' => true,
                'is_fallback' => false,
            ]);
        }

        $defaultAds = PosAdvertisement::where('tenant_id', $tenantId)
            ->defaultBanners()
            ->get();

        return response()->json([
            'ads' => $defaultAds,
            'has_active_promos' => false,
            'is_fallback' => true,
        ]);
    }
}
```

Tambahkan rute pada `routes/web.php` dalam grup tenant auth:

```php
// Promotions & Customer Display Advertisements
Route::get('promotions', [PosAdvertisementController::class, 'index'])->name('promotions.index');
Route::post('promotions', [PosAdvertisementController::class, 'store'])->name('promotions.store');
Route::put('promotions/{advertisement}', [PosAdvertisementController::class, 'update'])->name('promotions.update');
Route::delete('promotions/{advertisement}', [PosAdvertisementController::class, 'destroy'])->name('promotions.destroy');
Route::post('promotions/{advertisement}/toggle-status', [PosAdvertisementController::class, 'toggleStatus'])->name('promotions.toggle-status');
Route::get('api/pos/customer-display/ads', [PosAdvertisementController::class, 'activeAds'])->name('api.pos.customer-display.ads');
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Feature/PosAdvertisementControllerTest.php`
Expected: PASS with 2 passed tests.

- [ ] **Step 5: Code format & commit**

```bash
vendor/bin/pint --format agent
git add app/Http/Controllers/PosAdvertisementController.php routes/web.php tests/Feature/PosAdvertisementControllerTest.php
git commit -m "feat(promotions): add PosAdvertisementController CRUD, image upload, and active ads API"
```

---

### Task 3: Dashboard Promotions Management UI & Sidebar Navigation

**Files:**

- Create: `resources/js/pages/promotions/index.tsx`
- Modify: `resources/js/components/app-sidebar.tsx`

**Interfaces:**

- Consumes: `advertisements` prop from `PosAdvertisementController@index`
- Produces: Inertia Page with Table list, smart status badges (`🟢 Sedang Tayang`, `🟡 Terjadwal`, `⚪ Berakhir`, `⭐ Default`), Add/Edit modal with image upload, preview modal.

- [ ] **Step 1: Add "Promosi Layar Kasir" to Sidebar Navigation**

Modify `resources/js/components/app-sidebar.tsx`:
Add navigation entry with icon `Tv` under operational store items:

```tsx
import { Tv } from 'lucide-react';
// in storeNavItems:
{
    title: 'Promosi Layar Kasir',
    href: '/promotions',
    icon: Tv,
    feature: 'pos_terminal',
},
```

- [ ] **Step 2: Build `resources/js/pages/promotions/index.tsx`**

Implement standard Inertia page using AppLayout, dialog modal for Add/Edit, date-time pickers for `start_date` and `end_date`, switch for `is_default`, toggle for `is_active`, and a modal "Preview Layar Kasir" to simulate customer display.

- [ ] **Step 3: Test page rendering via Pest**

Add test in `tests/Feature/PosAdvertisementControllerTest.php` asserting Inertia component `promotions/index` renders with props.

- [ ] **Step 4: Run Vite build to verify no TypeScript/JSX compile errors**

Run: `npm run build`
Expected: SUCCESS without build errors.

- [ ] **Step 5: Commit**

```bash
git add resources/js/pages/promotions/index.tsx resources/js/components/app-sidebar.tsx tests/Feature/PosAdvertisementControllerTest.php
git commit -m "feat(promotions): add promotions management dashboard page and sidebar navigation"
```

---

### Task 4: Customer-Facing Display Page & Component Suite

**Files:**

- Create: `resources/js/types/pos-display.ts`
- Create: `resources/js/components/customer-display/hero-ad-carousel.tsx`
- Create: `resources/js/components/customer-display/live-cart-panel.tsx`
- Create: `resources/js/components/customer-display/sidebar-ad-card.tsx`
- Create: `resources/js/components/customer-display/payment-qris-display.tsx`
- Create: `resources/js/components/customer-display/payment-cash-display.tsx`
- Create: `resources/js/components/customer-display/payment-success-overlay.tsx`
- Create: `resources/js/pages/pos/customer-display.tsx`
- Modify: `app/Http/Controllers/PosController.php` (add `customerDisplay()` action)
- Modify: `routes/web.php`
- Test: `tests/Feature/CustomerDisplayPageTest.php`

**Interfaces:**

- Consumes: `BroadcastChannel('pos_customer_display_' + storeCode)`, initial ads from Inertia props, periodic polling fallback
- Produces: Route `/pos/customer-display` rendering full responsive dual-screen interface.

- [ ] **Step 1: Define TypeScript contracts in `resources/js/types/pos-display.ts`**

Export interfaces `DisplayState`, `CustomerDisplayPayload`, `DisplayCartItem`, and `PosAdItem`.

- [ ] **Step 2: Create sub-components in `resources/js/components/customer-display/`**

- `hero-ad-carousel.tsx`: Menampilkan slideshow gambar promo dengan smooth fade transisi, progress bar durasi tayang, dan fallback template jika tidak ada banner.
- `live-cart-panel.tsx`: Tabel daftar belanjaan pelanggan (Nama, Qty, Satuan, Harga, Subtotal, Diskon) + badge total belanja hijau emerald besar.
- `sidebar-ad-card.tsx`: Menampilkan rotasi banner promosi aktif di kolom samping saat kasir sedang memindai keranjang.
- `payment-qris-display.tsx`: QR Code QRIS dinamis besar + nominal tagihan pas + status animasi scan.
- `payment-cash-display.tsx`: Rincian pembayaran tunai: Total Tagihan, Uang Diterima, dan Uang Kembali kontras.
- `payment-success-overlay.tsx`: Animasi centang hijau, nomor struk, nada chime, dan timer auto-reset 5 detik kembali ke IDLE.

- [ ] **Step 3: Create `resources/js/pages/pos/customer-display.tsx`**

Implement state machine switching between:
`IDLE` -> `ACTIVE_CART` -> `PAYMENT_QRIS` / `PAYMENT_CASH` -> `PAYMENT_SUCCESS`.
Listening to `const channel = new BroadcastChannel('pos_customer_display_' + storeCode)` and updating state immediately with zero delay.

- [ ] **Step 4: Register route and controller action in `PosController.php`**

```php
public function customerDisplay(Request $request): Response
{
    $tenant = $request->user()?->tenant ?? Tenant::where('is_active', true)->first();
    abort_unless($tenant, 404);

    $activeAds = PosAdvertisement::where('tenant_id', $tenant->id)
        ->currentlyActive()
        ->get();

    $defaultAds = PosAdvertisement::where('tenant_id', $tenant->id)
        ->defaultBanners()
        ->get();

    return Inertia::render('pos/customer-display', [
        'store' => [
            'name' => $tenant->store_name,
            'code' => $tenant->store_code,
            'logoUrl' => $tenant->logo_url,
            'address' => $tenant->address,
            'phone' => $tenant->phone,
        ],
        'initialAds' => $activeAds->isNotEmpty() ? $activeAds : $defaultAds,
        'hasActivePromos' => $activeAds->isNotEmpty(),
    ]);
}
```

- [ ] **Step 5: Write feature test in `tests/Feature/CustomerDisplayPageTest.php`**

Verify route `/pos/customer-display` returns 200 OK and provides `store` and `initialAds` props.

- [ ] **Step 6: Run Pest & Vite build**

```bash
php artisan test tests/Feature/CustomerDisplayPageTest.php
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
vendor/bin/pint --format agent
git add app/Http/Controllers/PosController.php routes/web.php resources/js/types/pos-display.ts resources/js/components/customer-display/ resources/js/pages/pos/customer-display.tsx tests/Feature/CustomerDisplayPageTest.php
git commit -m "feat(pos): add customer-facing display page and modular display components"
```

---

### Task 5: POS Terminal Integration & Launcher Button

**Files:**

- Create: `resources/js/hooks/use-customer-display-broadcast.ts`
- Modify: `resources/js/pages/pos/index.tsx`

**Interfaces:**

- Consumes: POS cart state, payment modal states (Cash & QRIS), checkout completion in `pos/index.tsx`
- Produces: Instant message broadcast to channel `pos_customer_display_${storeCode}` and launcher button in POS header.

- [ ] **Step 1: Create broadcast hook `resources/js/hooks/use-customer-display-broadcast.ts`**

Hook yang membungkus `BroadcastChannel` dan mengekspos helper methods:

- `broadcastCartUpdate(cart, store, cashierName)`
- `broadcastPaymentQris(qrisData, cart, store)`
- `broadcastPaymentCash(cashReceived, changeDue, cart, store)`
- `broadcastPaymentSuccess(receiptNumber, changeDue, store)`
- `broadcastResetIdle(store)`
- `openCustomerDisplayWindow()`

- [ ] **Step 2: Wire hook into `resources/js/pages/pos/index.tsx`**

1. Tambahkan tombol di header POS kasir:

```tsx
<Button
    type="button"
    variant="outline"
    size="sm"
    onClick={openCustomerDisplayWindow}
    className="h-8 gap-1.5 border-emerald-500/30 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
    title="Buka Layar Pelanggan (Monitor 2)"
>
    <Tv className="size-3.5" />
    <span className="hidden sm:inline">Layar Pelanggan</span>
</Button>
```

2. Trigger `broadcastCartUpdate` saat item di-scan, di-tambah, di-kurang, atau di-hapus dari cart.
3. Trigger `broadcastPaymentQris` saat modal QRIS terbuka.
4. Trigger `broadcastPaymentCash` saat kasir memilih nominal uang masuk cash.
5. Trigger `broadcastPaymentSuccess` saat transaksi checkout selesai sukses.
6. Trigger `broadcastResetIdle` saat kasir mengosongkan keranjang atau menutup transaksi.

- [ ] **Step 3: Test and build**

Run: `npm run build`
Expected: SUCCESS without build errors.

- [ ] **Step 4: Commit**

```bash
git add resources/js/hooks/use-customer-display-broadcast.ts resources/js/pages/pos/index.tsx
git commit -m "feat(pos): integrate real-time broadcast and launcher button for customer display"
```

---

### Task 6: Comprehensive Verification & Final Review

**Files:**

- All modified and newly created files.

- [ ] **Step 1: Run Pint code formatter**

Run: `vendor/bin/pint --format agent`
Expected: 0 format issues.

- [ ] **Step 2: Run all relevant test suites**

Run:

```bash
php artisan test --filter=PosAdvertisement
php artisan test --filter=CustomerDisplay
php artisan test --filter=PosCheckout
```

Expected: All tests PASS.

- [ ] **Step 3: Run full Vite build**

Run: `npm run build`
Expected: Build passes with zero TypeScript errors.

- [ ] **Step 4: Final Git Status Verification & Report**

Confirm clean working tree and report commit hashes.
