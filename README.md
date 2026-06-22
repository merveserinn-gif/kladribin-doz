# DMT Doz Hesaplama

SmPC tablosuna göre kladribin dozaj, günlük tablet dağılımı ve reçete kutusu kombinasyonunu hesaplar.

## Kurulum & Deploy

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. Lokal test
```bash
npm start
```
Tarayıcıda `http://localhost:3000` açılır.

### 3. Vercel'e deploy

**Seçenek A — Vercel CLI (en hızlı):**
```bash
npm install -g vercel
vercel
```
İlk soruda `y` de, diğerlerini Enter ile geç. URL anında hazır.

**Seçenek B — GitHub üzerinden:**
1. GitHub'da yeni repo oluştur, dosyaları push et
2. vercel.com → "Add New Project" → repoyu seç
3. Framework: `Create React App` → Deploy

## Özellikler
- Vücut ağırlığına göre otomatik doz bandı (SmPC tablosu)
- Hafta 1 / Hafta 2 ayrı doz gösterimi
- Günlük tablet dağılımı (10 mg / 20 mg)
- Reçete için optimal kutu kombinasyonu (1'li, 4'lü, 6'lı ambalaj)
- 2 yıllık kümülatif özet
