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

});
