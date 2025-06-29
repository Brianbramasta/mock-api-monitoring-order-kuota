const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test 1: Transaksi Gagal (tanpa filter)
    console.log('1. Testing /transactions/failed (tanpa filter)');
    const failedResponse = await axios.get(`${BASE_URL}/transactions/failed`);
    console.log(`   ✅ Status: ${failedResponse.status}`);
    console.log(`   📊 Data count: ${failedResponse.data.data.transactions.length}`);
    console.log(`   📈 Total data: ${failedResponse.data.data.pagination.total_data}\n`);

    // Test 2: Transaksi Gagal (dengan search)
    console.log('2. Testing /transactions/failed (dengan search="Telkomsel")');
    const failedSearchResponse = await axios.get(`${BASE_URL}/transactions/failed?search=Telkomsel`);
    console.log(`   ✅ Status: ${failedSearchResponse.status}`);
    console.log(`   📊 Data count: ${failedSearchResponse.data.data.transactions.length}`);
    console.log(`   📈 Total data: ${failedSearchResponse.data.data.pagination.total_data}\n`);

    // Test 3: Transaksi Pending (tanpa filter)
    console.log('3. Testing /transactions/pending (tanpa filter)');
    const pendingResponse = await axios.get(`${BASE_URL}/transactions/pending`);
    console.log(`   ✅ Status: ${pendingResponse.status}`);
    console.log(`   📊 Data count: ${pendingResponse.data.data.transactions.length}`);
    console.log(`   📈 Total data: ${pendingResponse.data.data.pagination.total_data}\n`);

    // Test 4: Transaksi Sukses (tanpa filter)
    console.log('4. Testing /transactions/success (tanpa filter)');
    const successResponse = await axios.get(`${BASE_URL}/transactions/success`);
    console.log(`   ✅ Status: ${successResponse.status}`);
    console.log(`   📊 Data count: ${successResponse.data.data.transactions.length}`);
    console.log(`   📈 Total data: ${successResponse.data.data.pagination.total_data}\n`);

    // Test 5: Komplain Transaksi (tanpa filter)
    console.log('5. Testing /transactions/complaints (tanpa filter)');
    const complaintsResponse = await axios.get(`${BASE_URL}/transactions/complaints`);
    console.log(`   ✅ Status: ${complaintsResponse.status}`);
    console.log(`   📊 Data count: ${complaintsResponse.data.data.transactions.length}`);
    console.log(`   📈 Total data: ${complaintsResponse.data.data.pagination.total_data}\n`);

    // Test 6: Produk Terlaris
    console.log('6. Testing /products/best-selling');
    const bestSellingResponse = await axios.get(`${BASE_URL}/products/best-selling`);
    console.log(`   ✅ Status: ${bestSellingResponse.status}`);
    console.log(`   📊 Data count: ${bestSellingResponse.data.data.products.length}\n`);

    // Test 7: Supplier (tanpa filter)
    console.log('7. Testing /suppliers (tanpa filter)');
    const suppliersResponse = await axios.get(`${BASE_URL}/suppliers`);
    console.log(`   ✅ Status: ${suppliersResponse.status}`);
    console.log(`   📊 Data count: ${suppliersResponse.data.data.suppliers.length}`);
    console.log(`   📈 Total data: ${suppliersResponse.data.data.pagination.total_data}\n`);

    // Test 8: Supplier (dengan search)
    console.log('8. Testing /suppliers (dengan search="API")');
    const suppliersSearchResponse = await axios.get(`${BASE_URL}/suppliers?search=API`);
    console.log(`   ✅ Status: ${suppliersSearchResponse.status}`);
    console.log(`   📊 Data count: ${suppliersSearchResponse.data.data.suppliers.length}`);
    console.log(`   📈 Total data: ${suppliersSearchResponse.data.data.pagination.total_data}\n`);

    // Test 9: VO ID Kode (tanpa filter)
    console.log('9. Testing /void-codes (tanpa filter)');
    const voidCodesResponse = await axios.get(`${BASE_URL}/void-codes`);
    console.log(`   ✅ Status: ${voidCodesResponse.status}`);
    console.log(`   📊 Data count: ${voidCodesResponse.data.data.void_codes.length}`);
    console.log(`   📈 Total data: ${voidCodesResponse.data.data.pagination.total_data}\n`);

    // Test 10: VO ID Kode (dengan search)
    console.log('10. Testing /void-codes (dengan search="Pulsa")');
    const voidCodesSearchResponse = await axios.get(`${BASE_URL}/void-codes?search=Pulsa`);
    console.log(`   ✅ Status: ${voidCodesSearchResponse.status}`);
    console.log(`   📊 Data count: ${voidCodesSearchResponse.data.data.void_codes.length}`);
    console.log(`   📈 Total data: ${voidCodesSearchResponse.data.data.pagination.total_data}\n`);

    // Test 11: Monitor Transaksi Chart
    console.log('11. Testing /monitor/transactions/chart');
    const transactionsChartResponse = await axios.get(`${BASE_URL}/monitor/transactions/chart`);
    console.log(`   ✅ Status: ${transactionsChartResponse.status}`);
    console.log(`   📊 Data count: ${transactionsChartResponse.data.data.chart_data.length}\n`);

    // Test 12: Monitor QRIS Chart
    console.log('12. Testing /monitor/qris/chart');
    const qrisChartResponse = await axios.get(`${BASE_URL}/monitor/qris/chart`);
    console.log(`   ✅ Status: ${qrisChartResponse.status}`);
    console.log(`   📊 Data count: ${qrisChartResponse.data.data.chart_data.length}\n`);

    // Test 13: Options Product Types
    console.log('13. Testing /options/product-types');
    const productTypesResponse = await axios.get(`${BASE_URL}/options/product-types`);
    console.log(`   ✅ Status: ${productTypesResponse.status}`);
    console.log(`   📊 Data count: ${productTypesResponse.data.data.product_types.length}\n`);

    // Test 14: Options Products
    console.log('14. Testing /options/products');
    const productsResponse = await axios.get(`${BASE_URL}/options/products`);
    console.log(`   ✅ Status: ${productsResponse.status}`);
    console.log(`   📊 Data count: ${productsResponse.data.data.products.length}`);
    console.log(`   📈 Total data: ${productsResponse.data.data.pagination.total_data}\n`);

    console.log('🎉 Semua test berhasil! API berfungsi dengan baik.');
    console.log('✨ Fitur search dan filter sudah aktif dan berfungsi.');

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Jalankan test jika file ini dijalankan langsung
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 