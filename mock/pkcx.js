module.exports = {
  // 排课查询 列表数据
  '/base/qryArrangeList': {
    SUCCESS: true,
    MSG: '成功获取数据',
    SUM: 10,
    'DATA|10': [
      {
        arrangeId: '@inc(10000)',
        schoolId: '001',
        arrangName: '2018-2019学年第一学期高中二年级走班排课',
        'name|1': ['完成', '冲突', '进行中'],
        schoolYear: '2018-2019',
        'termCode|1': ['第一学期', '第二学期'],
        'gradeCode|1': ['高二', '高一', '高三'],
        createTime: '2018-10-22 10:00'
      }
    ]
  },
  // 排课查询详情
  '/base/qryArrangeDetail': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      arrangeId: '001',
      schoolId: '001',
      arrangeName: '2018-2019学年第一学期高中二年级走班排课',
      schoolYear: '2018',
      termCode: '1',
      gradeCode: '0302',
      beginDate: '2018-09-01',
      endDate: '2019-02-01',
      workDays: 5,
      countInMorning: 0,
      countMorning: 4,
      countAfternoon: 4,
      countNight: 0,
      curStatus: 1,
      timeArrage: [
        {
          lessonsId: '29291jiei',
          arrangeId: '001',
          segId: '02',
          lessionsTime: [
            {
              lessionSeq: 1,
              beginTime: '08:20',
              endTime: '09:00'
            },
            {
              lessionSeq: 2,
              beginTime: '09:20',
              endTime: '10:00'
            }
          ]
        }
      ]
    }
  },
  // 学科分层及课时
  '/sbjestclass/list': {
    SUCCESS: true,
    MSG: '成功获取数据',
    SUM: 20,
    'DATA|20': [
      {
        id: '@inc(10000)',
        'courseName|1': ['物理', '化学', '生物'],
        'schoolYear|1': ['2017', '2018'],
        'courseType|1': ['学考A', '选考A'],
        'courseTime|1': [2, 4]
      }
    ]
  },
  // 学科分层及课时
  '/chooseclass/list': {
    SUCCESS: true,
    MSG: '成功获取数据',
    SUM: 20,
    'DATA|20': [
      {
        id: '@inc(10000)',
        grade: '高二',
        'classes|1': ['1班', '2班'],
        stuno: '20170002',
        stuname: '@cstr(3)',
        'wlxk|1': ['', '√'],
        'wlxuk|1': ['', '√'],
        'hxxuk|1': ['', '√'],
        'hxxk|1': ['', '√']
      }
    ]
  }
}
