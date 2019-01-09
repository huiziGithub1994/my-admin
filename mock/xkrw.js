module.exports = {
  // 选课平台 -》 选课列表（选学调研）
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
  },
  // 选课平台 -》 选课设置
  '/base/qryOptionalCourse': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      chooseModel: '1',
      course: [
        { key: '100', label: '技术' },
        { key: '101', label: '政治' },
        { key: '102', label: '历史' },
        { key: '103', label: '地理' },
        { key: '104', label: '物理' },
        { key: '105', label: '化学' }
      ],
      choosedIds: ['101', '102', '103', '104', '105']
    }
  },
  // 选课平台 -》班次参选学生tab  班级下拉列表
  '/base/qryClassesOptions': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        label: '1班',
        value: '1'
      },
      {
        label: '2班',
        value: '2'
      }
    ]
  },
  // 选课平台 -》班次参选学生tab 学生信息
  '/base/qryJoinedStudents': {
    SUCCESS: true,
    MSG: '成功获取数据',
    'DATA|6': [
      {
        xd: '高中',
        grade: '高一',
        className: Math.floor(Math.random() * 10) + '班',
        code: 'G' + Math.floor(Math.random() * 10000),
        name: '@str(2,4)',
        xh: '20170' + Math.floor(Math.random() * 10000),
        'sex|1': ['1', '2']
      }
    ]
  },
  // 选课结果 单科分析
  '/base/qrySingleSubjectAnalysis': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      taskName: '2018级高中一年级学生选考调查',
      grade: '01,01',
      analysis: {
        needNum: 323,
        truthNum: 323,
        noChoose: 0,
        allClasses: 8,
        completeClass: 8
      },
      tableData: [
        { name: '政治', value: 0 },
        { name: '历史', value: 56 },
        { name: '地理', value: 0 },
        { name: '物理', value: 163 },
        { name: '化学', value: 319 },
        { name: '生物', value: 147 }
      ]
    }
  },
  // 选课结果 选课组合分析
  '/base/qryAssembleSubjectAnalysis': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      taskName: '2018级高中一年级学生选考调查',
      grade: '01,01',
      analysis: {
        needNum: 323,
        truthNum: 323,
        noChoose: 0,
        allClasses: 8,
        completeClass: 8
      },
      tableData: [
        { name: '历史,地理，化学', value: 1 },
        { name: '历史,地理,生物', value: 2 },
        { name: '历史,物理,化学', value: 53 },
        { name: '地理,物理,化学', value: 122 },
        { name: '地理,物理,生物', value: 2 },
        { name: '地理,化学,生物', value: 36 },
        { name: '物理,化学,生物', value: 107 }
      ]
    }
  }
}
