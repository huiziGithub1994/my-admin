module.exports = {
  // 基础信息
  '/qry/qryBaseInfo': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      curXq: '1',
      userInfo: {
        userId: '888888888888',
        schoolId: '88888888',
        dicId: null,
        loginCode: 'rjadmin',
        loginPwd: '{SHA}fEqNCco3Yq9h5ZUglD3CZJT4lBs=',
        userName: '欧阳',
        phone: '15974297422',
        auditFlag: '1',
        createDate: '2018-11-25T13:10:00.000+0000',
        createId: '88888888',
        modifyDate: null,
        modifyId: null,
        userType: '3'
      },
      calendarId: '0ecf4968a378406eb8ad33e498ec3fda',
      curXn: '2018'
    }
  },
  // 年级信息
  '/zxx/arrange/qrySegGradeInfo': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        gradeId: '07850b89a949a8a9977a435040e20d',
        segId: '0e6b42748a9a2bd95548c250975da4',
        gradeName: '一年级',
        schoolId: '88888888',
        schoolYear: '2018',
        termCode: '1',
        createId: '001',
        createDate: null,
        modifyDate: null,
        modifyId: null
      },
      {
        gradeId: '30204d2d5cf74331a638ae20dcc7727e',
        segId: '5bfbb331ad7b3825d81576a6c93772',
        gradeName: '九年级',
        schoolId: '88888888',
        schoolYear: '2018',
        termCode: '1',
        createId: '001',
        createDate: null,
        modifyDate: null,
        modifyId: null
      }
    ]
  },
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
  // 校历维护 查询接口
  '/zxx/calendar/qryCalendarInfoDetail': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      schoolId: '001',
      arrangeName: '2018-2019学年第一学期高中二年级走班排课',
      calenderId: '0ecf4968a378406eb8ad33e498ec3fda',
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
      calFixList: [
        {
          rsId: 'wi29349',
          calenderId: '0ecf4968a378406eb8ad33e498ec3fda',
          segId: '02', // 早晨：01;上午：02;下午：03;晚上：04
          lessionSeq: 1,
          beginTime: '08:20',
          endTime: '09:00',
          cellKey: '0,0', // 第一节为第0行，星期一为第0列，依次类推
          cellValue: '升旗'
        },
        {
          rsId: '39kke93',
          calenderId: '0ecf4968a378406eb8ad33e498ec3fda',
          segId: '03', // 早晨：01;上午：02;下午：03;晚上：04
          lessionSeq: 7,
          beginTime: '16:20',
          endTime: '17:00',
          cellKey: '6,2',
          cellValue: '校本课'
        },
        {
          rsId: '39kke93',
          calenderId: '0ecf4968a378406eb8ad33e498ec3fda',
          segId: '03', // 早晨：01;上午：02;下午：03;晚上：04
          lessionSeq: 7,
          beginTime: '16:20',
          endTime: '17:00',
          cellKey: '6,3',
          cellValue: '自习'
        },
        {
          rsId: '39kke93',
          calenderId: '0ecf4968a378406eb8ad33e498ec3fda',
          segId: '03', // 早晨：01;上午：02;下午：03;晚上：04
          lessionSeq: 7,
          beginTime: '16:20',
          endTime: '17:00',
          cellKey: '6,4',
          cellValue: '班会'
        }
      ]
    }
  },
  // 校历维护 保存接口
  'post /zxx/calendar/saveCalendarInfo': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      calenderId: '00001'
    }
  },
  // 课程计划
  '/base/qryCoursePlain': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        periodSepciality: '高中',
        grade: '高一',
        'course|1': ['语文', '生物'],
        weekTime: Math.floor(Math.random() * 10),
        teachStyle: '理论'
      },
      {
        periodSepciality: '',
        grade: '',
        'course|1': ['数学', '地理', '历史'],
        weekTime: Math.floor(Math.random() * 10),
        teachStyle: '理论'
      },
      {
        periodSepciality: '',
        grade: '',
        'course|1': ['英语', '化学', '政治'],
        weekTime: Math.floor(Math.random() * 10),
        teachStyle: '理论'
      }
    ]
  },
  'post /base/qryCoursePlain': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        periodSepciality: '高中',
        grade: '高一',
        'course|1': ['语文', '生物'],
        weekTime: Math.floor(Math.random() * 10),
        teachStyle: '理论'
      },
      {
        periodSepciality: '',
        grade: '',
        'course|1': ['数学', '地理', '历史'],
        weekTime: Math.floor(Math.random() * 10),
        teachStyle: '理论'
      },
      {
        periodSepciality: '',
        grade: '',
        'course|1': ['英语', '化学', '政治'],
        weekTime: Math.floor(Math.random() * 10),
        teachStyle: '理论'
      }
    ]
  }
}
