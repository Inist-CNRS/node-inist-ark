'use strict';

var InistArk = require('..');
var expect   = require('chai').expect;

describe('inist-ark parser', function () {

  it('should be able to parse a valid ARK', function (done) {
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

});
