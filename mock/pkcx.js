module.exports = {
  // 排课查询 列表数据
  '/zxx/arrange/qryArrangeBaseInfoList': {
    SUCCESS: true,
    MSG: '成功获取数据',
    SUM: 10,
    'DATA|10': [
      {
        arrangeId: '@inc(10000)',
        schoolId: '001',
        arrangName: '2018-2019学年第一学期高中二年级走班排课',
        'curStatus|1': ['1', '2', '0'],
        schoolYear: '2018',
        'termCode|1': ['1', '2'],
        'gradeName|1': ['高二', '高一', '高三'],
        createTime: '2018-10-22 10:00'
      }
    ]
  },
  // 删除排课
  '/zxx/arrange/delArrangeById': {
    SUCCESS: true,
    DATA: '1'
  },
  // 排课查询详情
  '/zxx/arrange/qryArrangeDetail': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      arrangeId: '1bf28899499949b18e4ea236aad7b867',
      gradeId: '30204d2d5cf74331a638ae20dcc7727e',
      schoolId: '88888888',
      arrangeName: '2018-2019学年第一学期一年级走班排课',
      schoolYear: '2018',
      termCode: '1',
      gradeCode: '0203',
      beginDate: null,
      endDate: '2018-12-13T12:26:42.000+0000',
      workDays: null,
      countInMorning: null,
      countMorning: null,
      countAfternoon: null,
      countNight: null,
      arrangeType: null,
      createId: '888888888888',
      modifyDate: '2018-12-13T12:32:40.000+0000',
      modifyId: '888888888888',
      createDate: '2018-12-13T12:26:43.000+0000',
      calenderId: null,
      gradeName: '九年级'
    }
  },
  // 保存排课基础信息
  'post /zxx/arrange/saveArrangeBaseInfo': {
    SUCCESS: true,
    DATA: {
      arrangeId: '1bf28899499949b18e4ea236aad7b867'
    }
  },
  // 学科分层及课时
  '/zxx/layer/qryCourseLayerInfoList': {
    SUCCESS: true,
    MSG: '成功获取数据',
    SUM: 6,
    DATA: [
      {
        layerId: '10000',
        arrangeId: 'a001',
        courseId: 'w001',
        courseName: '物理',
        courseLayerName: '物理选考A',
        dispSeq: '1',
        weekHours: 2
      },
      {
        layerId: '10001',
        arrangeId: 'a001',
        courseId: 'w001',
        courseName: '物理',
        courseLayerName: '物理选考B',
        dispSeq: '2',
        weekHours: 2
      },
      {
        layerId: '10003',
        arrangeId: 'a001',
        courseId: 'w002',
        courseName: '化学',
        courseLayerName: '化学选考A',
        dispSeq: '1',
        weekHours: 2
      },
      {
        layerId: '10004',
        arrangeId: 'a001',
        courseId: 'w002',
        courseName: '化学',
        courseLayerName: '化学选考B',
        dispSeq: '2',
        weekHours: 2
      }
    ]
  },
  // 学科分层课程名称查询接口
  '/base/qrylayerCourseName': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        layerId: '10000',
        arrangeId: 'a001',
        courseId: 'w001',
        courseName: '物理'
      },
      {
        layerId: '10001',
        arrangeId: 'a001',
        courseId: 'w002',
        courseName: '化学'
      }
    ]
  },
  // 学科分层详情查询接口
  'post /base/qrylayerInfo': {
    SUCCESS: true,
    MSG: '成功获取数据'
  },
  '/base/qrylayerInfo': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      layerId: '3993494',
      arrangeId: '001',
      courseId: '100',
      courseName: '物理',
      courseLayerName: '物理选考B',
      dispSeq: 2,
      sumWeekClass: 4
    }
  },
  // 倒入学生选课
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
        'sex|1': ['男', '女'],
        courses: [
          '化学1选考、',
          '政治1选考、',
          '数学1选考、',
          '物理1选考、',
          '生物1选考、',
          '英语1选考、',
          '语文1选考、'
        ]
      }
    ]
  },
  // 教学分班管理
  '/splitClassManage/list': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        id: '001',
        courseLayerId: '001',
        courseLayer: '物理学考A',
        studentNum: '65',
        classesNum: '2',
        classNames: ['物理学考A1班', '物理学考A2班'],
        expectNum: '32',
        teachers: [{ name: '王玲' }, { name: '张亮' }],
        classTime: '2'
      },
      {
        id: '002',
        courseLayerId: '001',
        courseLayer: '物理学考A',
        studentNum: '65',
        classesNum: '2',
        classNames: ['物理选考A1班', '物理选考A2班', '物理选考A3班'],
        expectNum: '33',
        teachers: [{ name: '白宇' }, { name: '姜宇' }, { name: '张丽' }],
        classTime: '2'
      }
    ]
  },
  // 走班教室排课列表查询
  '/base/qryzbClassroomList': {
    SUCCESS: true,
    MSG: '成功获取数据',
    'DATA|5': [
      {
        id: '@inc(10000)',
        zbClassroomId: '@inc(10)',
        building: '综合教学楼',
        room: '高二1班',
        number: '7',
        courses:
          '化学1选考、政治1选考、数学1选考、物理1选考、生物1选考、英语1选考、语文1选考'
      }
    ]
  },
  // 走班排课详情查询
  '/base/zbClassroom': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      id: '2323',
      zbClassroomId: '22',
      building: '综合教学楼',
      room: '高二1班',
      number: '7',
      courses: ['10000', '10001']
    }
  }
}
