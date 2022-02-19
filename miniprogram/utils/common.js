const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isType = (data, type) => Object.prototype.toString.call(data) === `[object ${type}]`

const pick = (obj, filters = []) => {
  if (!isType(obj, 'Object')) return 'no object'
  const newObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && filters.includes(key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

const omit = (obj, filters = []) => {
  if (!isType(obj, 'Object')) return 'no object'
  const newObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !filters.includes(key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

const deepClone = (data) => {
  const result = isType(data, 'Array') ? [] : {}
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const val = data[key]
      if (isType(val, 'Object') || isType(val, 'Array')) {
        result[key] = deepClone(val)
      } else {
        result[key] = val
      }
    }
  }
  return result
}

const retry = (fn, limit = 2, failCallback = () => null) => {
  return (...args) => {
    try {
      return fn.apply(null, args)
    } catch (e) {
      if (limit > 0) {
        limit -= 1
        retry(fn, limit, failCallback).apply(null, args)
      } else {
        typeof failCallback === 'function' && failCallback()
        return null
      }
    }
  }
}

const guid = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + S4() + S4()
}

export { delay, isType, pick, omit, deepClone, retry, guid }
