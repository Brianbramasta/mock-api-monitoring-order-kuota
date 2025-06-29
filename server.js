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

// Helper untuk ambil query string
function getQueryString(req, key, def = '') {
  return req.query[key] || def;
}

// Helper untuk filter berdasarkan tanggal
function filterByDateRange(data, startDate, endDate) {
  if (!startDate && !endDate) return data;
  
  try {
    return data.filter(item => {
      if (!item.date) return true; // Skip jika tidak ada tanggal
      
      const itemDate = new Date(item.date);
      if (isNaN(itemDate.getTime())) return true; // Skip jika tanggal invalid
      
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });
  } catch (error) {
    console.error('Error in filterByDateRange:', error);
    return data;
  }
}

// Helper untuk search pada transaksi
function searchTransactions(data, searchTerm) {
  if (!searchTerm) return data;
  
  try {
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      (item.product_name && item.product_name.toLowerCase().includes(term)) ||
      (item.supplier_name && item.supplier_name.toLowerCase().includes(term)) ||
      (item.product_code && item.product_code.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error('Error in searchTransactions:', error);
    return data;
  }
}

// Helper untuk search pada supplier
function searchSuppliers(data, searchTerm) {
  if (!searchTerm) return data;
  
  try {
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      (item.supplier_name && item.supplier_name.toLowerCase().includes(term)) ||
      (item.supplier_code && item.supplier_code.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error('Error in searchSuppliers:', error);
    return data;
  }
}

// Helper untuk search pada void codes
function searchVoidCodes(data, searchTerm) {
  if (!searchTerm) return data;
  
  try {
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      (item.product_type && item.product_type.toLowerCase().includes(term)) ||
      (item.product_name && item.product_name.toLowerCase().includes(term)) ||
      (item.vd_id_code && item.vd_id_code.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error('Error in searchVoidCodes:', error);
    return data;
  }
}

// Helper untuk filter void codes berdasarkan periode
function filterVoidCodesByPeriod(data, period) {
  if (!period) return data;
  
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today':
        return data.filter(item => {
          if (!item.date) return false;
          const itemDate = new Date(item.date);
          return itemDate.getTime() === today.getTime();
        });
      case 'last_3_days':
        const threeDaysAgo = new Date(today.getTime() - (3 * 24 * 60 * 60 * 1000));
        return data.filter(item => {
          if (!item.date) return false;
          const itemDate = new Date(item.date);
          return itemDate >= threeDaysAgo;
        });
      case 'this_week':
        const startOfWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
        return data.filter(item => {
          if (!item.date) return false;
          const itemDate = new Date(item.date);
          return itemDate >= startOfWeek;
        });
      case 'this_month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return data.filter(item => {
          if (!item.date) return false;
          const itemDate = new Date(item.date);
          return itemDate >= startOfMonth;
        });
      default:
        return data;
    }
  } catch (error) {
    console.error('Error in filterVoidCodesByPeriod:', error);
    return data;
  }
}

// 1. Transaksi Gagal
server.get('/api/v1/transactions/failed', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('transactions_failed').value() || [];
    
    console.log('Original data length:', data.length);
    
    // Filter berdasarkan tanggal
    const startDate = getQueryString(req, 'start_date');
    const endDate = getQueryString(req, 'end_date');
    if (startDate || endDate) {
      data = filterByDateRange(data, startDate, endDate);
      console.log('After date filter:', data.length);
    }
    
    // Search
    const search = getQueryString(req, 'search');
    if (search) {
      data = searchTransactions(data, search);
      console.log('After search filter:', data.length);
    }
    
    // Pagination
    const limit = getQueryInt(req, 'limit', 10);
    const page = getQueryInt(req, 'page', 1);
    const pagedData = paginate(data, page, limit);
    
    // Rekap berdasarkan data yang sudah difilter
    const recap = {
      most_failed_product_name: data[0]?.product_name || '',
      total_failed_transactions: data.reduce((acc, cur) => acc + (cur.quantity || 0), 0),
      total_failed_nominal: data.reduce((acc, cur) => acc + ((cur.price || 0) * (cur.quantity || 0)), 0),
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
  } catch (error) {
    console.error('Error in transactions/failed:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// 2. Transaksi Pending
server.get('/api/v1/transactions/pending', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('transactions_pending').value() || [];
    
    // Filter berdasarkan tanggal
    const startDate = getQueryString(req, 'start_date');
    const endDate = getQueryString(req, 'end_date');
    if (startDate || endDate) {
      data = filterByDateRange(data, startDate, endDate);
    }
    
    // Search
    const search = getQueryString(req, 'search');
    if (search) {
      data = searchTransactions(data, search);
    }
    
    // Pagination
    const limit = getQueryInt(req, 'limit', 10);
    const page = getQueryInt(req, 'page', 1);
    const pagedData = paginate(data, page, limit);
    
    // Rekap berdasarkan data yang sudah difilter
    const recap = {
      most_pending_product_name: data[0]?.product_name || '',
      total_pending_transactions: data.reduce((acc, cur) => acc + (cur.quantity || 0), 0),
      total_pending_nominal: data.reduce((acc, cur) => acc + ((cur.price || 0) * (cur.quantity || 0)), 0),
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
  } catch (error) {
    console.error('Error in transactions/pending:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// 3. Transaksi Sukses
server.get('/api/v1/transactions/success', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('transactions_success').value() || [];
    
    // Filter berdasarkan tanggal
    const startDate = getQueryString(req, 'start_date');
    const endDate = getQueryString(req, 'end_date');
    if (startDate || endDate) {
      data = filterByDateRange(data, startDate, endDate);
    }
    
    // Search
    const search = getQueryString(req, 'search');
    if (search) {
      data = searchTransactions(data, search);
    }
    
    // Pagination
    const limit = getQueryInt(req, 'limit', 10);
    const page = getQueryInt(req, 'page', 1);
    const pagedData = paginate(data, page, limit);
    
    // Rekap berdasarkan data yang sudah difilter
    const recap = {
      most_successful_product_name: data[0]?.product_name || '',
      total_successful_transactions: data.reduce((acc, cur) => acc + (cur.quantity || 0), 0),
      total_successful_nominal: data.reduce((acc, cur) => acc + ((cur.price || 0) * (cur.quantity || 0)), 0),
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
  } catch (error) {
    console.error('Error in transactions/success:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// 4. Komplain Transaksi
server.get('/api/v1/transactions/complaints', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('transactions_complaints').value() || [];
    
    // Filter berdasarkan tanggal
    const startDate = getQueryString(req, 'start_date');
    const endDate = getQueryString(req, 'end_date');
    if (startDate || endDate) {
      data = filterByDateRange(data, startDate, endDate);
    }
    
    // Search
    const search = getQueryString(req, 'search');
    if (search) {
      data = searchTransactions(data, search);
    }
    
    // Pagination
    const limit = getQueryInt(req, 'limit', 10);
    const page = getQueryInt(req, 'page', 1);
    const pagedData = paginate(data, page, limit);
    
    // Rekap berdasarkan data yang sudah difilter
    const recap = {
      total_complaint_transactions: data.length,
      total_complaint_nominal: data.reduce((acc, cur) => acc + ((cur.price || 0) * (cur.quantity || 0)), 0)
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
  } catch (error) {
    console.error('Error in transactions/complaints:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// 5. Produk Terlaris
server.get('/api/v1/products/best-selling', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('products_best_selling').value() || [];
    
    // Search pada produk terlaris
    const search = getQueryString(req, 'search');
    if (search) {
      const term = search.toLowerCase();
      data = data.filter(item => 
        item.product_name && item.product_name.toLowerCase().includes(term)
      );
    }
    
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
  } catch (error) {
    console.error('Error in products/best-selling:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// 6. Supplier
server.get('/api/v1/suppliers', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('suppliers').value() || [];
    
    // Search
    const search = getQueryString(req, 'search');
    if (search) {
      data = searchSuppliers(data, search);
    }
    
    // Pagination
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
  } catch (error) {
    console.error('Error in suppliers:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// 7. Monitor Transaksi (Grafik Area)
server.get('/api/v1/monitor/transactions/chart', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('monitor_transactions_chart').value() || [];
    
    // Filter berdasarkan periode
    const period = getQueryString(req, 'period', 'monthly');
    const productId = getQueryInt(req, 'product_id');
    
    // Filter berdasarkan product_id jika ada
    if (productId) {
      // Implementasi filter berdasarkan product_id bisa ditambahkan di sini
      // Untuk saat ini, kita skip filter ini karena data chart tidak memiliki product_id
    }
    
    res.json({
      code: 200,
      status: 'success',
      message: 'Data monitor transaksi berhasil diambil',
      data: {
        chart_data: data
      }
    });
  } catch (error) {
    console.error('Error in monitor/transactions/chart:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// 8. Monitor QRIS (Grafik Area)
server.get('/api/v1/monitor/qris/chart', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('monitor_qris_chart').value() || [];
    
    // Filter berdasarkan periode
    const period = getQueryString(req, 'period', 'monthly');
    
    res.json({
      code: 200,
      status: 'success',
      message: 'Data monitor QRIS berhasil diambil',
      data: {
        chart_data: data
      }
    });
  } catch (error) {
    console.error('Error in monitor/qris/chart:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// 9. Pengelolaan VO ID Kode
// a. Daftar
server.get('/api/v1/void-codes', (req, res) => {
  try {
    const db = router.db;
    let data = db.get('void_codes').value() || [];
    
    // Filter berdasarkan periode
    const period = getQueryString(req, 'period');
    if (period) {
      data = filterVoidCodesByPeriod(data, period);
    }
    
    // Search
    const search = getQueryString(req, 'search');
    if (search) {
      data = searchVoidCodes(data, search);
    }
    
    // Pagination
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
  } catch (error) {
    console.error('Error in void-codes:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});
// b. Tambah
server.post('/api/v1/void-codes', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in void-codes POST:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});
// c. Edit
server.put('/api/v1/void-codes/:id', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in void-codes PUT:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});
// d. Hapus
server.delete('/api/v1/void-codes/:id', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in void-codes DELETE:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// Endpoint: GET /api/v1/options/product-types
server.get('/api/v1/options/product-types', (req, res) => {
  try {
    const db = require('./db.json');
    res.json({
      code: 200,
      status: 'success',
      message: 'Daftar jenis produk berhasil diambil',
      data: {
        product_types: db.product_types || []
      }
    });
  } catch (error) {
    console.error('Error in options/product-types:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// Endpoint: GET /api/v1/options/products
server.get('/api/v1/options/products', (req, res) => {
  try {
    const db = require('./db.json');
    let { search = '', limit = 100, page = 1 } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    let products = db.products || [];
    
    if (search) {
      const term = search.toLowerCase();
      products = products.filter(p => 
        p.name && p.name.toLowerCase().includes(term)
      );
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
  } catch (error) {
    console.error('Error in options/products:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
});

// Fallback ke router bawaan JSON Server
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
  console.log('Search and filter features are now active!');
});
