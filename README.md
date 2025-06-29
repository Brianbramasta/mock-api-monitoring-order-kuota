# Mock API Monitoring Order Kuota

Mock API untuk sistem monitoring order kuota dengan fitur search dan filter yang lengkap.

## 🚀 Fitur

- ✅ **Search & Filter** pada semua endpoint
- ✅ **Pagination** yang konsisten
- ✅ **Error Handling** yang robust
- ✅ **Date Range Filter** untuk transaksi
- ✅ **Period Filter** untuk VO ID Kode
- ✅ **Multiple Field Search** untuk transaksi
- ✅ **Case Insensitive Search**

## 📋 Daftar Endpoint

### 1. Transaksi

- `GET /api/v1/transactions/failed` - Transaksi gagal
- `GET /api/v1/transactions/pending` - Transaksi pending
- `GET /api/v1/transactions/success` - Transaksi sukses
- `GET /api/v1/transactions/complaints` - Komplain transaksi

### 2. Produk & Supplier

- `GET /api/v1/products/best-selling` - Produk terlaris
- `GET /api/v1/suppliers` - Data supplier

### 3. Monitor & Grafik

- `GET /api/v1/monitor/transactions/chart` - Grafik transaksi
- `GET /api/v1/monitor/qris/chart` - Grafik QRIS

### 4. VO ID Kode (CRUD)

- `GET /api/v1/void-codes` - Daftar VO ID Kode
- `POST /api/v1/void-codes` - Tambah VO ID Kode
- `PUT /api/v1/void-codes/:id` - Edit VO ID Kode
- `DELETE /api/v1/void-codes/:id` - Hapus VO ID Kode

### 5. Options

- `GET /api/v1/options/product-types` - Jenis produk
- `GET /api/v1/options/products` - Daftar produk

## 🔧 Instalasi & Penggunaan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Server

```bash
npm start
# atau
node server.js
```

Server akan berjalan di `http://localhost:3001`

### 3. Test API

```bash
node test_api.js
```

## 🔍 Fitur Search & Filter

### Parameter Umum

- `search` - Kata kunci pencarian
- `limit` - Jumlah data per halaman (default: 10)
- `page` - Nomor halaman (default: 1)

### Parameter Khusus

#### Transaksi (Failed, Pending, Success, Complaints)

- `start_date` - Tanggal mulai (format: YYYY-MM-DD)
- `end_date` - Tanggal akhir (format: YYYY-MM-DD)
- `search` - Mencari di: product_name, supplier_name, product_code

#### VO ID Kode

- `period` - Periode filter: `today`, `last_3_days`, `this_week`, `this_month`
- `search` - Mencari di: product_type, product_name, vd_id_code

#### Supplier

- `search` - Mencari di: supplier_name, supplier_code

#### Produk Terlaris

- `search` - Mencari di: product_name
- `limit` - Jumlah produk (default: 5)

#### Monitor Chart

- `period` - Periode: `daily`, `weekly`, `monthly`, `yearly`
- `product_id` - ID produk (untuk transaksi chart)

## 📝 Contoh Penggunaan

### 1. Transaksi Gagal dengan Filter

```bash
# Tanpa filter
GET /api/v1/transactions/failed

# Dengan search
GET /api/v1/transactions/failed?search=Telkomsel

# Dengan filter tanggal
GET /api/v1/transactions/failed?start_date=2025-06-20&end_date=2025-06-22

# Kombinasi semua
GET /api/v1/transactions/failed?search=Pulsa&start_date=2025-06-20&limit=5&page=1
```

### 2. Supplier dengan Search

```bash
# Tanpa filter
GET /api/v1/suppliers

# Dengan search
GET /api/v1/suppliers?search=Telkomsel

# Dengan pagination
GET /api/v1/suppliers?limit=3&page=1
```

### 3. VO ID Kode dengan Period Filter

```bash
# Tanpa filter
GET /api/v1/void-codes

# Dengan period filter
GET /api/v1/void-codes?period=this_week

# Dengan search
GET /api/v1/void-codes?search=PLN

# Kombinasi
GET /api/v1/void-codes?search=Data&period=this_month&limit=5
```

### 4. Produk Terlaris dengan Search

```bash
# Tanpa filter
GET /api/v1/products/best-selling

# Dengan search
GET /api/v1/products/best-selling?search=Game

# Dengan limit
GET /api/v1/products/best-selling?limit=10
```

## 📊 Response Format

Semua endpoint mengembalikan response dalam format yang konsisten:

```json
{
  "code": 200,
  "status": "success",
  "message": "Pesan sukses",
  "data": {
    // Data spesifik endpoint
    "pagination": {
      "total_data": 100,
      "total_pages": 10,
      "current_page": 1,
      "limit": 10
    }
  }
}
```

## 🛠️ Error Handling

API dilengkapi dengan error handling yang robust:

```json
{
  "code": 500,
  "status": "error",
  "message": "Terjadi kesalahan server",
  "error": "Detail error"
}
```

## 📁 Struktur File

```
├── server.js              # Server utama
├── db.json               # Database JSON
├── test_api.js           # File test API
├── package.json          # Dependencies
├── README.md             # Dokumentasi ini
└── reference/
    ├── api_contract.md   # Kontrak API lengkap
    └── search_filter_guide.md  # Panduan search & filter
```

## 🧪 Testing

Untuk memastikan API berfungsi dengan baik, jalankan:

```bash
node test_api.js
```

Test akan memverifikasi:

- ✅ Semua endpoint berfungsi
- ✅ Search dan filter bekerja
- ✅ Pagination berfungsi
- ✅ Response format konsisten

## 🔧 Development

### Menambah Data Baru

Edit file `db.json` untuk menambah data baru.

### Menambah Endpoint Baru

1. Tambahkan route di `server.js`
2. Implementasikan search/filter sesuai kebutuhan
3. Tambahkan error handling
4. Update dokumentasi

## 📞 Support

Jika ada masalah atau pertanyaan, silakan buat issue atau hubungi developer.

---

**✨ Fitur search dan filter sudah aktif dan siap digunakan!**
