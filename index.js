'use strict';

function InistArk(opt) {
  opt = opt || {};

  this.naan          = opt.naan || '67375'; // '67375' is the INIST NAAN
  this.subpublisher  = opt.subpublisher || '';
  this.alphabet      = opt.alphabet || '0123456789BCDFGHJKLMNPQRSTVWXZ';
}



// JS implentation of NCDA - see http://search.cpan.org/~jak/Noid/noid#NOID_CHECK_DIGIT_ALGORITHM
function ncda(input, alphabet) {
  var R = alphabet.length;
  var chr = input.split(''), ord = [], pos = []
  chr.forEach(function(c, i) {
    var z = alphabet.indexOf(c)
    ord.push(z > 0 ? z : 0);
    pos.push(i + 1);
  })
  var sum = 0;
  pos.forEach(function(p, i) {
    sum += (p * ord[i])
  });
  var x = sum % R;
  return alphabet[x];
}


InistArk.prototype.generate = function (opt) {
  var self          = this;
  opt               = opt || {};
  var subpublisher  = opt.subpublisher || self.subpublisher;

  // generate an ARK identifier of 8 characters
  var identifier    = '';
  for (var i = 0; i < 8 ; i++) {
    identifier += self.alphabet[Math.floor(Math.random() * self.alphabet.length)];
  }

  return 'ark:/67375/' + subpublisher + '-' + identifier + '-' + ncda('67375/' + subpublisher + '-' + identifier, self.alphabet);
};



InistArk.prototype.parse = function (rawArk) {
  var seg = rawArk.split('/');
  if (seg.length != 3) {
    throw new Error('Invalid ARK syntax');
  }
  if (seg[0] !== 'ark:') {
    throw new Error('Unknown ARK label');
  }
  if (seg[1] !== this.naan) {
    throw new Error('Unknow ARK NAAN');
  }
  if (seg[2].split('-').length !== 3) {
    throw new Error('Invalid ARK name syntax');
  }
  var result = {
    ark:          rawArk,
    naan :        seg[1],
    name:         seg[2],
    subpublisher: seg[2].substring(0, 3),
    identifier:   seg[2].substring(4, 12),
    checksum:     seg[2].substring(13, 14)
  };

  if (result.subpublisher.length != 3) {
    throw new Error('Invalid ARK subpublisher: should be 3 characters long');
  }
  if (result.identifier.length != 8) {
    throw new Error('Invalid ARK identifier: should be 8 characters long');
  }
  if (result.checksum.length != 1) {
    throw new Error('Invalid ARK checksum: should be 1 character long');
  }
  return result;
};




module.exports = InistArk;
