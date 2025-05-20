const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function() {
  suite('function convertHandler.getNum(input)', function() {
    test('Whole number input', function(done) {
      let input = '32L';
      assert.equal(convertHandler.getNum(input), 32);
      done();
    });
    test('Decimal Input', function(done) {
      let input = '32.5L';
      assert.equal(convertHandler.getNum(input), 32.5);
      done();
    });
    test('Fractional Input', function(done) {
      let input = '2/3L';
      assert.equal(convertHandler.getNum(input), 2/3);
      done();
    });
    test('Fractional Input w/ Decimal', function(done) {
      let input = '3.4/5L';
      assert.equal(convertHandler.getNum(input), 3.4/5);
      done();
    });
    test('Invalid Input (double fraction)', function(done) {
      let input = '4.2.8L';
      assert.equal(convertHandler.getNum(input), undefined);
      done();
    });
    test('No Numerical Input', function(done) {
      let input = 'L';
      assert.equal(convertHandler.getNum(input), 1);
      done();
    });
  });

  suite('Function convertHandler.getUnit(input)', function() {
    test('For Each Valid Unit Inputs', function (done) {
      let input = [
        "gal",
        "l",
        "mi",
        "km",
        "lbs",
        "kg",
        "GAL",
        "L",
        "MI",
        "KM",
        "LBS",
        "KG",
      ];
      let expect = [
        "gal",
        "L",
        "mi",
        "km",
        "lbs",
        "kg",
        "gal",
        "L",
        "mi",
        "km",
        "lbs",
        "kg",
      ];
      input.forEach(function (e, i) {
        assert.equal(convertHandler.getUnit(e), expect[i]);
      });
      done();
    });
    test('Unknown Unit Input', function (done) {
      assert.equal(convertHandler.getUnit('34kilograms'), undefined);
      done();
    });
  });

  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    test('For Each Valid Unit Inputs', function (done) {
      let input = ["gal", "l", "mi", "km", "lbs", "kg"];
      let expect = ["L", "gal", "km", "mi", "kg", "lbs"];
      input.forEach(function (e, i) {
        assert.equal(convertHandler.getReturnUnit(e), expect[i]);
      });
      done();
    });
  });
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    test('For Each Valid Unit Inputs', function(done) {
      let input = ["gal", "l", "mi", "km", "lbs", "kg"];
      let expect = [
        "gallons",
        "liters",
        "miles",
        "kilometers",
        "pounds",
        "kilograms",
      ];
      input.forEach(function(e, i) {
        assert.equal(convertHandler.spellOutUnit(e), expect[i]);
      });
      done();
    });
  });

  suite('Function convertHandler.convert(num, unit)', function() {
    test('Gal to L', function(done) {
      let input = [2, "gal"];
      let expect = 7.5708;
      assert.approximately(convertHandler.convert(input[0], input[1]), expect, 0.1);
      done();
    });
    test('L to Gal', function(done) {
      let input = [8, "L"];
      let expect = 2.1134;
      assert.approximately(convertHandler.convert(input[0], input[1]), expect, 0.1);
      done();
    });
    test('Mi to Km', function(done) {
      let input = [6, "mi"];
      let expect = 9.6560;
      assert.approximately(convertHandler.convert(input[0], input[1]), expect, 0.1);
      done();
    });
    test('Km to Mi', function(done) {
      let input = [4, "km"];
      let expect = 2.4855;
      assert.approximately(convertHandler.convert(input[0], input[1]), expect, 0.1);
      done();
    });
    test('Lbs to Kg', function(done) {
      let input = [10, "lbs"];
      let expect = 4.5360;
      assert.approximately(convertHandler.convert(input[0], input[1]), expect, 0.1);
      done();
    });
    test('Kg to Lbs', function(done) {
      let input = [5, "kg"];
      let expect = 11.0231;
      assert.approximately(convertHandler.convert(input[0], input[1]), expect, 0.1);
      done();
    });
  });
});