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
        surveyId: null,
        gradeId: null,
        modifyDate: null,
        modifyId: null,
        weekHours: 5,
        courseLayerName: '选学D', //分层名称
        allName: '语文选学D', //课程名称加分层名称
        courseName: '语文', //课程名称
        layerId: '409e78e9ef6b4a5dbd81bd5d2d1fee12', //分层Id
        segCode: null,
        createId: '888888888888',
        schoolId: '88888888',
        dispSeq: 1,
        schoolYear: '2018', //学年
        arrangeId: '1bf28899499949b18e4ea236aad7b867', //走班Id
        courseId: 'aff04b5ce83148e9aa745f5a8efb5b05', //课程Id
        termCode: '1', //学期
        createDate: '2018-12-15T14:56:00.000+0000' //创建时间
      },
      {
        surveyId: null,
        gradeId: null,
        modifyDate: null,
        modifyId: null,
        weekHours: 5,
        courseLayerName: '选学B', //分层名称
        allName: '语文选学B', //课程名称加分层名称
        courseName: '语文', //课程名称
        layerId: '409e78e9ef6b4a5dbd81bd5d2d1fee12', //分层Id
        segCode: null,
        createId: '888888888888',
        schoolId: '88888888',
        dispSeq: 1,
        schoolYear: '2018', //学年
        arrangeId: '1bf28899499949b18e4ea236aad7b867', //走班Id
        courseId: 'aff04b5ce83148e9aa745f5a8efb5b05', //课程Id
        termCode: '1', //学期
        createDate: '2018-12-15T14:56:00.000+0000' //创建时间
      },
      {
        surveyId: null,
        gradeId: null,
        modifyDate: null,
        modifyId: null,
        weekHours: 5,
        courseLayerName: '选学A', //分层名称
        allName: '物理选学A', //课程名称加分层名称
        courseName: '物理', //课程名称
        layerId: '409e78e9ef6b4a5dbd81bd5d2d1fee12', //分层Id
        segCode: null,
        createId: '888888888888',
        schoolId: '88888888',
        dispSeq: 1,
        schoolYear: '2018', //学年
        arrangeId: '1bf28899499949b18e4ea236aad7b867', //走班Id
        courseId: 'aff04b5ce83148e9aa745f5a8efb5b06', //课程Id
        termCode: '1', //学期
        createDate: '2018-12-15T14:56:00.000+0000' //创建时间
      },
      {
        surveyId: null,
        gradeId: null,
        modifyDate: null,
        modifyId: null,
        weekHours: 5,
        courseLayerName: '选学D', //分层名称
        allName: '物理选学D', //课程名称加分层名称
        courseName: '物理', //课程名称
        layerId: '409e78e9ef6b4a5dbd81bd5d2d1fee12', //分层Id
        segCode: null,
        createId: '888888888888',
        schoolId: '88888888',
        dispSeq: 1,
        schoolYear: '2018', //学年
        arrangeId: '1bf28899499949b18e4ea236aad7b867', //走班Id
        courseId: 'aff04b5ce83148e9aa745f5a8efb5b06', //课程Id
        termCode: '1', //学期
        createDate: '2018-12-15T14:56:00.000+0000' //创建时间
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
        courseId: 'aff04b5ce83148e9aa745f5a8efb5b06',
        courseName: '物理'
      },
      {
        layerId: '10001',
        arrangeId: 'a001',
        courseId: 'aff04b5ce83148e9aa745f5a8efb5b05',
        courseName: '语文'
      }
    ]
  },
  // 学科分层保存接口
  'post /zxx/layer/saveCourseLayerInfo': {
    SUCCESS: true,
    MSG: '成功获取数据'
  },
  // 学科分层删除接口
  '/zxx/layer/delCourseLayerById': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: 1
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
