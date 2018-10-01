'use strict'

var caches = new WeakMap()

function StringCacheMap(limit, hard) {
  if (!this || this.constructor !== StringCacheMap)
    throw new TypeError("Constructor StringCacheMap requires 'new'")

  caches.set(this, {
    limit: limit || 16,
    hard: hard !== false,
    victims: Object.create(null),
    entries: Object.create(null),
    count: 0,
  })
}

StringCacheMap.prototype.delete = function(key) {
  if (!this.has(key)) return false

  var cache = caches.get(this)
  var entries = cache.entries
  var victims = cache.victims
  delete entries[key]
  delete victims[key]
  return true
}

StringCacheMap.prototype.get = function(key) {
  var cache = caches.get(this)
  var entries = cache.entries
  var victims = cache.victims
  var hard = cache.hard

  if (key in entries) return entries[key]
  if (key in victims)
    if (hard) this.set(key, victims[key])
    else entries[key] = victims[key]

  return entries[key]
}

StringCacheMap.prototype.has = function(key) {
  var cache = caches.get(this)
  var entries = cache.entries
  var victims = cache.victims
  return key in entries || key in victims
}

StringCacheMap.prototype.set = function(key, value) {
  var cache = caches.get(this)

  cache.count += 1
  if (cache.count > cache.limit) {
    cache.count = 1
    cache.victims = cache.entries
    cache.entries = Object.create(null)
  }

  cache.entries[key] = value
  return this
}

Object.defineProperty(StringCacheMap, 'length', {
  value: 0,
})

module.exports = StringCacheMap
