# Virtual Try-On AI — Vercel

Demo web AI virtual try-on berbasis Next.js + Replicate.

## 1. Jalankan lokal

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local`:

```env
REPLICATE_API_TOKEN=r8_xxxxxxxxx
```

Lalu:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 2. Deploy ke Vercel

1. Upload project ini ke GitHub.
2. Di Vercel pilih **Add New → Project**.
3. Import repository GitHub.
4. Deploy.
5. Buka **Project → Settings → Environment Variables**.
6. Tambahkan:
   `REPLICATE_API_TOKEN`
7. Isi dengan API token Replicate.
8. Redeploy.

Jangan memakai prefix `NEXT_PUBLIC_` pada token.

## 3. Cara memakai

- Upload foto full-body.
- Upload foto pakaian.
- Pilih kategori.
- Isi deskripsi pakaian.
- Klik Generate.

Model yang digunakan adalah `cuuupid/idm-vton`. Perhatikan bahwa model tersebut tercantum sebagai **non-commercial use only** pada halaman model Replicate. Untuk produk komersial, ganti dengan model/API yang lisensinya mengizinkan penggunaan komersial.

## Catatan

Output dari Replicate berupa URL hasil. Untuk aplikasi produksi, tambahkan storage sendiri jika hasil harus disimpan permanen.
