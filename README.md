# node-inist-ark

## Install

```shell
npm i inist-ark
```

## Usage

### Generate lot of ARKs

```javascript
var generator = require('inist-ark').generator;
generator.options({
  naan: '67375',
  subpublisher: '39D'
});
generator.generate(); // returns: ark:/67375/39D-L2DM2F95-7
generator.generate(); // returns: ark:/67375/39D-L2DM2F95-7
generator.generate(); // returns: ark:/67375/015-FG0H2546-9
generator.generate(); // returns: ark:/67375/015-X73BVHH2-2
generator.generate(); // returns: ark:/67375/015-TD0G7P90-X
generator.generate(); // returns: ark:/67375/015-5PZW7M6Q-5
generator.generate(); // returns: ark:/67375/015-58VCS11W-9
// ...

```

### Parse an ARK

```javascript
var parser = require('inist-ark').parser;
parser.parse('ark:/67375/39D-L2DM2F95-7');
// returns:
// { ark:          'ark:/67375/39D-L2DM2F95-7',
//   naan:         '67375',
//   name:         '39D-L2DM2F95-7'
//   subpublisher: '39D',
//   identifier:   'L2DM2F95',
//   checksum:     '7'
// }
```

### Validate an ARK

```javascript
var validator = require('inist-ark').validator;
validator.validate('ark:/67375/39D-L2DM2F95-7');
// returns:
// { ark: true,          // false if one of the folowwing fields is false
//   naan: true,         // false if it's not the inist naan 
//   name: true,         // false if subpubliser, identifier or checksum is false
//   subpublisher: true, // false if not 3 char length and not respecting the alphabet
//   identifier: true,   // false if not 8 chars len or if it does not respect the alphabet
//   checksum: true      // false if the checksum is wrong
// }
// 
```

 Alphabet is: 0123456789BCDFGHJKLMNPQRSTVWXZ (notice there is no voyels and everything is uppercase)

