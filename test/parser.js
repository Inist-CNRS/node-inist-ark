'use strict';

var InistArk = require('..');
var expect   = require('chai').expect;

describe('inist-ark parser', function () {

  it('should be able to parse a valid ARK #1', function (done) {
    var ark = new InistArk();
    var result = ark.parse('ark:/67375/39D-L2DM2F95-7');
    expect(result).to.deep.equal({
      ark:          'ark:/67375/39D-L2DM2F95-7',
      naan:         '67375',
      name:         '39D-L2DM2F95-7',
      subpublisher: '39D',
      identifier:   'L2DM2F95',
      checksum:     '7'
    });
    done();
  });

  it('should be able to parse a valid ARK #2', function (done) {
    var ark = new InistArk({ naan: 12345, subpublisher: false });
    var result = ark.parse('ark:/12345/SX52MR0K-4');
    expect(result).to.deep.equal({
      ark:          'ark:/12345/SX52MR0K-4',
      naan:         '12345',
      name:         'SX52MR0K-4',
      subpublisher: '',
      identifier:   'SX52MR0K',
      checksum:     '4'
    });
    done();
  });

  it('should be able to parse a valid ARK #3', function (done) {
    var ark = new InistArk({ naan: 12345, subpublisher: false, dash: false });
    var result = ark.parse('ark:/12345/NW4CQCGC4');
    expect(result).to.deep.equal({
      ark:          'ark:/12345/NW4CQCGC4',
      naan:         '12345',
      name:         'NW4CQCGC4',
      subpublisher: '',
      identifier:   'NW4CQCGC',
      checksum:     '4'
    });
    done();
  });


  it('should be able to parse a valid ARK #4', function (done) {
    var ark = new InistArk({ naan: 12345, subpublisher: 'XYZ', dash: false });
    var result = ark.parse('ark:/12345/XYZSHML4WGPD');
    expect(result).to.deep.equal({
      ark:          'ark:/12345/XYZSHML4WGPD',
      naan:         '12345',
      name:         'XYZSHML4WGPD',
      subpublisher: 'XYZ',
      identifier:   'SHML4WGP',
      checksum:     'D'
    });
    done();
  });



  it('should generate an exception if the given ARK is not syntaxicaly valid', function (done) {
    var ark = new InistArk();

    expect(function () {
      ark.parse('ark:/67375/39D-L2-4');
    }).to.throw({
      msg:  'Invalid ARK identifier: should be 8 characters long',
      code: 'ark-identifier-length'
    });

    done();
  });

  it('should generate an exception if the given ARK is not syntaxicaly valid', function (done) {
    var ark = new InistArk();

    expect(function () {
      ark.parse('ark:/67375/39-L2DM2F95-4');
    }).to.throw({
      msg: 'Invalid ARK subpublisher: should be 3 characters long',
      code: 'ark-subpublisher-length'
    });

    done();
  });


});
