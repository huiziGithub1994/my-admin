import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
// const calenderId = 'calenderId'
// const curYear = 'curYear'
// const curTerm = 'curTerm'
// const schoolId = 'schoolId'

export function getCookie(key) {
  return Cookies.get(key)
}

export function setCookie(key, val) {
  return Cookies.set(key, val)
}

export function removeCookie(key) {
  return Cookies.remove(key)
}
