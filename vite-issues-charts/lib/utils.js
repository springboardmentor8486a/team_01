// cn.js - Plain JS version, works with plain CSS
export function cn(...classes) {
  // Remove falsy values (false, null, undefined, '')
  return classes.filter(Boolean).join(' ')
}

