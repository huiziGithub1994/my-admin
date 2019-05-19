const reg = /[0-9]+$/
export default function addHooks(hot, prop) {
  hot.addHook('afterSelectionEndByProp', function(r, p, r2, p2) {
    let data = []
    prop.forEach(key => {
      if (p !== key || r === r2 || p !== p2) return
      data = hot.getSourceData()
      const startRow = data[r][p] // 当前列起始行的数据
      if (!startRow) return
      const num = startRow.toString().match(reg)
      if (!num) return
      let remain = ''
      if (num.index > 0) {
        // c101
        remain = startRow.substr(0, startRow.indexOf(num))
      } else {
        // 101
        remain = num
      }
      // 匹配数字
      const len = r2 - r
      for (let i = 0; i <= len; i++) {
        const addIndex = Number(num) + i
        data[r + i][p] = num.index > 0 ? remain + addIndex : addIndex
      }
    })
    if (data.length) {
      hot.loadData(data)
      data = []
    }
  })
}
