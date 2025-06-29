# Panduan Search dan Filter API

Dokumentasi ini menjelaskan cara menggunakan fitur search dan filter yang telah ditambahkan pada setiap endpoint API.

## 1. Transaksi Gagal

**Endpoint:** `GET /api/v1/transactions/failed`

### Parameter Query yang Tersedia:

- `start_date`: Tanggal mulai filter (format: YYYY-MM-DD)
- `end_date`: Tanggal akhir filter (format: YYYY-MM-DD)
- `search`: Kata kunci pencarian (mencari di: product_name, supplier_name, product_code)
- `limit`: Jumlah data per halaman (default: 10)
- `page`: Nomor halaman (default: 1)

### Contoh Penggunaan:

```bash
# Mencari transaksi gagal dengan kata kunci "Telkomsel"
GET /api/v1/transactions/failed?search=Telkomsel

# Filter berdasarkan rentang tanggal
GET /api/v1/transactions/failed?start_date=2025-06-20&end_date=2025-06-22

# Kombinasi search dan filter tanggal
GET /api/v1/transactions/failed?search=Pulsa&start_date=2025-06-20&end_date=2025-06-22

# Pagination dengan limit 5
GET /api/v1/transactions/failed?limit=5&page=1
```

---

## 2. Transaksi Pending

**Endpoint:** `GET /api/v1/transactions/pending`

### Parameter Query yang Tersedia:

- `start_date`: Tanggal mulai filter (format: YYYY-MM-DD)
- `end_date`: Tanggal akhir filter (format: YYYY-MM-DD)
- `search`: Kata kunci pencarian (mencari di: product_name, supplier_name, product_code)
- `limit`: Jumlah data per halaman (default: 10)
- `page`: Nomor halaman (default: 1)

### Contoh Penggunaan:

```bash
# Mencari transaksi pending dengan kata kunci "PLN"
GET /api/v1/transactions/pending?search=PLN

# Filter berdasarkan tanggal tertentu
GET /api/v1/transactions/pending?start_date=2025-06-22

# Kombinasi search dan pagination
GET /api/v1/transactions/pending?search=BPJS&limit=5&page=1
```

---

## 3. Transaksi Sukses

**Endpoint:** `GET /api/v1/transactions/success`

### Parameter Query yang Tersedia:

- `start_date`: Tanggal mulai filter (format: YYYY-MM-DD)
- `end_date`: Tanggal akhir filter (format: YYYY-MM-DD)
- `search`: Kata kunci pencarian (mencari di: product_name, supplier_name, product_code)
- `limit`: Jumlah data per halaman (default: 10)
- `page`: Nomor halaman (default: 1)

### Contoh Penggunaan:

```bash
# Mencari transaksi sukses dengan kata kunci "Game"
GET /api/v1/transactions/success?search=Game

# Filter berdasarkan rentang tanggal
GET /api/v1/transactions/success?start_date=2025-06-20&end_date=2025-06-22

# Kombinasi semua parameter
GET /api/v1/transactions/success?search=XL&start_date=2025-06-20&limit=3&page=1
```

---

## 4. Komplain Transaksi

**Endpoint:** `GET /api/v1/transactions/complaints`

### Parameter Query yang Tersedia:

- `start_date`: Tanggal mulai filter (format: YYYY-MM-DD)
- `end_date`: Tanggal akhir filter (format: YYYY-MM-DD)
- `search`: Kata kunci pencarian (mencari di: product_name, supplier_name, product_code)
- `limit`: Jumlah data per halaman (default: 10)
- `page`: Nomor halaman (default: 1)

### Contoh Penggunaan:

```bash
# Mencari komplain dengan kata kunci "Indosat"
GET /api/v1/transactions/complaints?search=Indosat

# Filter berdasarkan tanggal
GET /api/v1/transactions/complaints?end_date=2025-06-21

# Kombinasi search dan pagination
GET /api/v1/transactions/complaints?search=Telkomsel&limit=2&page=1
```

---

## 5. Produk Terlaris

**Endpoint:** `GET /api/v1/products/best-selling`

### Parameter Query yang Tersedia:

- `search`: Kata kunci pencarian (mencari di: product_name)
- `limit`: Jumlah data produk yang ditampilkan (default: 5)

### Contoh Penggunaan:

```bash
# Mencari produk terlaris dengan kata kunci "Pulsa"
GET /api/v1/products/best-selling?search=Pulsa

# Menampilkan 10 produk terlaris
GET /api/v1/products/best-selling?limit=10

# Kombinasi search dan limit
GET /api/v1/products/best-selling?search=Game&limit=3
```

---

## 6. Supplier

**Endpoint:** `GET /api/v1/suppliers`

### Parameter Query yang Tersedia:

- `search`: Kata kunci pencarian (mencari di: supplier_name, supplier_code)
- `limit`: Jumlah data per halaman (default: 10)
- `page`: Nomor halaman (default: 1)

### Contoh Penggunaan:

```bash
# Mencari supplier dengan kata kunci "Telkomsel"
GET /api/v1/suppliers?search=Telkomsel

# Pagination dengan limit 3
GET /api/v1/suppliers?limit=3&page=1

# Kombinasi search dan pagination
GET /api/v1/suppliers?search=API&limit=2&page=2
```

---

## 7. Monitor Transaksi (Grafik)

**Endpoint:** `GET /api/v1/monitor/transactions/chart`

### Parameter Query yang Tersedia:

- `period`: Filter periode (opsional, default: 'monthly')
  - Pilihan: `daily`, `weekly`, `monthly`, `yearly`
- `product_id`: ID produk untuk filter (opsional)

### Contoh Penggunaan:

```bash
# Filter berdasarkan periode harian
GET /api/v1/monitor/transactions/chart?period=daily

# Filter berdasarkan periode mingguan
GET /api/v1/monitor/transactions/chart?period=weekly

# Filter berdasarkan product_id
GET /api/v1/monitor/transactions/chart?product_id=1
```

---

## 8. Monitor QRIS (Grafik)

**Endpoint:** `GET /api/v1/monitor/qris/chart`

### Parameter Query yang Tersedia:

- `period`: Filter periode (opsional, default: 'monthly')
  - Pilihan: `daily`, `weekly`, `monthly`, `yearly`

### Contoh Penggunaan:

```bash
# Filter berdasarkan periode bulanan
GET /api/v1/monitor/qris/chart?period=monthly

# Filter berdasarkan periode tahunan
GET /api/v1/monitor/qris/chart?period=yearly
```

---

## 9. VO ID Kode

**Endpoint:** `GET /api/v1/void-codes`

### Parameter Query yang Tersedia:

- `period`: Filter periode (opsional)
  - Pilihan: `today`, `last_3_days`, `this_week`, `this_month`
- `search`: Kata kunci pencarian (mencari di: product_type, product_name, vd_id_code)
- `limit`: Jumlah data per halaman (default: 10)
- `page`: Nomor halaman (default: 1)

### Contoh Penggunaan:

```bash
# Mencari VO ID Kode dengan kata kunci "Pulsa"
GET /api/v1/void-codes?search=Pulsa

# Filter berdasarkan periode hari ini
GET /api/v1/void-codes?period=today

# Filter berdasarkan periode 3 hari terakhir
GET /api/v1/void-codes?period=last_3_days

# Filter berdasarkan periode minggu ini
GET /api/v1/void-codes?period=this_week

# Filter berdasarkan periode bulan ini
GET /api/v1/void-codes?period=this_month

# Kombinasi search dan periode
GET /api/v1/void-codes?search=PLN&period=this_month

# Kombinasi semua parameter
GET /api/v1/void-codes?search=Data&period=this_week&limit=5&page=1
```

---

## 10. Options - Product Types

**Endpoint:** `GET /api/v1/options/product-types`

Tidak memiliki parameter query, hanya mengembalikan daftar jenis produk.

### Contoh Penggunaan:

```bash
GET /api/v1/options/product-types
```

---

## 11. Options - Products

**Endpoint:** `GET /api/v1/options/products`

### Parameter Query yang Tersedia:

- `search`: Kata kunci pencarian (mencari di: name)
- `limit`: Jumlah data per halaman (default: 100)
- `page`: Nomor halaman (default: 1)

### Contoh Penggunaan:

```bash
# Mencari produk dengan kata kunci "Telkomsel"
GET /api/v1/options/products?search=Telkomsel

# Pagination dengan limit 5
GET /api/v1/options/products?limit=5&page=1

# Kombinasi search dan pagination
GET /api/v1/options/products?search=Game&limit=3&page=2
```

---

## Catatan Penting

1. **Case Insensitive**: Semua pencarian bersifat case insensitive (tidak membedakan huruf besar/kecil)

2. **Partial Match**: Pencarian menggunakan partial match, jadi mencari "Tel" akan menemukan "Telkomsel"

3. **Multiple Fields**: Pencarian pada transaksi akan mencari di multiple fields (product_name, supplier_name, product_code)

4. **Date Format**: Format tanggal harus menggunakan format ISO (YYYY-MM-DD)

5. **Pagination**: Semua endpoint yang mendukung pagination akan mengembalikan informasi pagination dalam response

6. **Filter Combination**: Semua filter dan search dapat dikombinasikan

7. **Default Values**: Jika parameter tidak diberikan, akan menggunakan nilai default yang telah ditentukan

---

## Contoh Response dengan Filter

Berikut contoh response ketika menggunakan filter:

```json
{
  "code": 200,
  "status": "success",
  "message": "Data transaksi gagal berhasil diambil",
  "data": {
    "recap": {
      "most_failed_product_name": "Pulsa Telkomsel 25rb",
      "total_failed_transactions": 7,
      "total_failed_nominal": 178500.0,
      "total_products": 1
    },
    "transactions": [
      {
        "no": 4,
        "date": "2025-06-20",
        "product_name": "Pulsa Telkomsel 25rb",
        "supplier_name": "Supplier E",
        "product_code": "TSEL25K",
        "price": 25500.0,
        "quantity": 7
      }
    ],
    "pagination": {
      "total_data": 1,
      "total_pages": 1,
      "current_page": 1,
      "limit": 10
    }
  }
}
```

Dalam contoh di atas, filter `search=Telkomsel` telah diterapkan dan hanya mengembalikan 1 data yang sesuai dengan kriteria pencarian.
