# Project Rules & Guidelines

## Git Commit & Deployment Workflow

- **WAJIB LANGSUNG LOKAL COMMIT**: Setiap kali menyelesaikan tugas (fitur, bugfix, refactoring, penyesuaian styling, update package) yang telah terverifikasi (`vendor/bin/pint`, `php artisan test`, atau `npm run build`), AI **WAJIB langsung membuat local `git commit`** dengan pesan conventional commit yang deskriptif.
- **JANGAN PERNAH MENUNGGU DITANYA**: Jangan tinggalkan workspace dalam keadaan _dirty/unstaged_ di akhir pengerjaan. Selalu commit secara proaktif.
- **DILARANG AUTO PUSH & DEPLOY**: `git push` dan deployment hanya boleh dieksekusi jika pengguna memberikan perintah eksplisit (misal: "push", "deploy", "kirim").
- **Lapor Hasil**: Laporkan status commit lokal beserta hash-nya di akhir respon.
