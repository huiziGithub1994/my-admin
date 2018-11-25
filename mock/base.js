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
      timeArrage: [{ beginTime: '8:20', endTime: '9:00', lessionSeq: '第1节', c3: '升旗', c4: '', c5: '', c6: '', c7: '' }]
    }
  }
}
