let num_p // 获取的初始状态，只得到一次
let second = 0 // 循环递增的数
let num_st = 0
let num_end = 0 // 记录数字的位置
let getNum = 0 // 截取的数字字符
let num_f // 选中单元格的个数
let direction_s // 方向
export default function addHooks(hot) {
  hot.addHook('beforeAutofillInsidePopulate', function(
    index,
    direction,
    data,
    baseRange
  ) {
    direction_s = direction
    // 向下拉自动填充
    hot.addHook('afterSelectionByProp', function(
      r,
      p,
      r2,
      p2,
      preventScrolling,
      selectionLayerLevel
    ) {
      let get_end
      if (r * 1 + second + 1 < hot.getSourceData().length) {
        m = hot.getSourceData() // 获取所有的数据
        if (r2 !== r) {
          // 方法只执行一次
          num_f = r2 - r
        }

        var m = m[r][p] // 当前数据
        if (second === 0) {
          for (var i = m.length - 1; i >= 0; i--) {
            if (!isNaN(m.charAt(i))) {
              // 判断当前是否是数字
              num_st = i
              if (num_end === 0) {
                num_end = i
              }
            } else {
              if (num_st === 0) {
                continue
              } else {
                break
              }
            }
          }
          if (num_st === num_end) {
            getNum = m.substring(num_st) // 数字段
            get_end = ''
          } else {
            getNum = m.substring(num_st, num_end + 1) // 数字段
            if (num_end + 1 === m.length) {
              get_end = m.substring(m.length)
            } else {
              get_end = m.substring(num_end + 1, m.length)
            }
          }
        }
        if (second === 0) {
          num_p = hot.getSourceData()
        }

        if (r2 !== r) {
          // 选中多个的时候执行
          if (num_f > second) {
            let list_new
            switch (direction_s) {
              case 'down':
                getNum = getNum * 1 + 1 // 递增数字
                list_new = m.substring(0, num_st) + getNum + get_end
                num_p[r * 1 + second + 1][p] = list_new
                break
              case 'up':
                getNum = getNum * 1 - 1 // 递增数字
                list_new = m.substring(0, num_st) + getNum + get_end
                num_p[r * 1 + num_f - second - 1][p] = list_new
                break
              default:
                console.log('添加错误')
            }
          }
        }
        second++
      }
    })
  })
  hot.addHook('afterSelectionEndByProp', function() {
    if (!num_p === '') {
      // /*初始化*/
      second = 0
      num_st = 0
      num_end = 0
      getNum = 0
      hot.loadData(num_p)
    }
  })
}
