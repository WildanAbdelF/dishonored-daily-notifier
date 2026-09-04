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
2. Isi `DISCORD_TOKEN` dan `CHANNEL_ID` di `.env`.
3. Ubah kombinasi dungeon tanggal 1-31 di `src/data/schedule.json`.
4. Jalankan `npm start`.

Untuk memeriksa format pesan berdasarkan tanggal hari ini tanpa login ke Discord, jalankan `npm run test:schedule`.

Jadwal menggunakan tanggal 1-31 sehingga kombinasi akan berulang setiap bulan. Jika setiap bulan memiliki rotasi berbeda, format data perlu diubah menjadi key tanggal penuh, misalnya `2026-09-04`.