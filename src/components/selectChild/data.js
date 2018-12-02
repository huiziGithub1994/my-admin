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
  for (let i = year; i > year - 3; i--) {
    resultArr.push({ value: i, label: `${i} - ${i + 1} 学年` })
  }
  return resultArr
}

// 年级
export function gradeSelect() {
  const primaryArr = [
    { value: '0101', label: '小学一年级' },
    { value: '0102', label: '小学二年级' },
    { value: '0103', label: '小学三年级' },
    { value: '0104', label: '小学四年级' },
    { value: '0105', label: '小学五年级' },
    { value: '0106', label: '小学六年级' }
  ]
  const middleArr = [
    { value: '0201', label: '初中一年级' },
    { value: '0202', label: '初中二年级' },
    { value: '0203', label: '初中三年级' }
  ]
  const hightArr = [
    { value: '0301', label: '高中一年级' },
    { value: '0302', label: '高中二年级' },
    { value: '0303', label: '高中三年级' }
  ]
  return [...primaryArr, ...middleArr, ...hightArr]
}

// 年级级联数据
export const classCascaderSelect = [
  {
    value: '01',
    label: '小学',
    children: [
      { value: '01', label: '一年级' },
      { value: '02', label: '二年级' },
      { value: '03', label: '三年级' },
      { value: '04', label: '四年级' },
      { value: '05', label: '五年级' },
      { value: '06', label: '六年级' }
    ]
  },
  {
    value: '02',
    label: '初中',
    children: [
      { value: '01', label: '一年级' },
      { value: '02', label: '二年级' },
      { value: '03', label: '三年级' }
    ]
  },
  {
    value: '03',
    label: '高中',
    children: [
      { value: '01', label: '一年级' },
      { value: '02', label: '二年级' },
      { value: '03', label: '三年级' }
    ]
  }
]
