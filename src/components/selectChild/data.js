// 下拉列表 固定静态数据
// 学期
export const tearmSelect = [
  { value: '1', label: '第一学期' },
  { value: '2', label: '第二学期' }
]

// 学年
export function yearSelect() {
  const date = new Date()
  let year = date.getFullYear()
  const month = date.getMonth() + 1
  const resultArr = []
  if (month >= 3 && month <= 8) year--
  for (let i = year; i > year - 7; i--) {
    resultArr.push({ value: i, label: `${i} - ${i + 1} 学年` })
  }
  return resultArr
}

// 年级
export function gradeSelect() {
  const primaryArr = [
    { value: '01,01', label: '小学一年级' },
    { value: '01,02', label: '小学二年级' },
    { value: '01,03', label: '小学三年级' },
    { value: '01,04', label: '小学四年级' },
    { value: '01,05', label: '小学五年级' },
    { value: '01,06', label: '小学六年级' }
  ]
  const middleArr = [
    { value: '02,01', label: '初中一年级' },
    { value: '02,02', label: '初中二年级' },
    { value: '02,03', label: '初中三年级' }
  ]
  const hightArr = [
    { value: '03,01', label: '高中一年级' },
    { value: '03,02', label: '高中二年级' },
    { value: '03,03', label: '高中三年级' }
  ]
  return [...primaryArr, ...middleArr, ...hightArr]
}
