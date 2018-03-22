'use strict';

function InistArk(opt) {
  opt = opt || {};

  this.naan          = opt.naan || '67375'; // '67375' is the INIST NAAN
  this.subpublisher  = opt.subpublisher !== undefined ? opt.subpublisher : '';
  this.alphabet      = opt.alphabet || '0123456789BCDFGHJKLMNPQRSTVWXZ';
  this.hyphen        = opt.hyphen !== undefined ? opt.hyphen : true;
}


//
// JS implentation of NCDA
// see http://search.cpan.org/~jak/Noid/noid#NOID_CHECK_DIGIT_ALGORITHM
//
function ncda(input, alphabet) {
  var R = alphabet.length;
  var chr = input.split('')
    , ord = []
    , pos = [];
  chr.forEach(function (c, i) {
    var z = alphabet.indexOf(c);
    ord.push(z > 0 ? z : 0);
    pos.push(i + 1);
  });
  var sum = 0;
  pos.forEach(function (p, i) {
    sum += p * ord[i];
  });
  var x = sum % R;
  return alphabet[x];
}

function check(id) {
  if (!id) {
    return false;
  }
  var semaphore = true;
  id.split('').reduce(function(prev, cur) {
    if (cur === prev) {
      semaphore = false;
    }
    return cur;
  });
  return semaphore;
}

//
// generate an ARK identifier of 8 characters
//
function identifier(alphabet) {
  var id;
  while (check(id) === false) {
    id = '';
    for (var i = 0; i < 8; i++) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
  return id;
}


//
// INIST's ARK generator
// Use it like this:
//   ark.generate(); // returns: ark:/67375/39D-L2DM2F95-7
//   ark.generate({ subpublisher: '015' }); // returns: ark:/67375/015-X73BVHH2-2
//
InistArk.prototype.generate = function (opt) {
  var self          = this;
  opt               = opt || {};
  var subpublisher  = opt.subpublisher !== undefined ? opt.subpublisher : self.subpublisher;
  var hyphen          = opt.hyphen !== undefined ? opt.hyphen : self.hyphen;
  var naan          = String(opt.naan || self.naan);
  var separator     = hyphen ? '-' : '';


  if (naan.length !== 5) {
    var err1 = new Error('ARK naan is mandatory to generate a new one.');
    err1.code = 'ark-naan-empty';
    throw err1;
  }

  if (subpublisher === false) {
    return 'ark:/' + naan + '/' +
      identifier(self.alphabet) +
      separator +
      ncda(naan + subpublisher + identifier, self.alphabet);
  }

  // just check a subpublisher has been setup
  // cause the ARK will be invalid if no subpublisher choosed
  if (typeof subpublisher !== 'string' || subpublisher.length !== 3) {
    var err2 = new Error('ARK subpublisher is mandatory to generate a new one.');
    err2.code = 'ark-subpublisher-empty';
    throw err2;
  }

  return 'ark:/' + naan + '/' +
    subpublisher +
    separator +
    identifier(self.alphabet) +
    separator +
    ncda(naan + subpublisher + identifier, self.alphabet);
};


//
// INIST's ARK parser
// Use it like this:
//   ark.parse('ark:/67375/39D-L2DM2F95-7');
// Returns:
//   { ark:          'ark:/67375/39D-L2DM2F95-7',
//     naan:         '67375',
//     name:         '39D-L2DM2F95-7',
//     subpublisher: '39D',
//     identifier:   'L2DM2F95',
//     checksum:     '7'
//   }
//
InistArk.prototype.parse = function (rawArk) {
  var self = this;
  var seg = rawArk.split('/');
  var err;
  if (seg.length !== 3) {
    err = new Error('Invalid ARK syntax');
    err.code = 'ark-parts';
    throw err;
  }
  if (seg[0] !== 'ark:') {
    err = new Error('Unknown ARK label');
    err.code = 'ark-label';
    throw err;
  }
  if (seg[1] !== String(self.naan)) {
    err = new Error('Unknow ARK NAAN');
    err.code = 'ark-naan';
    throw err;
  }
  var nameSplitted;
  if (self.hyphen) {
    nameSplitted = seg[2].split('-');
    if (self.subpublisher === false) {
      nameSplitted.unshift('');
    }
  }
  else {
    nameSplitted = ['', '', ''];
    nameSplitted[2] = seg[2].substr(-1);
    if (self.subpublisher === false) {
      nameSplitted[1] = seg[2].substr(0, 8);
    }
    else {
      nameSplitted[0] = seg[2].substr(0, 3);
      nameSplitted[1] = seg[2].substr(3, 8);
    }
  }
  if (nameSplitted.length !== 3) {
    err = new Error('Invalid ARK name syntax');
    err.code = 'ark-name-parts';
    throw err;
  }
  var result = {
    ark:          rawArk,
    naan :        seg[1],
    name:         seg[2],
    subpublisher: nameSplitted[0],
    identifier:   nameSplitted[1],
    checksum:     nameSplitted[2]
  };

  if (self.subpublisher !== false && result.subpublisher.length !== 3) {
    err = new Error('Invalid ARK subpublisher: should be 3 characters long');
    err.code = 'ark-subpublisher-length';
    throw err;
  }
  if (result.identifier.length !== 8) {
    err = new Error('Invalid ARK identifier: should be 8 characters long');
    err.code = 'ark-identifier-length';
    throw err;
  }
  if (result.checksum.length !== 1) {
    err = new Error('Invalid ARK checksum: should be 1 character long');
    err.code = 'ark-checksum-length';
    throw err;
  }
  return result;
};



//
// INIST's ARK validator
// Use it like this:
//   ark.validate('ark:/67375/39D-L2DM2F95-7');
// Returns:
//   { ark: true,          // false if one of the following fields is false
//     naan: true,         // false if it's not the inist naan
//     name: true,         // false if subpubliser, identifier or checksum is false
//     subpublisher: true, // false if not 3 char length and not respecting the alphabet
//     identifier: true,   // false if not 8 chars len or if it does not respect the alphabet
//     checksum: true      // false if the checksum is wrong
//   }
//
InistArk.prototype.validate = function (rawArk) {
  var self = this;

  var result = {
    ark:          true,
    naan:         true,
    name:         true,
    subpublisher: true,
    identifier:   true,
    checksum:     true
  };

  // try to parse the ARK to know which part is wrong
  try {

    var ark = self.parse(rawArk);
    var correctCheckSum = ncda(
      ark.naan + ark.subpublisher + ark.identifier,
      self.alphabet
    );
    result.checksum = correctCheckSum === ark.checksum;

  }
  catch (err) {

    result.ark = false;
    if (err.code === 'ark-naan') {
      result.naan = false;
    }
    if (err.code === 'ark-name-parts') {
      result.name         = false;
      result.checksum     = false;
      result.subpublisher = false;
      result.identifier   = false;
    }
    if (err.code === 'ark-subpublisher-length') {
      result.subpublisher = false;
      result.checksum     = false;
    }
    if (err.code === 'ark-identifier-length') {
      result.identifier = false;
      result.checksum   = false;
    }
    if (err.code === 'ark-checksum-length') {
      result.checksum = false;
    }

  }

  if (result.checksum === false ||
    result.subpublisher === false ||
    result.identifier === false) {
    result.ark  = false;
    result.name = false;
  }

  return result;
};


module.exports = InistArk;
