module.exports = {
  // 选课列表
  '/base/qryXKDYList': {
    SUCCESS: true,
    MSG: '成功获取数据',
    SUM: 10,
    'DATA|10': [
      {
        arrangeId: '@inc(10000)',
        schoolId: '001',
        name: '2018级高中一年级学生选考调查',
        'status|1': ['完成', '未完成'],
        schoolYear: '2018-2019',
        'termCode|1': ['第一学期', '第二学期'],
        'gradeCode|1': ['高二', '高一', '高三'],
        createTime: '2018-10-22 10:00'
      }
    ]
  }
}
