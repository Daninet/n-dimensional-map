'use strict';
/* global test, expect */

const NMap = require('../');
const NMAX = 50;

function randInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compareArrayAndMap (arr, map) {
  arr.forEach(it => {
    expect(map.has(it)).toEqual(true);
    expect(map.has([...it, 100])).toBe(false);
    expect(map.has([...it.slice(0, -1), 51])).toBe(false);

    expect(map.get(it)).toEqual(it.reduce((a, b) => a + b, 0));
    expect(map.get([...it, 100])).toBe(undefined);
    expect(map.get([...it.slice(0, -1), 51])).toBe(undefined);
  });
  const strElements = arr.map(f => JSON.stringify(f));
  map.forEach(it => {
    const path = it[0];
    const strArr = JSON.stringify(path);
    const res = strElements.find(f => f === strArr);
    expect(res).not.toBeUndefined();
    const sum = path.reduce((a, b) => a + b, 0);
    const value = it[1];
    expect(value).toBe(sum);
  });
}

test('map-simple', () => {
  for (let n = 0; n < NMAX; n++) {
    const map = new Map();
    const nmap = new NMap();
    for (let i = 0; i < 1000; i++) {
      const rnd = randInt(0, 100);
      expect(nmap.has(rnd)).toBe(map.has(rnd));
      map.set(rnd, rnd * 2);
      nmap.set(rnd, rnd * 2);
      expect(nmap.has(rnd)).toBe(true);
      expect(nmap.get(rnd)).toBe(map.get(rnd));
    }
    expect(nmap.size).toBe(map.size);
    for (let i = 0; i < 100; i++) {
      const rnd = randInt(0, 100);
      expect(nmap.has(rnd)).toBe(map.has(rnd));
      expect(nmap.delete(rnd)).toBe(map.delete(rnd));
      expect(nmap.has(rnd)).toBe(false);
    }
    expect(nmap.size).toBe(map.size);
    for (let i = 0; i <= 100; i++) {
      expect(nmap.has(i)).toBe(map.has(i));
      expect(nmap.get(i)).toBe(map.get(i));
    }
  }
});

test('map-deep', () => {
  for (let n = 0; n < NMAX; n++) {
    let items = [];
    const map = new NMap();
    for (let i = 0; i < 1000; i++) {
      const arr = [];
      const c = randInt(1, 9);
      for (let j = 0; j < c; j++) {
        arr.push(randInt(1, 50));
      }
      map.set(arr, arr.reduce((a, b) => a + b, 0));
      expect(map.has(arr)).toBe(true);
      expect(map.get(arr)).toBe(arr.reduce((a, b) => a + b, 0));
      items.push(arr);
    }
    expect(map.size).toBeLessThanOrEqual(1000);
    compareArrayAndMap(items, map);
    const startSize = map.size;
    for (let i = 0; i < 10; i++) {
      const arr = [];
      const c = randInt(1, 9);
      for (let j = 0; j < c; j++) {
        arr.push(randInt(1, 50));
      }
      if (map.has(arr)) {
        continue;
      }
      expect(map.delete(arr)).toBe(false);
    }
    expect(map.size).toEqual(startSize);
    compareArrayAndMap(items, map);
    let removedItems = 0;
    for (let i = 0; i < 100; i++) {
      const index = randInt(0, items.length - 1);
      const val = items[index];
      const valString = JSON.stringify(val);
      items = items.filter(it => { // remove all occurences from array
        if (it.length !== val.length || it[0] !== val[0]) {
          return true;
        }
        return JSON.stringify(it) !== valString;
      });
      if (map.delete(val)) removedItems++;
    }
    expect(map.size).toEqual(startSize - removedItems);
    compareArrayAndMap(items, map);
  }
});
