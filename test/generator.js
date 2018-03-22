'use strict';

var InistArk = require('..');
var expect   = require('chai').expect;

describe('inist-ark generator', function () {

  it('should be able to generate an ARK', function (done) {
    var ark = new InistArk({ subpublisher: '4G1' });
    var myFirstArk = ark.generate();
    expect(myFirstArk).to.contain('ark:/');
    expect(myFirstArk).to.contain('67375'); // inist NAAN
    expect(myFirstArk).to.contain('4G1');
    expect(myFirstArk).to.have.lengthOf(25);
    done();
  });

  it('should be able to generate two ARKs', function (done) {
    var ark = new InistArk({ subpublisher: '4G2' });
    var myFirstArk  = ark.generate();
    var mySecondArk = ark.generate();
    expect(myFirstArk).to.contain('ark:/'); // still an ARK
    expect(mySecondArk).to.contain('ark:/');
    expect(mySecondArk).to.contain('67375'); // inist NAAN
    expect(mySecondArk).to.contain('4G2');
    done();
  });

  it('should be able to generate 1000 ARKs', function (done) {
    var ark = new InistArk({ subpublisher: '4G2' });
    var arks = [];
    for (var i = 0; i < 1000; i++) {
      arks[i] = ark.generate();
    }
    expect(arks).to.have.lengthOf(1000);
    done();
  });

  it('should be able to generate ARK with a specific subpublisher', function (done) {
    var ark = new InistArk();
    var myFirstArk  = ark.generate({ subpublisher: '001' });
    var mySecondArk = ark.generate({ subpublisher: '002' });
    expect(myFirstArk).to.contain('ark:/');
    expect(myFirstArk).to.contain('001');
    expect(mySecondArk).to.contain('ark:/');
    expect(mySecondArk).to.contain('002');
    done();
  });

  it('should be able to generate ARK without subpublisher', function (done) {
    var ark = new InistArk({ subpublisher: false, naan: '12345' });
    var myArk = ark.generate();
    expect(myArk).to.contain('ark:/');
    expect(myArk).to.contain('/12345/');
    expect(myArk).to.have.lengthOf(21);
    done();
  });

  it('should be able to generate ARK without error', function (done) {
    var ark = new InistArk();
    expect(function () { ark.generate({ naan: 123 }); }).to.throw();
    expect(function () { ark.generate({ naan: '' }); }).to.throw();
    expect(function () { ark.generate({ naan: '123456' }); }).to.throw();
    expect(function () { ark.generate({ naan: 12345, subpublisher: 'AZERTY' }); }).to.throw();
    expect(function () { ark.generate({ naan: 12345, subpublisher: '' }); }).to.throw();
    done();
  });
});
