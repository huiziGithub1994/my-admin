module.exports = {
  // 年级/班级禁排固排 treeData
  '/base/qryGradeClassTree': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        id: '@inc(1)',
        'label|1': ['初一', '初二', '初三', '高一', '高二', '高三'],
        'children|4': [
          {
            id: '@inc(2)',
            'label|1': [
              '初一1班',
              '初一2班',
              '初三1班',
              '高一1班',
              '高二3班',
              '高三1班'
            ]
          }
        ]
      }
    ]
  },
  // 教师禁排固排 treeData
  '/base/getTeacherTree': {
    SUCCESS: true,
    MSG: '成功获取数据',
    'DATA|2': [
      {
        id: '@inc(1)',
        'label|1': ['语文', '物理', '化学', '生物'],
        'children|4': [
          {
            id: '@inc(2)',
            label: '@cstr(2,4)'
          }
        ]
      }
    ]
  },
  // 教师禁排固排 教学任务
  '/base/getTeacherTeachTask': {
    SUCCESS: true,
    MSG: '成功获取数据',
    'DATA|2': [
      {
        'teachClass|1': ['高一1班', '高一2班', '高一3班'],
        'teachCourse|1': ['语文', '物理', '化学', '生物'],
        sum: 6,
        alreadyArrange: 1,
        noArrange: 5
      }
    ]
  },
  // 教师禁排固排 教学任务 课表
  '/base/getTeacherTimetable': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      'timeArrage|3': [
        {
          'cellKey|1': [
            '0,1',
            '0,3',
            '0,4',
            '0,5',
            '1,1',
            '1,2',
            '1,3',
            '1,4',
            '2,2',
            '3,5',
            '4,1'
          ],
          cellValue: '禁排'
        }
      ]
    }
  },
  // 教研组禁排 教研组treedata
  '/base/getTeachGroupTree': {
    SUCCESS: true,
    MSG: '成功获取数据',
    'DATA|2': [
      {
        id: '@inc(2)',
        'label|1': ['语文', '物理', '化学', '生物'],
        children: [
          {
            id: '1',
            label: '高一'
          },
          {
            id: '2',
            label: '高二'
          },
          {
            id: '3',
            label: '高三'
          }
        ]
      }
    ]
  },
  // 合班设置 根据年级获取班级信息
  '/base/getClasses': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      { id: '0011', text: 'G1701' },
      { id: '2222', text: 'G1702' },
      { id: '333', text: 'G1703' },
      { id: '444', text: 'G1704' }
    ]
  },
  // 合班设置 获取课程信息
  '/base/getCourse': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      { id: 'kc1', text: '体育' },
      { id: 'kc2', text: '美术' },
      { id: 'kc3', text: '通信技术' },
      { id: 'kc4', text: '音乐' }
    ]
  }
}
