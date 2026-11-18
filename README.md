# StockForge AI — Microstock Production Asset Studio (Atelier Edition)

Aplikasi mobile native untuk memproduksi aset microstock (foto, ilustrasi,
video, vector) dengan **6 AI Agents 100% offline** — tanpa API key, tanpa
server, tanpa langganan. Ketik tema dalam Bahasa Indonesia, aplikasi
menghasilkan Master Prompt studio-grade + metadata Global English
(title, description, kategori resmi, keyword maksimal per platform)
yang siap upload ke Adobe Stock, Shutterstock, Vecteezy, Dreamstime,
Freepik, iStock, Pond5, dan Depositphotos/123RF.

> **Repository:** [`simoneambatukam-glitch/stock-forge-ai`](https://github.com/simoneambatukam-glitch/stock-forge-ai)
> (nama paket npm tetap `stockforge-ai-mobile` — hanya nama repo GitHub yang
> memakai tanda hubung: **stock-forge-ai**).

![Platform](https://img.shields.io/badge/Capacitor-v6-119EFF)
![Offline](https://img.shields.io/badge/offline-100%25-10B981)
![API Key](https://img.shields.io/badge/API%20key-0%20dibutuhkan-E5C158)

## ✨ Fitur

- **6 AI Agents (algoritmik, 0 API key)**
  1. **Platform Compliance** — aturan ketat 8 platform microstock.
  2. **Taxonomy Resolver** — Foto (8 format / 18 gaya), Ilustrasi (8/18),
     Video (17 format + rasio 16:9/9:16 + gerak kamera + looping + 16 gaya),
     Vector (9 format / 39 gaya).
  3. **English Transcreator** — kamus 461 istilah ID→EN (termasuk kuliner
     nusantara: `sahur` → `suhoor pre-dawn meal`, `sosis solo` →
     `traditional savory crepe roll snack`) + filter ketat agar **seluruh
     output 100% Bahasa Inggris murni**.
  4. **Master Prompt Engineer** — master prompt studio-grade + negative
     prompt anti-artefak.
  5. **Background Advisor** — rekomendasi Transparan / Isolated Solid
     White / Background Tetap + alasan teknis & psikologi buyer.
  6. **Overpowered Keyword Ranker** — keyword maksimal tiap platform
     dengan sorotan **Top 15 Keyword Pertama yang Paling Krusial**.
- **Saran Asset AI** — 4 rekomendasi lintas format dari satu deskripsi,
  sekali tap langsung diterapkan & di-generate ulang.
- **Riwayat Produksi** — tersimpan otomatis di perangkat (maks 40 item),
  muat ulang ke Studio, hapus satuan, Hapus Riwayat (konfirmasi 2 langkah).
- **Export CSV** — via Capacitor Filesystem + Share (di browser: download
  biasa). Salin via Capacitor Clipboard (fallback otomatis).
- **Dual Luxury Theme** — Obsidian Velvet (default, `#030D0A`) &
  Champagne Pearl (`#F6FAF8`), bisa diganti dari header.
- **60fps Silk Aurora & Bokeh Canvas** — gelombang aurora emerald-gold,
  astrolabe berputar, partikel bokeh yang merespons sentuhan, dan
  *energy burst* saat tombol GENERATE ditekan. Otomatis pause saat
  aplikasi tidak aktif (hemat baterai).
- **Animated Luxury Splash Screen** — bisa diputar ulang via tombol
  Splash di header.
- **Tactile Ripple + Web Audio Glass Synthesizer** — bunyi kristal halus
  + haptics di setiap tap, tombol Mute/Unmute di header.
- **Bespoke App Icon 1024×1024** — Emerald-Gold Faceted Prism & AI Spark
  (`assets/icon-only.svg` + `assets/splash.svg`), bisa diunduh sebagai
  PNG/SVG dari tab App Icon.

## ⚠️ Aturan platform yang dipakai (sudah dikoreksi & dites)

| Platform | Title | Description | Keyword |
|---|---|---|---|
| Adobe Stock | maks 200 char (ideal 70–150), **tanpa koma** | **tidak ada field** (Title = metadata utama) | maks 49 |
| Shutterstock | = Description, maks 200 char | digabung dengan Title | maks 50 |
| Vecteezy | **wajib 3–8 kata & <70 char** | tidak ada | maks 50* |
| Dreamstime | maks 115 char | maks 200 char | maks 80 |
| Freepik | maks 100 char | opsional maks 300 | maks 50 |
| iStock / Getty | maks 150 char | wajib + jumlah subjek (`no people` / `one person` / `group of people`) | maks 50 |
| Pond5 | maks 120 char | disarankan | maks 50 |
| Depositphotos / 123RF | maks 160 char | disarankan maks 255 | maks 50 |

\* Vecteezy: beberapa sumber menyebut maks keyword 30 (bukan 50) — cek
halaman upload sebelum submit; keyword tidak bisa diubah setelah submit.

> **PERINGATAN KERAS — Shutterstock:** Shutterstock **TIDAK menerima konten
> AI dari kontributor** (aturan resmi 16 Jul 2025). Aplikasi menampilkan
> banner peringatan setiap kali Shutterstock dipilih. Jangan upload aset AI
> ke sana — hanya file yang digambar/difoto manual.

## 📁 Struktur proyek

```text
stockforge-ai-mobile/
├── .github/workflows/build-android-apk.yml   # build APK otomatis (Actions)
├── assets/
│   ├── icon-only.svg                        # master ikon 1024x1024
│   └── splash.svg                           # splash screen 1024x1024
├── www/
│   ├── index.html                           # app fullscreen mobile
│   ├── css/luxury.css                       # Dual Theme + utility CSS murni
│   └── js/
│       ├── lexicon.js                       # kamus ID→EN 461 istilah
│       ├── taxonomy.js                      # aturan 8 platform + taksonomi
│       ├── agents.js                        # 6 agen (fungsi murni)
│       ├── aurora-engine.js                 # canvas aurora 60fps
│       ├── sound-haptics.js                 # Web Audio + Haptics
│       └── app.js                           # controller UI + Capacitor bridge
├── capacitor.config.json                    # appId com.stockforge.atelier.ai
├── package.json                             # Capacitor v6
└── README.md
```

Folder `android/` dan `ios/` **tidak di-commit** — dibuat otomatis oleh
`npx cap add` (lokal) atau oleh GitHub Actions (CI).

## 🤖 Build APK otomatis (GitHub Actions)

Setiap `git push` ke branch `main` (atau manual via **Actions →
Build Android APK → Run workflow**), workflow akan:

1. Setup Node.js 20, Java JDK 17, Android SDK.
2. `npm ci` → `npx cap add android` (bila belum ada) → `npx cap sync android`.
3. `npx capacitor-assets generate --android` (ikon & splash dari `assets/`).
4. `./gradlew assembleDebug` → APK diganti nama menjadi
   **`StockForge-AI-Atelier-v1.0.apk`**.
5. APK diunggah ke **Actions Artifacts** dan dibuatkan **GitHub Release**
   otomatis (`v1.0.<run_number>`).

**Cara install:** buka tab **Releases** di repo, unduh APK-nya, lalu
sideload di HP Android (izinkan "Install unknown apps" sekali saja).

## 🛠️ Setup repo (sekali saja)

```bash
# 1. Buat repo GitHub baru bernama: stock-forge-ai (public)
# 2. Dari folder proyek ini:
git init
git add .
git commit -m "feat: StockForge AI Mobile Atelier v1.0.0 — Capacitor v6 offline"
git branch -M main
git remote add origin https://github.com/simoneambatukam-glitch/stock-forge-ai.git
git push -u origin main
# 3. Tunggu workflow selesai (±5–10 menit) → APK ada di tab Releases.
```

## 💻 Build lokal (opsional)

```bash
npm install
npx cap add android            # sekali saja — membuat folder android/
npx capacitor-assets generate --android
npx cap sync android
npx cap open android           # buka di Android Studio, lalu Run
```

## 🔒 100% offline

Tidak ada CDN, font eksternal, atau request jaringan apa pun di `www/`:
tanpa Tailwind CDN, tanpa Google Fonts. Semua CSS ditulis murni di
`css/luxury.css`, font memakai system stack (Playfair Display / Plus
Jakarta Sans / JetBrains Mono dengan fallback Georgia / system sans /
monospace). Seluruh mesin AI berjalan lokal di perangkat — tidak ada data
yang keluar dari HP.

## 📄 Lisensi

Proyek pribadi — seluruh hak cipta pada pemilik repository.
