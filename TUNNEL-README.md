# Cloudflare Tunnel untuk POS Kasir Toko

## Informasi Tunnel
- **Tunnel ID**: e83d09a0-88aa-4f0b-8ce7-2c3466b8a4c3
- **Tunnel Name**: pos-kasir-toko
- **Public URL**: https://pos-kasir-toko.codeunchs.my.id
- **Local URL**: http://localhost:8000

## File yang Dibuat
1. `cloudflared-config.yml` - Konfigurasi tunnel
2. `start-tunnel.bat` - Menjalankan tunnel saja
3. `stop-tunnel.bat` - Menghentikan tunnel
4. `start-all.bat` - Menjalankan Laravel + tunnel

## Cara Menggunakan

### 1. Jalankan Laravel dan Tunnel Bersamaan
```powershell
start-all.bat
```

### 2. Jalankan Tunnel Saja (jika Laravel sudah berjalan)
```powershell
start-tunnel.bat
```

### 3. Hentikan Tunnel
```powershell
stop-tunnel.bat
```

## Persyaratan
1. Aplikasi Laravel harus berjalan di `http://localhost:8000`
2. Cloudflared sudah terinstal
3. Sudah login ke Cloudflare (jika belum, jalankan: `cloudflared tunnel login`)

## Konfigurasi Midtrans untuk Tunnel
Karena aplikasi sekarang dapat diakses dari internet, Anda perlu mengupdate:
1. **Notification URL di dashboard Midtrans**: `https://pos-kasir-toko.codeunchs.my.id/midtrans/notification`
2. **`.env` file**: Pastikan `APP_URL` diatur ke URL tunnel

## Troubleshooting
- **Tunnel tidak connect**: Pastikan Laravel berjalan di port 8000
- **DNS error**: Cek DNS record di dashboard Cloudflare
- **403 errors**: Pastikan CORS di Laravel mengizinkan domain tunnel

## Keamanan
- File credentials di `C:\Users\Pongo\.cloudflared\e83d09a0-88aa-4f0b-8ce7-2c3466b8a4c3.json` harus dijaga kerahasiaannya
- Tunnel menggunakan HTTPS secara otomatis
- Cloudflare memberikan proteksi DDoS gratis