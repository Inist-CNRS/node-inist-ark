'use strict';

var InistArk = require('..');
var expect   = require('chai').expect;

describe('inist-ark validator', function () {

  it('should be able to validate positively a valid ARK', function (done) {
    var ark = new InistArk();
    var result = ark.validate('ark:/67375/39D-6W3GQPXD-J');
    expect(result).to.deep.equal({
      ark: true,
      naan: true,
      name: true,
      subpublisher: true,
      identifier: true,
      checksum: true
    });
    done();
  });

  it('should be able to validate negativly an ARK with a wrong checksum', function (done) {
    var ark = new InistArk();
    var result = ark.validate('ark:/67375/39D-6W3GQPXD-A');
    expect(result).to.deep.equal({
      ark: false,
      naan: true,
      name: false,
      subpublisher: true,
      identifier: true,
      checksum: false
    });
    done();
  });

  it('should be able to validate negativly an ARK with a wrong identifier', function (done) {
    var ark = new InistArk();
    var result = ark.validate('ark:/67375/39D-6W3PXD-J');
    expect(result).to.deep.equal({
      ark: false,
      naan: true,
      name: false,
      subpublisher: true,
      identifier: false,
      checksum: false
    });
    done();
  });

  it('should be able to validate negativly an ARK with a wrong subpublisher', function (done) {
    var ark = new InistArk();
    var result = ark.validate('ark:/67375/39-6W3GQPXD-J');
    expect(result).to.deep.equal({
      ark: false,
      naan: true,
      name: false,
      subpublisher: false,
      identifier: true,
      checksum: false
    });
    done();
  });

  it('should be able to validate negativly an ARK ' +
     'with a wrong naan (not INIST one)', function (done) {
    var ark = new InistArk();
    var result = ark.validate('ark:/37375/39D-6W3GQPXD-J');
    expect(result).to.deep.equal({
      ark: false,
      naan: false,
      name: true,
      subpublisher: true,
      identifier: true,
      checksum: true
    });
    done();
  });

});