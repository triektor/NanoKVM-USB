type ItemWithExpiry = {
  value: string
  expiry: number
}

// set the value with expiration time (unit: milliseconds)
export function setWithExpiry(key: string, value: string, ttl: number): void {
  const now = new Date()

  const item: ItemWithExpiry = {
    value: value,
    expiry: now.getTime() + ttl
  }

  localStorage.setItem(key, JSON.stringify(item))
}

// get the value with expiration time
export function getWithExpiry(key: string): string | null {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) return null

  const item: ItemWithExpiry = JSON.parse(itemStr)
  const now = new Date()
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}
