# Belajar Kecil

Permainan interaktif untuk anak usia 3–6 tahun. Tanpa akun, tanpa iklan, tanpa backend.
Target deploy: **static export** (`out/`) → hosting gratis.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4 (CSS-first, token di `@theme` — **tidak ada** `tailwind.config.js`)
- `motion` (framer-motion) untuk animasi reward
- Zustand + `persist` → localStorage
- Audio: musik latar + suara hewan dari file CC0 (`public/sounds/`), SFX disintesis Web Audio

## Commands

```bash
npm run dev              # localhost:3000
npm run build            # static export ke out/
npm run typecheck        # tsc --noEmit
node scripts/serve.mjs   # preview out/ di localhost:3111
```

## Deploy gratis (pilih satu, semua gratis)

| Host | Setting |
|---|---|
| **Cloudflare Pages** | Build `npm run build` · Output `out` |
| **Netlify** | Build `npm run build` · Publish `out` |
| **Vercel** | Auto-detect Next.js (Hobby plan gratis) |
| **GitHub Pages** | Upload isi `out/` ke branch `gh-pages` |

Tidak perlu env var, database, atau server. Semua state ada di `localStorage` perangkat.

## Aturan main (wajib, usia 3–6)

| Constraint | Nilai | Alasan |
|---|---|---|
| Min target sentuh | **96×96px** | Usia 3 tahun masih imprecise; miss-rate tinggi di bawah 60px |
| Jarak antar target | ≥ 16px | Cegah salah-tap |
| Durasi sesi | 5–10 menit | Attention span usia 3–6 |
| Instruksi berbasis teks | **0** | Instruksi = gambar + suara |
| Bahasa | Indonesia, kosakata harian | — |
| Maks step per game | 8–10 | Cegah fatigue |

**Catatan QA:** mengukur tap target saat animasi `pop-in` berjalan menghasilkan angka palsu
(`scale(0.6)` → 112px tampak 67px). Selalu tunggu ≥1.5s sebelum mengukur.

## Gotcha yang sudah ditangani (jangan diubah)

- `touch-action: manipulation` di semua button — tanpa ini ada **delay 300ms per tap di iOS**
- `navigator.vibrate` **tidak ada** di iOS Safari — selalu guard `"vibrate" in navigator`
- `AudioContext` harus di-resume dari dalam user gesture, kalau tidak tidak bunyi di iOS
- HTML5 native drag-and-drop **tidak jalan di touch** — pakai Pointer Events + `setPointerCapture`
- `useGame` guard `phase !== "playing"` mencegah double-tap skip beberapa level
- **Grading wajib dibandingkan ke `level.answer`.** Jangan pernah menilai dari state selection
  sendiri (mis. `picked.length === n`) — itu melingkar dan membuat anak selalu "benar"
- Setiap `Board` di-`key={ctx.level.id}` — tanpa ini state (`chosen`/`picked`/`basketed`)
  carry-over antar level dan level baru mulai dengan sisa pilihan sebelumnya
- localStorage dibungkus try/catch (Safari private mode melempar `QuotaExceededError`)
- Key progress berversi (`belajar-kecil-v1`) — ganti struktur = ganti key
- Bintang **tidak pernah turun** (`Math.max`) — anak yang lihat skor turun akan berhenti main

## Keputusan arsitektur: static export

### 1. Route statis eksplisit, bukan `[id]` dinamis

`/main/<game>/` dibuat sebagai 6 folder route statis, bukan `/main/[id]/`.
Dynamic route + `output: export` membuat Next meminta payload RSC dengan nama
`__next.main.$d$id.__PAGE__.txt` (pemisah titik), sedangkan file hasil export ada di
`__next.main/$d$id/__PAGE__.txt` (pemisah slash). Static host biasa tidak me-rewrite ini → 404.

### 2. Navigasi pakai `<a>`, bukan `next/link`

Karena payload RSC per-halaman tidak bisa dilayani static host (lihat di atas), client-side
routing Next **selalu gagal dan fallback ke full page load**. `<Link>` hanya menambah request
404 yang gagal tanpa manfaat. Halaman kecil sehingga full load tidak terasa.

Konsekuensi: `onHome` memakai `window.location.assign("/")`, bukan `router.push`.
`useRouter` hanya dipakai untuk redirect id game yang tidak dikenal.

### 3. Satu registry game

`src/games/registry.ts` adalah **satu-satunya** tempat mendaftarkan game.
`World` (peta) dan `GameLoader` sama-sama membacanya.

## Struktur: tambah game baru

```
src/games/<nama-game>/
  index.tsx    # export default Component({onHome}) + export { GAME as <nama>Meta }
  levels.ts    # pool soal, ZERO logika
```

Lalu:
1. Tambah 1 baris di `src/games/registry.ts`
2. Buat `src/app/main/<nama-game>/page.tsx`:
   ```tsx
   import GameLoader from "@/games/GameLoader";
   export default function Page() {
     return <GameLoader id="<nama-game>" />;
   }
   ```
3. `npm run build`

## Anti-bosan: randomisasi wajib

Keluhan awal: "permainannya dikit, ga random, monoton". Tiga lapis solusi, jangan
dicabut salah satunya:

1. **Sesi acak** — `useGame` mengambil `SESSION_SIZE` (8) soal acak dari pool lewat
   `randomSession()`, jadi urutan & pilihan soal beda tiap kali main. Pool tiap game
   minimal ~24 soal.
2. **Opsi diacak** — game ber-opsi memakai `shuffleOptions(level)` yang me-remap indeks
   jawaban. Grading **wajib** `i === correctIndex` hasil remap, bukan `level.answer` mentah.
3. **Variasi mekanik** — 10 game menyentuh mekanik berbeda: hitung, drag, cocokkan,
   pola, dengar-nada, jejak, ingatan-cangkir, gelembung, bandingkan, tiru-urutan.
   Tombol "Kejutkan aku!" di home melempar ke game acak.

Reward juga divariasikan (`PRAISE`/`PARTY`/sparkles acak) supaya layar selesai tidak
terasa sama terus.

### Pola harus punya jawaban TUNGGAL

`pattern-next` menampilkan **minimal dua siklus penuh** (4 atau 6 elemen) supaya jawabannya
tidak ambigu. Pola 3 elemen seperti `🔴🔵🔴` itu ambigu — lanjutannya bisa `🔵` (selang-seling)
atau `🔴` (siklus 3); anak yang menjawab "salah" sebenarnya juga benar secara logika.

Jangan hitung "elemen berikutnya" dari urutan (logika `nextOf` lama salah dan bikin pola
seperti hijau-hijau-ungu-ungu). Simpan jawaban **eksplisit** di `CARDS`. Tiga keluarga yang aman:

| Bentuk | Contoh | Jawaban |
|---|---|---|
| Selang-seling | `A B A B` | A |
| Dobel | `A A B B` | A |
| Siklus tiga | `A B C A B C` | A |

Verifikasi: `minPeriod(seq)` → jawaban harus `seq[len % period]`, dan **hanya satu** opsi yang cocok.

### Audio: file CC0 + fallback sintesis

Suara hewan kini **rekaman asli** di `public/sounds/animals/*.mp3`, dan ada **musik latar**
`public/sounds/bgm.mp3` (lihat `public/sounds/CREDITS.md` — semua CC0 / public domain).
`src/lib/animalSounds.ts` memutar file; kalau gagal dimuat/diputar, ia jatuh ke sintesis Web
Audio (`VOICES`) supaya game tetap berbunyi tanpa aset.

Pengaturan suara: `src/store/settings.ts` (`soundOn`, persist) + tombol `SoundToggle` di home
dan header game. Musik dikelola `src/lib/music.ts`: satu elemen loop, **diputar setelah gesture
pertama** (kebijakan autoplay iOS/Chrome), dijeda saat tab disembunyikan. `sfx` (Web Audio) dan
`playAnimal` no-op saat `soundOn` mati.

Jangan kembali ke `playMelody` untuk game Dengar: anak **tidak mungkin** tahu bahwa "🐶 = nada
sol-sol-la". Suara harus terdengar seperti hewannya. Suara juga **auto-play** saat level mulai
(setelah gesture pertama), tidak menunggu anak menekan tombol.

Menambah hewan baru: taruh `public/sounds/animals/<id>.mp3` + entri di `ANIMAL_LABEL`; kalau
file tidak ada, otomatis pakai sintesis.

## Struktur folder

```
src/games/
  registry.ts          # SATU-SATUNYA tempat mendaftar game
  GameLoader.tsx       # lookup id -> komponen
  _shared/             # types, useGame, GameShell
  drag-numbers/        # 1 folder = 1 game (index.tsx + levels.ts)
  count-and-drag/  color-mix/  pattern-next/  hear-choose/  shape-trace/
  cari-balik/  bubble-pop/  bandingkan/  simon/  cocokkan/
```


## Keputusan desain: UI

Project ini **tidak** mengikuti `.opencode/ui.md` secara harfiah. Rulebook itu untuk produk SaaS
profesional (Vercel/Stripe/Linear). Aturan yang **tetap dipatuhi**:

- No `backdrop-blur` pada kartu (glassmorphism berlebihan)
- No gradien pada teks, no blur orb, no mesh gradient
- No copy klise AI — hanya kalimat fungsional
- Border tipis solid, bukan blur

Aturan yang **sengaja dilanggar**, beserta alasannya:

| Aturan ui.md | Alasan deviasi |
|---|---|
| No emoji/stiker | Emoji = **operand kurikulum**. `🍎` di game Angka adalah yang harus dihitung anak. SVG merusaknya secara pedagogis. |
| Maks 1 warna aksen | 4 warna soft (sky/sun/grass/bubble) = pembatas zona (keranjang vs area drop vs target). Warna adalah navigasi utama anak usia 3 tahun. |
| `rounded-md`–`rounded-lg` | Radius besar = affordance, bukan hiasan. Bentuk bulat adalah cara anak 3 tahun mengenali target. |
| Font Inter/Geist | Baloo 2 (rounded, x-height besar) adalah keputusan aksesibilitas. Inter membuat `a`/`g` bertabrakan untuk anak yang baru mengeja. |
| Vivid colors | Soft saturated (oklch L≈0.85) agar tidak menyilaukan, bukan desaturate ke abu-abu. |

Kalau ada yang mengulang permintaan "terapkan ui.md penuh", tunjukkan tabel di atas
sebelum mengubah apa pun.
