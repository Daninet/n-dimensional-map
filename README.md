[![Build Status](https://travis-ci.org/Daninet/n-dimensional-map.svg?branch=master)](https://travis-ci.org/Daninet/n-dimensional-map)
[![Coverage Status](https://coveralls.io/repos/github/Daninet/n-dimensional-map/badge.svg?branch=master)](https://coveralls.io/github/Daninet/n-dimensional-map?branch=master)
[![license](https://img.shields.io/github/license/Daninet/n-dimensional-map.svg)](https://github.com/Daninet/n-dimensional-map/blob/master/LICENSE)

Allows to put arrays into maps. Works similarly like ES6 Maps.

Install
=======
```
npm i n-dimensional-map
```

Example
=======
```javascript
const NMap = require('n-dimensional-map');
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
