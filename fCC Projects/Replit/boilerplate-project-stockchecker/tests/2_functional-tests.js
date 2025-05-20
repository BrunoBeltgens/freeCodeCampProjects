const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('GET Tests', function() {
    test('View one stock', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices/')
        .set('content-type', 'application/json')
        .query({ stock: 'AAPL' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'AAPL');
          assert.exists(res.body.stockData.price, 'price is neither null nor undefined');
          done();
        });
    });
    test('View one stock and like it', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices/')
        .set('content-type', 'application/json')
        .query({ stock: 'MSFT', like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'MSFT');
          assert.equal(res.body.stockData.likes, 1);
          assert.exists(res.body.stockData.price, 'price is neither null nor undefined');
          done();
        });
    });
    test('View same stock and like it again', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices/')
        .set('content-type', 'application/json')
        .query({ stock: 'MSFT', like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'MSFT');
          assert.equal(res.body.stockData.likes, 1);
          assert.exists(res.body.stockData.price, 'price is neither null nor undefined');
          done();
        });
    });
    test('View two stocks', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices/')
        .set('content-type', 'application/json')
        .query({ stock: ['MSFT', "AMZN"] })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, 'MSFT');
          assert.equal(res.body.stockData[1].stock, 'AMZN');
          assert.exists(res.body.stockData[0].price, 'price1 is neither null nor undefined');
          assert.exists(res.body.stockData[1].price, 'price2 is neither null nor undefined');
          done();
        });
    });
    test('View two stocks and like both', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices/')
        .set('content-type', 'application/json')
        .query({ stock: ['MSFT', "AMZN"], like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, 'MSFT');
          assert.equal(res.body.stockData[1].stock, 'AMZN');
          assert.exists(res.body.stockData[0].price, 'price1 is neither null nor undefined');
          assert.exists(res.body.stockData[1].price, 'price2 is neither null nor undefined');
          assert.exists(res.body.stockData[0].rel_likes, 'rel_likes1 is neither null nor undefined');
          assert.exists(res.body.stockData[1].rel_likes, 'rel_likes2 is neither null nor undefined');
          done();
        });
    });
  });
});
