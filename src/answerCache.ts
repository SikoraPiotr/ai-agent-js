interface CacheEntry {
  response: string
  createdAt: number
}

export const createAnswerCache = ({ ttlMs = 1000 * 60 * 15 }: { ttlMs?: number } = {}) => {
  const cache = new Map<string, CacheEntry>()

  const get = (key: string) => {
    const entry = cache.get(key)

    if (!entry) {
      return null
    }

    if (Date.now() - entry.createdAt > ttlMs) {
      cache.delete(key)
      return null
    }

    return entry.response
  }

  const set = (key: string, response: string) => {
    cache.set(key, { response, createdAt: Date.now() })
  }

  return {
    get,
    set,
    size: () => cache.size,
    clear: () => cache.clear(),
  }
}
