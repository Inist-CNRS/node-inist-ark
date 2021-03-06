# node-inist-ark

[![Build Status](https://travis-ci.org/Inist-CNRS/node-inist-ark.svg?branch=master)](https://travis-ci.org/Inist-CNRS/node-inist-ark) [![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/node-inist-ark/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/node-inist-ark)

NodeJS package used to handle "normalized" ARK for the INIST organization This library can be used to generate a lot of random and valid ARKs dedicated to a specific NAAN and subpublisher, or to parse an existing ARK as a nice JSON object, or to validate the content of a given ARK (ex: checking this ARK as not been misspelled thanks to its checksum).

All generated identifiers are conform to [The ARK Identifier Scheme RFC](https://tools.ietf.org/html/draft-kunze-ark-18)

INIST's ARK anatomy is:

```
    ark:/67375/39D-S2GXG1TW-8
    \__/ \___/ \__/\______/\_/
     |     |    |     |     |
ARK Label  |    |     |     Check sum (1 char)
           |    |    Identifier (8 chars by default)
           |   Sub-publisher (3 chars, it has to be generated in the centralized INIST ARK registry)
           |
Name Assigning Authority Number (NAAN) (67375 is dedicated for INIST)
```

- INIST NAAN will not change and is this integer: 67375
- Sub-publisher is handled by a [centralized ARK registry for INIST](todo add the link)
- Identifier is a string of 8 uppercase characters from this alphabet 0123456789BCDFGHJKLMNPQRSTVWXZ
- Check sum is 1 character calculated from the ARK identifier following the [NCDA checksum algorithm](http://search.cpan.org/~jak/Noid/noid#NOID_CHECK_DIGIT_ALGORITHM). It is used to help detecting mispelled ARK.

## Install

```shell
npm i inist-ark
```

## Usage

### Generate lot of ARKs

Notice that when generating an ARK, you must know the wanted subpublisher that you registred in the INIST's central ARK registry.

```javascript
var InistArk = require('inist-ark');

var ark = new InistArk({ subpublisher: '4G1' });
ark.generate(); // returns: ark:/67375/4G1-D4S484DN-9
ark.generate(); // returns: ark:/67375/4G1-TT6MHSX5-9

var ark2 = new InistArk();
ark2.generate({ subpublisher: '39D' }); // returns: ark:/67375/39D-S2GXG1TW-8
ark2.generate({ subpublisher: '015' }); // returns: ark:/67375/015-FG0H2546-9
ark2.generate({ subpublisher: '015' }); // returns: ark:/67375/015-X73BVHH2-2
ark2.generate({ subpublisher: '015' }); // returns: ark:/67375/015-TD0G7P90-X
ark2.generate({ subpublisher: '015' }); // returns: ark:/67375/015-5PZW7M6Q-5
ark2.generate({ subpublisher: '015' }); // returns: ark:/67375/015-58VCS11W-9

```

### Parse an ARK

```javascript
var InistArk = require('inist-ark');

var ark = new InistArk();
ark.parse('ark:/67375/39D-S2GXG1TW-8');
// returns:
// { ark:          'ark:/67375/39D-L2DM2F95-7',
//   naan:         '67375',
//   name:         '39D-L2DM2F95-7',
//   subpublisher: '39D',
//   identifier:   'L2DM2F95',
//   checksum:     '7'
// }

ark.parse('ark:/67375/39D-L2-');
// returns: an exception
//   new Error('Invalid ARK syntax')

```

### Validate an ARK

```javascript
var InistArk = require('inist-ark');

var ark = new InistArk();
ark.validate('ark:/67375/39D-S2GXG1TW-8');
// returns:
// { ark: true,          // false if one of the following fields is false
//   naan: true,         // false if it's not the inist naan
//   name: true,         // false if subpubliser, identifier or checksum is false
//   subpublisher: true, // false if not 3 chars length or not respecting the alphabet
//   identifier: true,   // false if not 8 chars length or not respecting the alphabet
//   checksum: true      // false if the checksum is wrong ncda(naan+sp+id)
// }
//
```

Checksum calculation is based on the [NCDA algorithm](http://search.cpan.org/~jak/Noid/noid#NOID_CHECK_DIGIT_ALGORITHM)

### Generate an ARK without subpublisher

```javascript
var InistArk = require('inist-ark');

var ark = new InistArk({
naan: 12345
subpublisher: false
});
ark.generate();
// returns something like that:
//     ark:/12345/SX52MR0K-4
//

```

### Generate an ARK without hyphen

```javascript
var InistArk = require('inist-ark');

var ark = new InistArk({
	naan: 12345,
	subpublisher: 'XYZ',
	hyphen: false,
});
ark.generate();
// returns something like that:
//     ark:/12345/XYZSHML4WGPD
//


ark.generate({ subpublisher: false });
// returns something like that:
//	   ark:/12345/NW4CQCGC4
//

```

### Generate an ARK with specific length

```javascript
var InistArk = require('inist-ark');

var ark = new InistArk();

ark.generate({ size:3 });
// returns something like that:
//     ark:/12345/XYZ-34V-X
//

ark.generate({ subpublisher: false, size:4 });
// returns something like that:
//     ark:/12345/7XRS-3
//

ark.generate({ subpublisher: false, size:3, hyphen: false});
// returns something like that:
//     ark:/12345/BV81
//


```

## Constructor parameters

When creating a new InistArk instance, you can specify several parameters:

```javascript
var ark = new InistArk({
  // warn: do not modify this option if your are generating ARK for INIST's ressources
  naan: '67375',

  // setup the defaut subpublisher if you do not want to specify it when calling generate
  // notice that you have to register a subpublihser for your resource at INIST's central ARK registry
  // 3 characters length
  // if set to false, no subpublisher will be generate
  subpublisher: '',

  // INIST use a hyphen as separator be default,
  // if we don't want to separate sub publisher,
  // identifier and checksum with a hyphen just set this option to false
  hyphen: true,

  // warn: do not modify if you want to be INIST "normalized"
  // (notice there is no voyels and everything is uppercase)
  alphabet: '0123456789BCDFGHJKLMNPQRSTVWXZ'
});
```
