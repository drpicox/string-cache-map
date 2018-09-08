const StringCacheMap = require('..')

describe('StringCacheMap', () => {
  test('StringCacheMap.length is 0', () => {
    expect(StringCacheMap.length).toBe(0)
  })

  test('StringWeakMap must be use with new', () => {
    expect(StringCacheMap).toThrow()
  })

  test('set values can be get', () => {
    const map = new StringCacheMap()
    map.set('fOf', 'foo')
    map.set('bOf', 'bar')

    expect(map.get('fOf')).toBe('foo')
    expect(map.get('bOf')).toBe('bar')
  })

  test('set calls can be chained', () => {
    const map = new StringCacheMap().set('fOf', 'foo').set('bOf', 'bar')

    expect(map.get('fOf')).toBe('foo')
    expect(map.get('bOf')).toBe('bar')
  })

  test('set can redefine existing values', () => {
    const map = new StringCacheMap().set('fOf', 'foo').set('bOf', 'bar')

    map.set('bOf', 'baz')

    expect(map.get('fOf')).toBe('foo')
    expect(map.get('bOf')).toBe('baz')
  })

  test('get returns undefined if value is not setted', () => {
    const map = new StringCacheMap()

    expect(map.get('fOf')).toBeUndefined()
    expect(map.get(window)).toBeUndefined()
  })

  test('has returns true if value is present, or false otherwise', () => {
    const map = new StringCacheMap()
    map.set('fOf', 'foo')
    map.set('uOf', undefined)

    expect(map.has('fOf')).toBe(true)
    expect(map.has('uOf')).toBe(true)
    expect(map.has('bOf')).toBe(false)
    expect(map.has('constructor')).toBe(false)
    expect(map.has(window)).toBe(false)
  })

  test('delete removes a value and returns true if was removed, false otherwise', () => {
    const map = new StringCacheMap()
    map.set('fOf', 'foo')

    expect(map.delete('fOf')).toBe(true)
    expect(map.delete('bOf')).toBe(false)
    expect(map.has('fOf')).toBe(false)
  })
})
