# Git & Deployment Rules

## 1. Git Commit (WAJIB OTOMATIS)

- AI **WAJIB** membuat `git commit` secara lokal langsung setelah pengerjaan kode/fitur/bugfix selesai dan lolos verifikasi (`vendor/bin/pint`, `php artisan test`, `npm run build`).
- **JANGAN** membiarkan perubahan dalam kondisi _unstaged/dirty_ tanpa di-commit lokal setelah tugas dinyatakan selesai.
- Jangan menunggu pengguna bertanya _"sudah di commit?"_. Langsung buat commit lokal secara proaktif.
- Gunakan format Conventional Commits yang deskriptif (`feat:`, `fix:`, `refactor:`, `chore:`, dsb.).

## 2. Git Push (HANYA DENGAN INSTRUKSI EKSPLISIT)

- AI **DILARANG KERAS** melakukan `git push` ke remote repository (`origin main` atau branch manapun) secara otomatis.
- `git push` hanya boleh dieksekusi apabila pengguna memberikan instruksi eksplisit (contoh: _"push"_, _"git push"_, _"push ke remote"_, _"upload ke git"_).

## 3. Deployment (HANYA DENGAN INSTRUKSI EKSPLISIT)

- AI **DILARANG KERAS** mentrigger atau menjalankan script deploy (contoh: `powershell ... scripts/trigger-deploy.ps1`, webhook Easypanel, atau Laravel Cloud deploy) secara otomatis.
- Deployment hanya boleh dieksekusi apabila pengguna memberikan instruksi eksplisit (contoh: _"deploy"_, _"kirim deploy"_, _"jalankan deployment"_).

## 4. Alur Kerja Standar (Setiap Siklus Pengerjaan)

1. Terapkan kode dan lakukan penyesuaian yang diperlukan.
2. Jalankan build atau verifikasi (`vendor/bin/pint --dirty --format agent`, `php artisan test --compact`, atau `npm run build`).
3. **LANGSUNG LAKUKAN `git commit` LOKAL**.
4. Laporkan kepada pengguna bahwa commit lokal sudah dibuat (sertakan hash & pesan commit), lalu tunggu instruksi apakah pengguna ingin melanjutkan ke tahap `push` dan `deploy`.
