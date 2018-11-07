/* 业务帮助类 */
/* 2.根据表格高度，自动计算出表格显示数据的最佳行数。
    入参：tableHeight(el-table表格高度)
    返回：pageSize(每页显示条数数组),pageSize[0]:表格显示数据的最佳行数
    tableHeight不包含表格底部的分页和页数高度，表头高度：40px;表格不换行的行高：40px;
*/
export function getTableBestRows(tableHeight) {
  const bestRows = Number.parseInt((tableHeight - 40) / 45)
  const pageSize = [bestRows]
  let i = bestRows + 10
  do {
    if (i % 5 === 0) {
      pageSize.push(i)
    }
    i++
  } while (pageSize.length < 5)
  return pageSize
}

// 获取当前学年
export function getCurSchoolYearTerm() {
  const date = new Date()
  let currentYear = date.getFullYear()
  const month = date.getMonth() + 1
  let termCode = '1'
  if (month >= 3 && month <= 8) {
    termCode = '2'
    currentYear -= 1
  }
  return {
    currentYear: currentYear.toString(),
    termCode: termCode
  }
}
/*
校验
*/
export const Validators = {
  checkNull(rule, value, callback) {
    if (value === '' || value == null) {
      callback(new Error('该字段为必填字段'))
    } else {
      callback()
    }
  },
  // 大于等于0的整数
  checkIntGreaterZero(rule, value, callback) {
    // 含0正整数
    const reg = /^([0-9]\d*|[0]{1,1})$/
    if (typeof value === 'number' || value === '' || value === undefined) {
      callback()
    } else {
      if (!reg.test(value)) {
        callback(new Error('请输入>=0的整数'))
      } else {
        callback()
      }
    }
  },
  checkNumber(rule, value, callback) {
    const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/gi
    if (typeof value === 'number' || value === '' || value === undefined) {
      callback()
    } else {
      if (!reg.test(value)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
  },
  checkEnglish(rule, value, callback) {
    const reg = /^[A-Za-z]+$/
    if (!reg.test(value)) {
      callback(new Error('请输入英文字母'))
    } else {
      callback()
    }
  },
  checkEmail(rule, value, callback) {
    const reg = new RegExp(
      '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
    )
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱地址'))
    } else {
      callback()
    }
  }
}
