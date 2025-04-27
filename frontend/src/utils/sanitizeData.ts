function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeData<T>(data: T): T {
  if (typeof data === 'string') {
    return sanitizeString(data) as T
  } else if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item)) as T
  } else if (typeof data === 'object' && data !== null) {
    const sanitizedObj: { [key: string]: unknown } = {}
    for (const key in data) {
      const value = (data as Record<string, unknown>)[key]
      sanitizedObj[key] = sanitizeData(value)
    }
    return sanitizedObj as T
  }
  return data
}
