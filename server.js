const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Helper untuk pagination
function paginate(array, page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return array.slice(start, end);
}

// Helper untuk ambil query param
function getQueryInt(req, key, def = 1) {
  return req.query[key] ? parseInt(req.query[key]) : def;
}

// 1. Transaksi Gagal
server.get('/api/v1/transactions/failed', (req, res) => {
  const db = router.db;
  let data = db.get('transactions_failed').value() || [];
  // Filter, search, dsb bisa dikembangkan
  const limit = getQueryInt(req, 'limit', 10);
  const page = getQueryInt(req, 'page', 1);
  const pagedData = paginate(data, page, limit);
  const recap = {
    most_failed_product_name: data[0]?.product_name || '',
    total_failed_transactions: data.reduce((acc, cur) => acc + cur.quantity, 0),
    total_failed_nominal: data.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0),
    total_products: data.length
  };
  res.json({
    code: 200,
    status: 'success',
    message: 'Data transaksi gagal berhasil diambil',
    data: {
      recap,
      transactions: pagedData,
      pagination: {
        total_data: data.length,
        total_pages: Math.ceil(data.length / limit),
        current_page: page,
        limit
      }
    }
  });
});

// 2. Transaksi Pending
server.get('/api/v1/transactions/pending', (req, res) => {
  const db = router.db;
  let data = db.get('transactions_pending').value() || [];
  const limit = getQueryInt(req, 'limit', 10);
  const page = getQueryInt(req, 'page', 1);
  const pagedData = paginate(data, page, limit);
  const recap = {
    most_pending_product_name: data[0]?.product_name || '',
    total_pending_transactions: data.reduce((acc, cur) => acc + cur.quantity, 0),
    total_pending_nominal: data.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0),
    total_products: data.length
  };
  res.json({
    code: 200,
    status: 'success',
    message: 'Data transaksi pending berhasil diambil',
    data: {
      recap,
      transactions: pagedData,
      pagination: {
        total_data: data.length,
        total_pages: Math.ceil(data.length / limit),
        current_page: page,
        limit
      }
    }
  });
});

// 3. Transaksi Sukses
server.get('/api/v1/transactions/success', (req, res) => {
  const db = router.db;
  let data = db.get('transactions_success').value() || [];
  const limit = getQueryInt(req, 'limit', 10);
  const page = getQueryInt(req, 'page', 1);
  const pagedData = paginate(data, page, limit);
  const recap = {
    most_successful_product_name: data[0]?.product_name || '',
    total_successful_transactions: data.reduce((acc, cur) => acc + cur.quantity, 0),
    total_successful_nominal: data.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0),
    total_products: data.length
  };
  res.json({
    code: 200,
    status: 'success',
    message: 'Data transaksi sukses berhasil diambil',
    data: {
      recap,
      transactions: pagedData,
      pagination: {
        total_data: data.length,
        total_pages: Math.ceil(data.length / limit),
        current_page: page,
        limit
      }
    }
  });
});

// 4. Komplain Transaksi
server.get('/api/v1/transactions/complaints', (req, res) => {
  const db = router.db;
  let data = db.get('transactions_complaints').value() || [];
  const limit = getQueryInt(req, 'limit', 10);
  const page = getQueryInt(req, 'page', 1);
  const pagedData = paginate(data, page, limit);
  const recap = {
    total_complaint_transactions: data.length,
    total_complaint_nominal: data.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0)
  };
  res.json({
    code: 200,
    status: 'success',
    message: 'Data komplain transaksi berhasil diambil',
    data: {
      recap,
      transactions: pagedData,
      pagination: {
        total_data: data.length,
        total_pages: Math.ceil(data.length / limit),
        current_page: page,
        limit
      }
    }
  });
});

// 5. Produk Terlaris
server.get('/api/v1/products/best-selling', (req, res) => {
  const db = router.db;
  let data = db.get('products_best_selling').value() || [];
  const limit = getQueryInt(req, 'limit', 5);
  const pagedData = paginate(data, 1, limit);
  res.json({
    code: 200,
    status: 'success',
    message: 'Data produk terlaris berhasil diambil',
    data: {
      products: pagedData
    }
  });
});

// 6. Supplier
server.get('/api/v1/suppliers', (req, res) => {
  const db = router.db;
  let data = db.get('suppliers').value() || [];
  const limit = getQueryInt(req, 'limit', 10);
  const page = getQueryInt(req, 'page', 1);
  const pagedData = paginate(data, page, limit);
  res.json({
    code: 200,
    status: 'success',
    message: 'Data supplier berhasil diambil',
    data: {
      suppliers: pagedData,
      pagination: {
        total_data: data.length,
        total_pages: Math.ceil(data.length / limit),
        current_page: page,
        limit
      }
    }
  });
});

// 7. Monitor Transaksi (Grafik Area)
server.get('/api/v1/monitor/transactions/chart', (req, res) => {
  const db = router.db;
  let data = db.get('monitor_transactions_chart').value() || [];
  res.json({
    code: 200,
    status: 'success',
    message: 'Data monitor transaksi berhasil diambil',
    data: {
      chart_data: data
    }
  });
});

// 8. Monitor QRIS (Grafik Area)
server.get('/api/v1/monitor/qris/chart', (req, res) => {
  const db = router.db;
  let data = db.get('monitor_qris_chart').value() || [];
  res.json({
    code: 200,
    status: 'success',
    message: 'Data monitor QRIS berhasil diambil',
    data: {
      chart_data: data
    }
  });
});

// 9. Pengelolaan VO ID Kode
// a. Daftar
server.get('/api/v1/void-codes', (req, res) => {
  const db = router.db;
  let data = db.get('void_codes').value() || [];
  const limit = getQueryInt(req, 'limit', 10);
  const page = getQueryInt(req, 'page', 1);
  const pagedData = paginate(data, page, limit);
  res.json({
    code: 200,
    status: 'success',
    message: 'Data VO ID Kode berhasil diambil',
    data: {
      void_codes: pagedData,
      pagination: {
        total_data: data.length,
        total_pages: Math.ceil(data.length / limit),
        current_page: page,
        limit
      }
    }
  });
});
// b. Tambah
server.post('/api/v1/void-codes', (req, res) => {
  const db = router.db;
  const { product_type, product_name, vd_id_code } = req.body;
  if (!product_type || !product_name || !vd_id_code) {
    return res.status(400).json({ code: 400, status: 'fail', message: 'Field wajib tidak boleh kosong' });
  }
  let data = db.get('void_codes').value() || [];
  const newId = (data[data.length - 1]?.no || 0) + 1;
  const newData = { no: newId, product_type, product_name, vd_id_code };
  db.get('void_codes').push(newData).write();
  res.status(201).json({
    code: 201,
    status: 'success',
    message: 'VO ID Kode berhasil ditambahkan',
    data: { vd_id_code_id: newId }
  });
});
// c. Edit
server.put('/api/v1/void-codes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const { product_type, product_name, vd_id_code } = req.body;
  let data = db.get('void_codes').find({ no: id });
  if (!data.value()) {
    return res.status(404).json({ code: 404, status: 'fail', message: 'Data tidak ditemukan' });
  }
  data.assign({ product_type, product_name, vd_id_code }).write();
  res.json({
    code: 200,
    status: 'success',
    message: 'VO ID Kode berhasil diperbarui'
  });
});
// d. Hapus
server.delete('/api/v1/void-codes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  let data = db.get('void_codes').find({ no: id });
  if (!data.value()) {
    return res.status(404).json({ code: 404, status: 'fail', message: 'Data tidak ditemukan' });
  }
  db.get('void_codes').remove({ no: id }).write();
  res.json({
    code: 200,
    status: 'success',
    message: 'VO ID Kode berhasil dihapus'
  });
});

// Endpoint: GET /api/v1/options/product-types
server.get('/api/v1/options/product-types', (req, res) => {
  const db = require('./db.json');
  res.json({
    code: 200,
    status: 'success',
    message: 'Daftar jenis produk berhasil diambil',
    data: {
      product_types: db.product_types || []
    }
  });
});

// Endpoint: GET /api/v1/options/products
server.get('/api/v1/options/products', (req, res) => {
  const db = require('./db.json');
  let { search = '', limit = 100, page = 1 } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  let products = db.products || [];
  if (search) {
    products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  const total_data = products.length;
  const total_pages = Math.ceil(total_data / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProducts = products.slice(start, end);
  res.json({
    code: 200,
    status: 'success',
    message: 'Daftar produk berhasil diambil',
    data: {
      products: paginatedProducts,
      pagination: {
        total_data,
        total_pages,
        current_page: page,
        limit
      }
    }
  });
});

// Fallback ke router bawaan JSON Server
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running');
});
