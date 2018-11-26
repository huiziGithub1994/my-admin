module.exports = {
  // 数据字典表格数据
  'post /base/qryKeyList': {
    SUCCESS: true,
    MSG: '成功获取数据'
  },
  '/base/qryKeyList': {
    SUCCESS: true,
    MSG: '成功获取数据',
    SUM: 10,
    'DATA|10': [
      {
        dicId: '@inc(10000)',
        dicCode: '@inc(0)',
        dicName: '@cstr(3)',
        dispOrder: '@inc(0)',
        dicKey: '@str(5)',
        dicDesc: '@cparagraph',
        createName: '@cstr(3)',
        strCreateTime: '2011-03-09 07:18:39'
      }
    ]
  },
  '/base/qryCalendar': {
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
        [
          {
            lessonsId: '29291jiei', // 唯一标识
            arrangeId: '002', // 校历唯一标识
            segId: '02', // 早晨：01;上午：02;下午：03;晚上：04
            lessionSeq: 1,
            beginTime: '08:20',
            endTime: '09:00',
            cellKey: '0,0', // 第一行，第一列，从0行，0列开始算
            cellValue: '08:20-09:00'
          },
          {
            lessonsId: 'wi29349',
            arrangeId: '002',
            segId: '02', // 早晨：01;上午：02;下午：03;晚上：04
            lessionSeq: 2,
            beginTime: '09:20',
            endTime: '10:00',
            cellKey: '1,2',
            cellValue: '第2节'
          },
          {
            lessonsId: '39kke93',
            arrangeId: '002',
            segId: '03', // 早晨：01;上午：02;下午：03;晚上：04
            lessionSeq: 3,
            beginTime: '13:20',
            endTime: '14:00',
            cellKey: '5,6',
            cellValue: '班会'
          }
        ]
      ]
    }
  }
}
