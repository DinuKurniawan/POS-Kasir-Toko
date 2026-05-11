# POS Kasir Toko

Aplikasi Point of Sale (POS) berbasis web untuk mengelola transaksi penjualan toko, dibangun dengan Laravel 13 + React (Inertia.js).

## Stack Teknologi

- **Backend**: Laravel 13
- **Frontend**: React + Inertia.js
- **Styling**: Tailwind CSS v4
- **Database**: MySQL
- **Build Tool**: Vite
- **Payment Gateway**: Midtrans (Snap)

## Fitur

- Login admin dan kasir (username/password)
- Dashboard admin dengan statistik penjualan
- Manajemen user (admin/kasir)
- Manajemen kategori produk
- Manajemen produk (CRUD, stok, harga beli/jual)
- Manajemen stok (masuk/keluar, riwayat)
- POS kasir dengan UI modern
- Pembayaran cash, QRIS, dan transfer bank
- Integrasi Midtrans (sandbox)
- Cetak struk transaksi
- Laporan penjualan dengan filter
- Role-based access control

## Persyaratan

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0
- NPM

## Instalasi

```powershell
# 1. Clone atau masuk ke folder project
cd POS-Kasir-Toko

# 2. Install PHP dependencies
composer install

# 3. Install Node dependencies
npm install

# 4. Copy environment file (jika belum ada)
copy .env.example .env

# 5. Generate application key
php artisan key:generate

# 6. Buat database MySQL
# Buka MySQL dan jalankan:
# CREATE DATABASE pos_kasir_toko;

# 7. Konfigurasi .env
# Sesuaikan DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Sesuaikan MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY

# 8. Jalankan migration
php artisan migrate

# 9. Jalankan seeder
php artisan db:seed

# 10. Buat storage link (untuk upload gambar)
php artisan storage:link

# 11. Build frontend
npm run build
```

## Menjalankan Aplikasi

```powershell
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server (untuk development)
npm run dev
```

Akses aplikasi di: http://localhost:8000

## Deploy ke Vercel

Project ini sudah disiapkan untuk Vercel dengan:
- `api/index.php` sebagai serverless entrypoint Laravel
- `vercel.json` untuk runtime PHP + routing asset Vite (`/build/*`)
- dukungan static asset dari `public/build` (jalankan `npm run build` sebelum deploy)

### Env wajib di Vercel

Set Environment Variables berikut pada Project Vercel (Production):

```env
APP_KEY=base64:...
APP_URL=https://<domain-vercel-anda>
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_IS_PRODUCTION=false
```

Konfigurasi deploy ini default ke SQLite runtime (`/tmp/pos-kasir-toko.sqlite`) yang otomatis di-seed saat build.

## Akun Default

| Role  | Username | Password |
|-------|----------|----------|
| Admin | admin    | password |
| Kasir | kasir    | password |

## Konfigurasi Midtrans

1. Daftar akun di https://dashboard.midtrans.com
2. Dapatkan Server Key dan Client Key dari menu Settings > Access Keys
3. Update `.env`:

```
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
MIDTRANS_IS_PRODUCTION=false
```

4. Set Notification URL di dashboard Midtrans:
   - URL: `https://domain-anda.com/midtrans/notification`
   - Untuk testing lokal, gunakan ngrok atau expose

## Struktur Project

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # Controller admin
│   │   ├── Cashier/        # Controller kasir
│   │   ├── AuthController.php
│   │   └── MidtransController.php
│   └── Middleware/
│       ├── HandleInertiaRequests.php
│       └── RoleMiddleware.php
├── Models/                 # Eloquent models
└── Services/               # Business logic
    ├── MidtransService.php
    ├── StockService.php
    └── TransactionService.php

resources/js/
├── Layouts/                # Layout components
├── Pages/
│   ├── Admin/              # Halaman admin
│   ├── Auth/               # Halaman login
│   └── Cashier/            # Halaman kasir/POS
└── app.jsx                 # Entry point
```

## Testing Transaksi

### Cash
1. Login sebagai kasir (username: kasir, password: password)
2. Pilih produk, atur quantity
3. Klik "Bayar" > pilih Cash > masukkan uang bayar > Proses
4. Transaksi langsung sukses, stok berkurang

### QRIS / Transfer Bank (Midtrans)
1. Pilih produk, klik "Bayar"
2. Pilih QRIS atau Transfer Bank > Proses
3. Popup Midtrans Snap muncul
4. Ikuti instruksi pembayaran (sandbox mode)
5. Midtrans mengirim notification ke backend
6. Status transaksi diupdate otomatis

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `SQLSTATE[HY000] [1049] Unknown database` | Buat database: `CREATE DATABASE pos_kasir_toko;` |
| `Vite manifest not found` | Jalankan `npm run build` atau `npm run dev` |
| Midtrans popup tidak muncul | Pastikan Client Key benar di `.env` dan `VITE_MIDTRANS_CLIENT_KEY` terisi |
| CSRF token mismatch pada notification | Endpoint `/midtrans/notification` sudah exclude CSRF |
| Login gagal | Pastikan sudah `php artisan db:seed` dan password: `password` |
| Stok tidak berkurang | Pastikan payment_status = paid (cash langsung, Midtrans via callback) |
| 403 Unauthorized | Cek role user, admin hanya bisa akses /admin/*, kasir akses /cashier/* |

## Lisensi

MIT
