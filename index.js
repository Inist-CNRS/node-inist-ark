'use strict';

function InistArk(opt) {
  opt = opt || {};

  this.naan         = opt.naan || '67375'; // '67375' is the INIST NAAN
  this.subpublisher = opt.subpublisher || '';
  this.alphabet     = opt.alphabet || '0123456789BCDFGHJKLMNPQRSTVWXZ';
}

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
  return {
    ark:          rawArk,
    naan :        seg[1],
    name:         seg[2],
    subpublisher: seg[2].substring(0, 3),
    identifier:   seg[2].substring(4, 12),
    checksum:     seg[2].substring(13, 14)
  };
};

module.exports = InistArk;