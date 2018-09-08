const StringCacheMap = require('..')

describe('StringCacheMap limits', () => {
  test('capacity is up to the double of the limit', () => {
    const map = new StringCacheMap(2)
    map.set('a', 1)
    map.set('b', 2)

    expect(map.get('a')).toBe(1)
    expect(map.has('a')).toBe(true)
  })

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

  test('acts an lru resquing elements present in victims', () => {
    const map = new StringCacheMap(2)
    map.set('a', 1)
    map.set('b', 2)
    map.set('c', 3)
    map.set('d', 4)
    map.get('a')
    map.set('e', 5)

    expect(map.get('a')).toBe(1)
    expect(map.has('a')).toBe(true)
  })

  test('gets lru may expulse newer values', () => {
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

  test('delete also deletes from the victims', () => {
    const map = new StringCacheMap(2, false)
    map.set('a', 1)
    map.set('b', 2)
    map.set('c', 3)
    map.get('a')
    map.set('d', 4)
    map.delete('a')

    expect(map.get('a')).toBeUndefined()
    expect(map.has('a')).toBe(false)
  })
})
