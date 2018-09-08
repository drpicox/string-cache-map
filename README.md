StringCacheMap ![building status](https://www.travis-ci.org/drpicox/string-cache-map.svg?branch=master)
=============

StringCacheMap is a Map with an API compatible with
[WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
that stores string-any key-value pairs.

StringCacheMap has strings as keys and any value as a key. It is like using an object as a cache but with some advantages: 1) it is possible to limit the total of pairs key-value stored to a maximum amount, 2) default property names like "constructor" are not present, 3) it uses an additional victims cache to rescue old values and emulate a really fast LRU cache.

It is a substitute for WeakMap when keys are strings.

Quick Use
----------

Install with `npm` or `yarn`:

```
npm install --save string-cache-map
```

Your Code:

```javascript
import StringCacheMap from 'string-cache-map'

const map = new StringCacheMap(2)
map.set('a', 1)
map.set('b', 2)

console.log(map.get('a')) // output 1
console.log(map.has('a')) // output true
```

StringCacheMap Basic API
----------------------------

Add elements with `set` and `get` to obtain the value:

```javascript
import StringCacheMap from 'string-cache-map'

test('set values can be get', () => {
  const map = new StringCacheMap()
  map.set('fOf', 'foo')
  map.set('bOf', 'bar')

  expect(map.get('fOf')).toBe('foo')
  expect(map.get('bOf')).toBe('bar')
})
```

Query if values are present with `has`:

```javascript
import StringCacheMap from 'string-cache-map'

test('has returns true if value is present, or false otherwise', () => {
  const map = new StringCacheMap()
  map.set('fOf', 'foo')
  map.set('uOf', undefined)

  expect(map.has('fOf')).toBe(true)
  expect(map.has('uOf')).toBe(true)
  expect(map.has('bOf')).toBe(false)
  expect(map.has('constructor')).toBe(false)
})
```

Remove elements with `delete`:

```javascript
import StringCacheMap from 'string-cache-map'

test('delete removes a value and returns true if was removed, () => {
  const map = new StringCacheMap()
  map.set('fOf', 'foo')

  expect(map.delete('fOf')).toBe(true)
  expect(map.delete('bOf')).toBe(false)
  expect(map.has('fOf')).toBe(false)
})
```


Limit
------

The first argument of the constructor is the limit:

```javascript
import StringCacheMap from 'string-cache-map'

test('capacity is up to the double of the limit', () => {
  const map = new StringCacheMap(2)
  map.set('a', 1)
  map.set('b', 2)

  expect(map.get('a')).toBe(1)
  expect(map.has('a')).toBe(true)
})
```

It automatically deletes old unused values beyond the limit:

```javascript
import StringCacheMap from 'string-cache-map'

test('capacity ensured is the limit', () => {
  const map = new StringCacheMap(2)
  map.set('a', 1)
  map.set('b', 2)
  map.set('c', 3)
  map.set('d', 4)
  map.set('e', 5)

  expect(map.get('d')).toBe(4)
  expect(map.has('a')).toBe(false)
})
```

LRU prioritizes last got values over last set values:

```javascript
import StringCacheMap from 'string-cache-map'

  test('gets lru reprioritizes values', () => {
    const map = new StringCacheMap(2)
    map.set('a', 1)
    map.set('b', 2)
    map.set('c', 3)
    map.set('d', 4)
    map.get('a')
    map.get('b')
    map.get('c')
    map.set('e', 5)

    expect(map.get('d')).toBeUndefined()
    expect(map.has('d')).toBe(false)
  })
```

With hard mode off (second constructor argument set to false), LRU does not invalidate last set values:

```javascript
import StringCacheMap from 'string-cache-map'

test('gets lru does not expulse newer values if hard is false', () => {
  const map = new StringCacheMap(2, false)
  map.set('a', 1)
  map.set('b', 2)
  map.set('c', 3)
  map.set('d', 4)
  map.get('a')
  map.get('b')
  map.get('c')
  map.set('e', 5)

  expect(map.get('d')).toBe(4)
  expect(map.has('d')).toBe(true)
})
```
