import request from '@/utils/request'
import URL from '@/api/url'
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

/**
 * 重置表单
 * @param {Object} obj 参数
 */
export function resetForm(obj) {
  // typeof: boolean number string function object undefined
  for (const [key, val] of Object.entries(obj)) {
    switch (typeof val) {
      case 'boolean':
      case 'number':
        obj[key] = undefined
        break
      case 'string':
        obj[key] = ''
        break
      default:
        if (obj[key] instanceof Array) {
          obj[key] = []
        }
    }
  }
}
/**
 * 表格数据 校验修改按钮
 * @param {Object} ins 参数：this 对象
 */
export function validEditBtn(ins) {
  const len = ins.multipleSelection.length
  if (len === 0) {
    ins.$message({
      message: '请选择要修改的数据',
      type: 'warning'
    })
    return false
  }
  if (len > 1) {
    ins.$message({
      message: '一次只能修改一条数据',
      type: 'warning'
    })
    return false
  }
  ins.dialogFormVisible = true
  ins.dialogTitle = '修改'
  return true
}

/**
 * 删除表格多条数据
 * @param {} ins this 对象
 * @param {*} deleteKey 删除的键名
 * @param {*} deleteUrl 请求url
 */
export function deleteTableDatas(ins, deleteKey, deleteUrl) {
  if (ins.multipleSelection.length === 0) {
    ins.$message({
      message: '请选择要删除的数据',
      type: 'warning'
    })
    return
  }
  const ids = []
  ins.multipleSelection.forEach(item => {
    ids.push(item[deleteKey])
  })
  ins
    .$confirm('确定删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      const params = {
        a: '2'
      }
      params[deleteKey] = ids.join(',')
      const res = await request({
        url: URL[deleteUrl],
        method: 'get',
        params: params
      })
      ins.$message({
        type: res.SUCCESS ? 'success' : 'error',
        message: res.SUCCESS ? '删除成功!' : '删除失败'
      })
      // 重新加载数据
      if (res.SUCCESS) ins.queryBtn()
    })
    .catch(() => {
      ins.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
}

// 赋值
export function setDatas(originData, newData) {
  Object.keys(originData).forEach(key => {
    originData[key] = newData[key]
  })
}

// 页码参数转字符串
export function handlePageTot(data) {
  const params = {}
  Object.keys(data).forEach(key => {
    params[key] = data[key] + ''
  })
  return params
}
