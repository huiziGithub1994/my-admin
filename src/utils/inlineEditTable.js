/**
 * 初始化表格的头部、行列、数据为空
 * @param {*} data
 * @param {*} baseHeader
 */
const weeks = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日'
]
// valueTpye 1:string 2 object
export function initTableData(
  data = {
    workDays: 5,
    countInMorning: 0,
    countMorning: 4,
    countAfternoon: 4,
    countNight: 0
  },
  baseHeader = [],
  valueType = '1'
) {
  const {
    workDays,
    countInMorning,
    countMorning,
    countAfternoon,
    countNight
  } = data
  const baseHeaderLength = baseHeader.length
  // 生成表头
  const colHeaders = [...baseHeader, ...weeks.slice(0, workDays)]
  // 初始化表格的列
  const columns = []
  if (baseHeaderLength > 1) {
    // 校历维护
    const defaultColumn = {
      type: 'time',
      timeFormat: 'HH:mm',
      correctFormat: true
    }
    for (let j = 0; j < workDays + baseHeaderLength; j++) {
      if (j <= 1) {
        columns.push(
          Object.assign(
            { data: j === 0 ? 'beginTime' : 'endTime' },
            defaultColumn
          )
        )
      } else if (j === 2) {
        columns.push({ data: 'lessionSeq', readOnly: true })
      } else {
        columns.push({ data: j - baseHeaderLength })
      }
    }
  } else {
    // 排课
    for (let j = 0; j < workDays + baseHeaderLength; j++) {
      if (j === 0) {
        columns.push({ data: 'lessionSeq', readOnly: true })
      } else {
        columns.push({ data: j - baseHeaderLength })
      }
    }
  }
  // 表格默认空内容
  const defaultData = []
  const defaultRow = baseHeaderLength > 1 ? { beginTime: '', endTime: '' } : {}
  const count =
    Number(countInMorning) +
    Number(countMorning) +
    Number(countAfternoon) +
    Number(countNight)
  for (let i = 0; i < count; i++) {
    for (let j = -1; j < workDays; j++) {
      if (j === -1) {
        // j=-1 :后台数据j=0表示周一
        defaultRow.lessionSeq = `第${i + 1}节`
      } else {
        defaultRow[j] = valueType === '1' ? '' : {}
      }
    }
    defaultData.push(Object.assign({}, defaultRow))
  }
  return { colHeaders, columns, defaultData }
}
