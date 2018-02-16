n-map
=======

[![Build Status](https://travis-ci.org/Daninet/n-map.svg?branch=master)](https://travis-ci.org/Daninet/n-map)
[![Coverage Status](https://coveralls.io/repos/github/Daninet/n-map/badge.svg?branch=master)](https://coveralls.io/github/Daninet/n-map?branch=master)
[![license](https://img.shields.io/github/license/Daninet/n-map.svg)](https://github.com/Daninet/n-map/blob/master/LICENSE)

Allows to put arrays into maps. Works similarly like ES6 Maps.

Install
=======
```
npm i n-map
```

Example
=======
```javascript
const NMap = require('n-map');
const map = new NMap();
map.set(1, 'a');
map.set(2, 'b');
map.set([2], 'c');
console.log(map); // NMap { (1) => a, (2) => c }
map.set(1, 2, 3, 'd');
console.log(map.get([1, 2, 3])); // d
map.set(1, 5, 'e');
map.set([1, 5], 'f');
console.log(map.get(1, 5)); // f
console.log(map); // NMap { (1) => a, (1, 2, 3) => d, (1, 5) => f, (2) => c }
map.delete(1, 2, 3);
console.log(map); // NMap { (1) => a, (1, 5) => f, (2) => c }
console.log(map.has(1, 2, 3)); // false
console.log(map.has(1, 5)); // true
```

License
=======
MIT
