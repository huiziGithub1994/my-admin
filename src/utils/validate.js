/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

// 普通排课-授课录入、新高考排课-走班教学任务
export function numValidator(value, callback) {
  if (value !== '' && value !== undefined && value !== null) {
    if (value.indexOf('+') > -1) {
      const splitArr = value.split('+')
      let flag = true
      for (let i = 0; i < splitArr.length; i++) {
        const tVal = splitArr[i]
        if (typeof +tVal !== 'number') {
          flag = false
          break
        } else if (+tVal % 1 !== 0 || tVal.indexOf('.') > -1) {
          flag = false
          break
        }
      }
      callback(flag)
    } else {
      if (typeof +value !== 'number') {
        callback(false)
      } else {
        const valueStr = value + ''
        if (+value % 1 === 0 && valueStr.indexOf('.') < 0) {
          callback(true)
        } else {
          callback(false)
        }
      }
    }
  } else {
    callback(true)
  }
}
