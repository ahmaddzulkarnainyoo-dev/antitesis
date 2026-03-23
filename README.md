# Antitesis.id

Situs berita independen. Berani beda.

## Struktur

```
_posts/          ← semua artikel (tulis di sini atau lewat /admin)
_layouts/        ← template halaman
_includes/       ← komponen (nav, footer, dll)
assets/css/      ← stylesheet
assets/img/      ← logo & gambar statis
admin/           ← Decap CMS (pintu belakang untuk penulis)
kategori/        ← halaman per-rubrik
```

## Setup CMS (sekali aja)

1. Edit `admin/config.yml` → isi `repo: USERNAME/REPO`
2. Di GitHub repo → Settings → Pages → aktifkan
3. Buka `antitesis.id/admin` → login GitHub → mulai nulis

## Deploy

Push ke `main` → Cloudflare Pages auto-deploy.
