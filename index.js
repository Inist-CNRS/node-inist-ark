'use strict';

function InistArk(opt) {
  opt = opt || {};

  this.naan          = opt.naan || '67375'; // '67375' is the INIST NAAN
  this.subpublisher  = opt.subpublisher || '';
  this.alphabet      = opt.alphabet || '0123456789BCDFGHJKLMNPQRSTVWXZ';
}


/**
 * INIST's ARK generator
 * Use it like this:
 *   ark.generate(); // returns: ark:/67375/39D-L2DM2F95-7
 *   ark.generate({ subpublisher: '015' }); // returns: ark:/67375/015-X73BVHH2-2
 */
InistArk.prototype.generate = function (opt) {
  var self          = this;
  opt               = opt || {};
  var subpublisher  = opt.subpublisher || self.subpublisher;

  // generate an ARK identifier of 8 characters
  var identifier    = '';
  for (var i = 0; i < 8 ; i++) {
    identifier += self.alphabet[Math.floor(Math.random() * self.alphabet.length)];
  }

  // calculating the checksum following ISSN spec
  var checksum = 0;
  identifier.split('').forEach(function (char, charPos) {
    var charInt = self.alphabet.indexOf(char);
    checksum += charInt * (8 - 1 - charPos);
  });
  checksum = (11 - checksum % 11);
  if (checksum == 11) {
    checksum = 0;
  }
  if (checksum == 10) {
    checksum = 'X';
  }

  return 'ark:/67375/' + subpublisher + '-' + identifier + '-' + checksum;
};


/**
 * INIST's ARK parser
 * Use it like this:
 *   ark.parse('ark:/67375/39D-L2DM2F95-7');
 * Returns:
 *   { ark:          'ark:/67375/39D-L2DM2F95-7',
 *     naan:         '67375',
 *     name:         '39D-L2DM2F95-7',
 *     subpublisher: '39D',
 *     identifier:   'L2DM2F95',
 *     checksum:     '7'
 *   }
 */  
InistArk.prototype.parse = function (rawArk) {
  var seg = rawArk.split('/');
  if (seg.length != 3) {
    throw new Error({ msg: 'Invalid ARK syntax', code: 'ark-parts' });
  }
  if (seg[0] !== 'ark:') {
    throw new Error({ msg: 'Unknown ARK label', code: 'ark-label' });
  }
  if (seg[1] !== this.naan) {
    throw new Error({ msg: 'Unknow ARK NAAN', code: 'ark-naan' });
  }
  if (seg[2].split('-').length !== 3) {
    throw new Error({ msg: 'Invalid ARK name syntax', code: 'ark-name-parts' });
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
    throw new Error({
      msg:  'Invalid ARK subpublisher: should be 3 characters long',
      code: 'ark-subpublisher-length'
    });
  }
  if (result.identifier.length != 8) {
    throw new Error({
      msg:  'Invalid ARK identifier: should be 8 characters long',
      code: 'ark-identifier-length'
    });
  }
  if (result.checksum.length != 1) {
    throw new Error({
      msg:  'Invalid ARK checksum: should be 1 character long',
      code: 'ark-checksum-length'
    });
  }
  return result;
};



/**
 * INIST's ARK validator
 * Use it like this:
 *   ark.validate('ark:/67375/39D-L2DM2F95-7');
 * Returns:
 *   { ark: true,          // false if one of the following fields is false
 *     naan: true,         // false if it's not the inist naan 
 *     name: true,         // false if subpubliser, identifier or checksum is false
 *     subpublisher: true, // false if not 3 char length and not respecting the alphabet
 *     identifier: true,   // false if not 8 chars len or if it does not respect the alphabet
 *     checksum: true      // false if the checksum is wrong
 *   }
 *   
 */  
InistArk.prototype.validate = function (rawArk) {
  var self          = this;

  var arkSplitted = {};
  var result = {
    ark:          true,         
    naan:         true,        
    name:         true,        
    subpublisher: true,
    identifier:   true,  
    checksum:     true     
  };

  // try to parse the ARK then tell what part is wrong
  try {
    arkSplitted = self.parse(rawArk);
  } catch (err) {
    result.ark = false;
    if (err.code == 'ark-naan') {
      result.naan = false;
    }
    if (err.code == 'ark-name-parts') {
      result.name         = false;
      result.checksum     = false;
      result.subpublisher = false;
      result.identifier   = false;
    }
    if (err.code == 'ark-subpublisher-length') {
      result.subpublisher = false;
    }
    if (err.code == 'ark-identifier-length') {
      result.identifier = false;
    }
    if (err.code == 'ark-checksum-length') {
      result.checksum = false;
    }
  }
  if (result.checksum == false ||
      result.subpublisher == false ||
      result.identifier == false) {
    result.name = false;
  }

  return result;
};


module.exports = InistArk;