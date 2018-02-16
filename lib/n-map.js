'use strict';

class MapValue {
  constructor (value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }
}

class NMap {
  constructor () {
    this._data = new Map();
    this._size = 0;
  }

  get size () {
    return this._size;
  }

  clear () {
    this._data = new Map();
    this._size = 0;
  }

  _addWalk(arr) {
    let posParent = null;
    let pos = this._data;
    const forLength = arr.length - 1;
    let item = arr[0];
    for (let i = 0; i < forLength; i++) {
      posParent = pos;
      pos = pos.get(item);
      if (pos === undefined) {
        const map = new Map();
        posParent.set(item, map);
        pos = map;
      } else if (pos instanceof MapValue) {
        const map = new Map();
        map.set(undefined, pos);
        posParent.set(item, map);
        pos = map;
      }
      item = arr[i + 1];
    }
    return pos;
  }

  set (...params) {
    if (params.length < 2) {
      throw new Error('NMap.set() should have at least 2 parameters (tuple, value).');
    }
    const value = new MapValue(params[params.length - 1]);
    const arr = Array.isArray(params[0]) ? params[0] : params.slice(0, -1);

    if (arr.some(val => val === undefined)) {
      throw new Error('Undefined is unsupported by NMap');
    }
    const pos = arr.length > 1 ? this._addWalk(arr) : this._data;
    const item = arr[arr.length - 1];

    const v = pos.get(item);
    if (v === undefined) {
      this._size++;
      pos.set(item, value);
    } else if (v instanceof MapValue) {
      pos.set(item, value);
    } else {
      if (!v.has(undefined)) {
        this._size++;
      }
      v.set(undefined, value);
    }
    return this;
  }

  _walkToItem(arr) {
    let pos = this._data;
    const forLength = arr.length - 1;
    let item = arr[0];
    for (let i = 0; i < forLength; i++) {
      if (!(pos instanceof Map)) {
        return false;
      }
      pos = pos.get(item);
      if (pos === undefined) {
        return false;
      }
      item = arr[i + 1];
    }
    return pos;
  }

  has (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;

    let pos = this._data;
    
    if (arr.length > 1) {
      pos = this._walkToItem(arr);
      if (pos === false) {
        return false;
      }
    }

    if (!(pos instanceof Map)) {
      return false;
    }
    const item = arr[arr.length - 1];
    const v = pos.get(item);
    
    if (v === undefined) {
      return false;
    } else if (v instanceof MapValue) {
      return true;
    }
    return v.has(undefined);
  }

  get (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;

    let pos = this._data;
    
    if (arr.length > 1) {
      pos = this._walkToItem(arr);
      if (pos === false) {
        return undefined;
      }
    }

    if (!(pos instanceof Map)) {
      return undefined;
    }
    const item = arr[arr.length - 1];
    const v = pos.get(item);
    
    if (v === undefined) {
      return undefined;
    } else if (v instanceof MapValue) {
      return v.value;
    }
    const it = v.get(undefined);
    if (it === undefined) {
      return undefined;
    }
    
    return it.value;
  }

  delete (...values) {
    const arr = Array.isArray(values[0]) ? values[0] : values;
    let pos = this._data;
    if (arr.length > 1) {
      pos = this._walkToItem(arr);
      if (pos === false) {
        return false;
      }
    }
    const item = arr[arr.length - 1];

    if (pos instanceof Map) {
      const it = pos.get(item);
      if (it === undefined) {
        return false;
      }
      if (it instanceof MapValue) {
        const res = pos.delete(item);
        this._size--;
        return true;
      }
      const res = it.delete(undefined);
      if (res) this._size--;
      return res;
    }
    return false;
  }

  entries () {
    const iterators = [this._data.entries()];
    const values = [];
    let iteratorIndex = 0;

    return {
      next: () => {
        while (true) {
          const it = iterators[iteratorIndex];
          const v = it.next();

          if (iteratorIndex === 0 && v.done) {
            break;
          } else if (v.done) {
            values[iteratorIndex] = undefined;
            iteratorIndex--;
            continue;
          }
          values[iteratorIndex] = v.value[0];
          const content = v.value[1];
          if (content instanceof MapValue) {
            const endIndex = values[iteratorIndex] === undefined ? iteratorIndex : iteratorIndex + 1;
            const newItem = values.slice(0, endIndex);
            return {
              value: [newItem, content.value],
              done: false,
            };
          } else if (content.size > 0) {
            iteratorIndex++;
            iterators[iteratorIndex] = content.entries();
          }
        }
        return {
          value: undefined,
          done: true,
        };
      }
    };
  }

  values () {
    const entries = this.entries();
    return {
      next: () => {
        const it = entries.next();
        return {
          value: it.value,
          done: it.done
        };
      }
    }
  }

  forEach (func) {
    const entries = this.values();
    while (1) {
      const v = entries.next();
      if (v.done) {
        break;
      }
      func(v.value, v.value, this);
    }
  }

  [Symbol.iterator] () {
    return this.values();
  }
  
  inspect () {
    const entries = this.values();
    const pairs = [];
    while (1) {
      const v = entries.next();
      if (v.done) {
        break;
      }
      pairs.push(`(${v.value[0].join(', ')}) => ${v.value[1]}`);
    }
    return `NMap { ${pairs.join(', ')} }`;
  }
}
module.exports = NMap;