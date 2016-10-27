# node-inist-ark

NodeJS package used to handle "normalized" ARK for the INIST organization.

INIST's ARK anatomy is:

```
    ark:/67375/39D-L2DM2F95-7
    \__/ \___/ \__/\______/\_/
     |     |    |     |     |
ARK Label  |    |     |     Check sum (1 char)
           |    |    Identifier (8 chars)
           |   Sub-publisher (3 chars, it has to be generated in the centralized INIST ARK registry)
           |
Name Assigning Authority Number (NAAN) (67375 is dedicated for INIST)
```

- INIST NAAN will not change and is this integer: 67375
- Sub-publisher is handled by a [centralized ARK registry for INIST](todo add the link)
- Identifier is a string of 8 uppercase characters from this alphabet 0123456789BCDFGHJKLMNPQRSTVWXZ
- Check sum is 1 character calculated from the ARK identifier following the [ISSN checksum algorithme](https://en.wikipedia.org/wiki/International_Standard_Serial_Number#Code_format). It is used to help detecting mispelled ARK.

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
ark2.generate({ subpublisher: '39D' }); // returns: ark:/67375/39D-L2DM2F95-7
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
ark.parse('ark:/67375/39D-L2DM2F95-7');
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
ark.validate('ark:/67375/39D-L2DM2F95-7');
// returns:
// { ark: true,          // false if one of the following fields is false
//   naan: true,         // false if it's not the inist naan 
//   name: true,         // false if subpubliser, identifier or checksum is false
//   subpublisher: true, // false if not 3 char length and not respecting the alphabet
//   identifier: true,   // false if not 8 chars len or if it does not respect the alphabet
//   checksum: true      // false if the checksum is wrong
// }
// 
```

Checksum calculation is based on the [ISSN algorithme](https://en.wikipedia.org/wiki/International_Standard_Serial_Number#Code_format)

## Constructor parameters

When creating a new InistArk instance, you can specify several parameters:

```javascript
var ark = new InistArk({
  // warn: do not modify this option if your are generating ARK for INIST's ressources
  naan: '67375',
  
  // setup the defaut subpublisher if you do not want to specify it when calling generate
  // notice that you have to register a subpublihser for your resource at INIST's central ARK registry
  subpublisher: '39D',
  
  // warn: do not modify if you want to be INIST "normalized"
  // (notice there is no voyels and everything is uppercase)
  alphabet: '0123456789BCDFGHJKLMNPQRSTVWXZ'
});
```