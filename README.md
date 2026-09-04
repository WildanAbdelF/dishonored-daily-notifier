# Dragon Nest Daily Notifier

Bot Discord yang mengirim jadwal dungeon otomatis setiap pukul 08:00 WIB.

## Struktur

```text
dishonored-daily-notifier/
├── src/
│   ├── data/schedule.json
│   ├── index.js
│   └── scheduler.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Menjalankan

1. Salin `.env.example` menjadi `.env`.
2. Isi `DISCORD_TOKEN`, `CHANNEL_ID`, dan URL gambar jika diperlukan di `.env`.
3. Ubah kombinasi dungeon tanggal 1-31 di `src/data/schedule.json`.
4. Jalankan `npm start`.

Untuk memeriksa format pesan berdasarkan tanggal hari ini tanpa login ke Discord, jalankan `npm run test:schedule`.

Jadwal menggunakan tanggal 1-31 sehingga kombinasi akan berulang setiap bulan. Jika setiap bulan memiliki rotasi berbeda, format data perlu diubah menjadi key tanggal penuh, misalnya `2026-09-04`.

## Setup Discord Bot

### 1. Buat aplikasi dan bot

1. Buka [Discord Developer Portal](https://discord.com/developers/applications), lalu pilih **New Application**.
2. Buka menu **Bot**, pilih **Add Bot**, lalu salin token bot.
3. Simpan token ke `DISCORD_TOKEN` di `.env`. Jangan membagikan token atau memasukkannya ke Git.

Bot ini hanya menggunakan intent `Guilds`, sehingga **Message Content Intent** dan **Server Members Intent** tidak perlu diaktifkan.

### 2. Undang bot ke server

Di menu **OAuth2 > URL Generator**:

- Scopes: centang `bot`.
- Bot Permissions: centang `View Channel`, `Send Messages`, dan `Embed Links`.

Salin URL yang dibuat, buka di browser, pilih server tujuan, lalu lakukan **Authorize**. Bot harus memiliki izin tersebut pada channel tempat notifikasi dikirim. Izin `Read Message History` tidak diperlukan.

### 3. Atur channel tujuan

Aktifkan **Developer Mode** di Discord melalui **User Settings > Advanced**. Klik kanan channel tujuan, pilih **Copy Channel ID**, lalu isi:

```env
CHANNEL_ID=123456789012345678
```

Untuk menampilkan gambar seperti contoh, isi URL HTTPS yang dapat diakses publik:

```env
DUNGEON_THUMBNAIL_URL=https://example.com/dungeon-thumbnail.png
DUNGEON_IMAGE_URL=https://example.com/dungeon-banner.jpg
```

### 4. Jalankan bot

```bash
npm install
npm start
```

Bot akan mengirim embed setiap hari pukul **08:00 WIB**. Proses Node.js harus tetap berjalan, misalnya pada VPS, Docker, atau komputer yang selalu menyala. Uji format tanpa login ke Discord dengan:

```bash
npm run test:schedule
```