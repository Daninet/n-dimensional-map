'use strict';
/* global test, expect */

const NMap = require('../');

function toArray (map) {
  const arr = [];
  map.forEach(it => arr.push(it));
  return arr;
}

test('add', () => {
  const map = new NMap();
  expect(map.size).toBe(0);
  map.set(1, 'x');
  expect(map.size).toBe(1);
  expect(map.inspect()).toEqual('NMap { (1) => x }');
  map.set(1, 'y');
  expect(map.size).toBe(1);
  expect(map.inspect()).toEqual('NMap { (1) => y }');
  map.set(2, 'z');
  expect(map.size).toBe(2);
  expect(map.inspect()).toEqual('NMap { (1) => y, (2) => z }');
  map.set(1, 2, 'x2');
  expect(map.size).toBe(3);
  expect(map.inspect()).toEqual('NMap { (1) => y, (1, 2) => x2, (2) => z }');
  map.set(1, 2, 'y2');
  expect(map.size).toBe(3);
  expect(map.inspect()).toEqual('NMap { (1) => y, (1, 2) => y2, (2) => z }');
  map.set([1, 3], 'z2');
  expect(map.size).toBe(4);
  expect(map.inspect()).toEqual('NMap { (1) => y, (1, 2) => y2, (1, 3) => z2, (2) => z }');
  map.set([2, 3], 'a');
  expect(map.size).toBe(5);
  expect(map.inspect()).toEqual('NMap { (1) => y, (1, 2) => y2, (1, 3) => z2, (2) => z, (2, 3) => a }');
  map.set(2, 3, 6, 'a3');
  expect(map.size).toBe(6);
  expect(map.inspect()).toEqual('NMap { (1) => y, (1, 2) => y2, (1, 3) => z2, (2) => z, (2, 3) => a, (2, 3, 6) => a3 }');
  map.set(2, 3, 'b');
  expect(map.size).toBe(6);
  expect(map.inspect()).toEqual('NMap { (1) => y, (1, 2) => y2, (1, 3) => z2, (2) => z, (2, 3) => b, (2, 3, 6) => a3 }');
  map.set(2, 'c');
  expect(map.size).toBe(6);
  expect(map.inspect()).toEqual('NMap { (1) => y, (1, 2) => y2, (1, 3) => z2, (2) => c, (2, 3) => b, (2, 3, 6) => a3 }');
  map.set(1, 2, 'd');
  expect(map.size).toBe(6);
  expect(map.inspect()).toEqual('NMap { (1) => y, (1, 2) => d, (1, 3) => z2, (2) => c, (2, 3) => b, (2, 3, 6) => a3 }');
  expect(() => {
    map.set(1);
  }).toThrow();
  expect(() => {
    map.set([1, 2, 3, undefined], 'a');
  }).toThrow();
});

test('has', () => {
  const map = new NMap();
  map.set(1, 'x');
  expect(map.has(1)).toBe(true);
  expect(map.has(2)).toBe(false);
  expect(map.has(1, 2)).toBe(false);
  map.set(2, 3, 4, 'y');
  expect(map.has([2])).toBe(false);
  expect(map.has(3)).toBe(false);
  expect(map.has(4)).toBe(false);
  expect(map.has(2, 3)).toBe(false);
  expect(map.has([2, 3, 4])).toBe(true);
  expect(map.has([2, 3, 4, 5])).toBe(false);
  expect(map.has([2, 3, 4, 5, 6, 7])).toBe(false);
  expect(map.has(2, 3, 3, 5)).toBe(false);
  expect(map.has(2, 2, 4)).toBe(false);
  map.set(1, 2, 'z');
  expect(map.has([1])).toBe(true);
  expect(map.has(1, 2)).toBe(true);
  map.set(1, 2, 'a');
  expect(map.has(1)).toBe(true);
  expect(map.has(1, 2)).toBe(true);
  map.set(2, 3, 'b');
  expect(map.has(2, 2)).toBe(false);
  expect(map.has(2, 3)).toBe(true);
  expect(map.has(2, 3, 4)).toBe(true);
  expect(map.has()).toBe(false);
});

test('get', () => {
  const map = new NMap();
  map.set(1, 'x');
  expect(map.get(1)).toBe('x');
  expect(map.get(2)).toBe(undefined);
  expect(map.get(1, 2)).toBe(undefined);
  map.set(2, 3, 4, 'y');
  expect(map.get([2])).toBe(undefined);
  expect(map.get(3)).toBe(undefined);
  expect(map.get(4)).toBe(undefined);
  expect(map.get(2, 3)).toBe(undefined);
  expect(map.get([2, 3, 4])).toBe('y');
  expect(map.get([2, 3, 4, 5])).toBe(undefined);
  expect(map.get([2, 3, 4, 5, 6, 7])).toBe(undefined);
  expect(map.get(2, 3, 3, 5)).toBe(undefined);
  expect(map.get(2, 2, 4)).toBe(undefined);
  map.set(1, 2, 'z');
  expect(map.get([1])).toBe('x');
  expect(map.get(1, 2)).toBe('z');
  map.set(1, 2, 'a');
  expect(map.get(1)).toBe('x');
  expect(map.get(1, 2)).toBe('a');
  map.set(2, 3, 'b');
  expect(map.get(2, 2)).toBe(undefined);
  expect(map.get(2, 3)).toBe('b');
  expect(map.get(2, 3, 4)).toBe('y');
  expect(map.get()).toBe(undefined);
});

test('delete', () => {
  const map = new NMap();
  map.set(1, 'a');
  map.set(2, 'b');
  expect(map.size).toBe(2);
  expect(map.inspect()).toEqual('NMap { (1) => a, (2) => b }');

  expect(map.delete(3)).toBe(false);
  expect(map.size).toBe(2);
  expect(map.inspect()).toEqual('NMap { (1) => a, (2) => b }');

  expect(map.delete([1])).toBe(true);
  expect(map.size).toBe(1);
  expect(map.inspect()).toEqual('NMap { (2) => b }');
  map.set(1, 2, 3, 'c');
  expect(map.delete(1, 2, 3, 4)).toBe(false);
  expect(map.size).toBe(2);
  expect(map.delete([1, 2])).toBe(false);
  expect(map.size).toBe(2);
  expect(map.delete(1, 2, 3)).toBe(true);
  expect(map.size).toBe(1);
  expect(map.inspect()).toEqual('NMap { (2) => b }');
  map.set(2, 3, 4, 5, 'c');
  map.set(2, 3, 'c');
  map.set(2, 3, 4, 'd');
  expect(map.delete(2, 4)).toBe(false);
  expect(map.delete(2)).toBe(true);
  expect(map.size).toBe(3);
  expect(map.delete(2, 3, 6, 7)).toBe(false);
  expect(map.delete(2, 3, 4, 5)).toBe(true);
  expect(map.inspect()).toEqual('NMap { (2, 3, 4) => d, (2, 3) => c }');
  expect(map.delete()).toBe(false);
});

test('foreach', () => {
  const map = new NMap();
  map.set(1, 'a');
  map.set(2, 3, 6, 'b');
  map.set(2, 3, 'c');
  map.set(1, 2, 'd');
  map.set(1, 2, 'e');
  map.set(2, 'f');
  const arr = [];
  map.forEach(it => arr.push(`(${it[0].join(', ')}) => ${it[1]}`));
  expect(arr).toEqual([ '(1) => a', '(1, 2) => e', '(2, 3, 6) => b', '(2, 3) => c', '(2) => f' ]);
});

test('for-of', () => {
  const map = new NMap();
  map.set(1, 'a');
  map.set(2, 3, 6, 'b');
  map.set(2, 3, 'c');
  map.set(1, 2, 'd');
  map.set(1, 2, 'e');
  map.set(2, 'f');
  const arr = [];
  for (const it of map) {
    arr.push(`(${it[0].join(', ')}) => ${it[1]}`);
  }
  expect(arr).toEqual([ '(1) => a', '(1, 2) => e', '(2, 3, 6) => b', '(2, 3) => c', '(2) => f' ]);
});

test('clear', () => {
  const map = new NMap();
  map.set(1, 'a');
  map.set(2, 3, 6, 'b');
  map.set(2, 3, 'c');
  map.set(1, 2, 'd');
  map.set(1, 2, 'e');
  map.set(2, 'f');
  expect(map.size).toBe(5);
  map.clear();
  expect(map.size).toBe(0);
  expect(toArray(map)).toEqual([]);
  map.set(2, 'a');
  expect(map.size).toBe(1);
  expect(toArray(map)).toEqual([ [[2], 'a'] ]);
});

test('inspect', () => {
  const map = new NMap();
  expect(map.inspect()).toBe('NMap {  }');
  map.set(1, 'a');
  expect(map.inspect()).toBe('NMap { (1) => a }');
  map.set(2, 3, 6, 'b');
  map.set(2, 3, 'c');
  map.set(1, 2, 'd');
  map.set(1, 2, 'e');
  map.set(2, 'f');
  expect(map.inspect()).toBe('NMap { (1) => a, (1, 2) => e, (2, 3, 6) => b, (2, 3) => c, (2) => f }');
});
