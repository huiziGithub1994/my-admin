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
      calFixList: [
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
  '/base/qrylayerList': {
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
        sumWeekClass: 2
      },
      {
        layerId: '10001',
        arrangeId: 'a001',
        courseId: 'w001',
        courseName: '物理',
        courseLayerName: '物理选考B',
        dispSeq: '2',
        sumWeekClass: 2
      },
      {
        layerId: '10003',
        arrangeId: 'a001',
        courseId: 'w002',
        courseName: '化学',
        courseLayerName: '化学选考A',
        dispSeq: '1',
        sumWeekClass: 2
      },
      {
        layerId: '10004',
        arrangeId: 'a001',
        courseId: 'w002',
        courseName: '化学',
        courseLayerName: '化学选考B',
        dispSeq: '2',
        sumWeekClass: 2
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
