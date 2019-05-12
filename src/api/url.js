export default {
  /** 走班排课 */
  // 排课查询
  qryArrangeList: `/zxx/arrange/qryArrangeBaseInfoList`, // 排课查询列表
  delArrange: `/zxx/arrange/delArrangeById`, // 排课删除
  qryArrangeDetail: `/zxx/arrange/qryArrangeDetail`, // 排课查询详情

  // 教学计划
  saveArrange: `zxx/arrange/saveArrangeBaseInfo`, // 保存排课基础信息
  qrylayerList: `/zxx/layer/qryCourseLayerInfoList`, // 学科分层查询列表
  choseTaskRsId: `/zxx/chose/choseTaskRsId`, // 学科分层及课时-从选课任务导入接口
  saveCourseLayerListDisp: `/zxx/layer/saveCourseLayerListDisp`, // 学科分层列表保存顺序
  // qrylayerCourseName: `/zxx/layer/qryCourseNameListForArrange`, // 学科分层课程名称下拉列表查询接口
  qrylayerCourseName: `/zxx/layer/qryCourseNameListForGrade`, // 学科分层课程名称下拉列表查询接口
  savelayerInfo: `/zxx/layer/saveCourseLayerInfo`, // 学科分层详情保存接口
  dellayerInfo: `/zxx/layer/delCourseLayerById`, // 学科分层详情删除接口
  exportStuChoiceCourseExcel: `/zxx/layer/getStuChoiceCourseExcel`, // 学科分层 导出功能
  qryArrangeCourseLayerRela: `zxx/stuCourseLayer/qryArrangeCourseLayerRela`, // 导入学生选课 课程下拉列表数据
  qryStuChoiceInfoList: `zxx/stuCourseLayer/qryStuChoiceInfoList`, // 导入学生选课 列表数据
  delStuChoiceInfoList: `zxx/stuCourseLayer/delChoiceInfoById`, // 导入学生选课 列表数据删除
  qryArrangeClasses: `zxx/stuCourseLayer/qryArrangeClasses`, // 导入学生选课 行政班
  saveChooseCourseInfo: `zxx/stuCourseLayer/saveChoiceInfo`, // 导入学生选课 新增选课的保存
  updatechooseCourseInfo: `zxx/stuCourseLayer/updateChoiceInfo`, // 导入学生选课 修改选课的保存
  getChooseCourseInfo: `zxx/stuCourseLayer/qryStuCourseDetail`, // 导入学生选课 修改按钮，获取详细信息
  selectBatchStuScore: `zxx/stuCourseLayer/selectBatchStuScore`, // 查询学生成绩列表
  saveBatchStuScore: `zxx/stuCourseLayer/saveBatchStuScore`, // 保存学生成绩列表
  getSplitClassManage: `zxx/teach/qryTransLayer2ClassList`, // 教学分班管理-列表查询
  splitClasses: `/zxx/transLayer2Class`, // 教学分班管理 试分班
  saveTeachTask: `zxx/teach/saveTeachingTask`, // 教学分班管理 保存教学任务
  qryZbClassroomList: `zxx/teachingRoom/qryArrangeClassRoomList`, // 走班教室 列表查询接口
  saveArrangeClassRoom: `zxx/teachingRoom/saveArrangeClassRoom`, // 走班教室 新增保存
  delClassRoomById: `zxx/teachingRoom/delClassRoomById`, // 走班教室 删除
  qryZbClassroom: `zxx/teachingRoom/qryClassRoomDetail`, // 走班排课详情查询接口

  // 排课规则
  qryTeachingClassInfoDetails: `/zxx/coursePlan/qryTeachingClassInfoDetails`, // 学生分班tab 按选课结果将学生分班 表格列表
  saveTeaClassRelyStu: `/zxx/coursePlan/saveTeaClassRelyStu`, // 学生分班tab 按选课结果将学生分班 学生自动分到教学班
  qryTeachingClassList: `/zxx/coursePlan/qryTeachingClassList`, // 学生分班tab 按选课结果将学生分班 教学班下拉列表
  arrangeStuChange: `/zxx/coursePlan/arrangeStuChange`, // 学生分班tab 按选课结果将学生分班 调整分班

  qryArrangeGroupInfo: `/zxx/coursePlan/qryArrangeGroupInfo`, // 课时预排tab 预排课信息查询
  saveGroupArrInfo: `/zxx/coursePlan/saveTeaGroupArrInfo`, // 课时预排tab 预排课信息保存
  saveCoursePlanInfo: `/zxx/coursePlan/saveCoursePlanInfo`, // 课时预排tab  新增课时组
  qrySourceAssessment: `/zxx/computeResoure`, // 资源评估 运算走班排课资源按钮
  qryTeachGroupsTree: `/base/qryTeachGroupsTree`, // 教学分组

  // 课表查询
  teaTableInfoList: `/zxx/courseTable/teaTableInfoList`, // 教师课表
  qryCourseNameListForDiffeLayer: `/zxx/layer/qryCourseNameListForDiffeLayer`, // 课程名称
  qryCourseForInTeacher: `/zxx/courseTable/qryCourseForInTeacher`, // 教师名称
  stuTableInfoList: `/zxx/courseTable/stuTableInfoList`, // 学生课表

  /**  普通排课 */
  // 年级课程
  qrySegGradeTree: `/zxx/qrySegGradeTree`, // 学段专业年级查询树
  handleSeg: `/zxx/saveSeg`, // 学段/专业增删改
  saveSegGrade: `/zxx/saveSegGrade`, // 学段年级增删改
  qryCourseByGradeId: `/zxx/qryCourseByGradeId`, //  根据年级查询课程列表
  saveCourseList: `/zxx/saveCourseList`, //  保存课程列表
  // 年级班级
  qryClassesByGradeId: `/zxx/qryClassesByGradeId`, // 根据年级查询班级列表
  saveClassesList: `/zxx/saveClassesList`, // 保存班级列表
  // 排课任务
  qryTeachTask: `/base/qryTeachingTask`, // 教学任务详情
  qryClassList: `/base/qryClassList`, // 班级列表
  qryTeacherList: `/base/qryTeacherList`, // 班级列表
  // 授课任务-》授课录入
  qryCourseTaskList: `/zxx/qryCourseTaskList`, // 根据年级串获取班级授课列表
  saveCourseTaskList: `/zxx/saveCourseTaskList`, // 保存班级授课列表
  splitTask: `/zxx/splitTask`, // 分拆教学任务
  // 授课任务-》课程计划汇总表
  qryTeaCourseCount: `/zxx/qryTeaCourseCount`, // 课程计划汇总表
  // 开始排课
  arrangeCourse: `/zxx/arrangeCourse`, // 自动排课
  // 课表查询
  qryClassTimetable: `/zxx/qryClassTimetable0`, // 班级课表
  expCourse2Excel: `/zxx/expCourse2Excel`, // 班级课表-》导出excel
  qryTeaTimetable: `/zxx/qryTeaTimetable0`, // 教师/教室课表查询

  // 排课规则 -》固排禁排
  // 年级/班级禁排固排
  qryPreArrangeCell: `/zxx/qryPreArrangeCell`, // 查询或创建年级班级禁固排列表
  saveCommPreArrangeList: `/zxx/saveCommPreArrangeList`, // 保存年级班级禁固排列表
  qryCourseListByArrangeId: `/zxx/qryCourseListByArrangeId`, // 教师禁排固排 treeData
  qryTeaTaskListByTeaId: `/zxx/qryTeaTaskListByTeaId`, // 教师禁排固排 根据排课教师id查询教师授课列表
  getTeachGroupTree: `/zxx/qryOnlyCourseLByArrangeId`, // 教研组禁排 treeData

  // 排课规则 -》合班设置
  qryJoinClassL: `/zxx/qryJoinClassL`, // 查询合班信息
  saveSjsJoinClasses: `/zxx/saveSjsJoinClasses`, // 合班/解散
  /** 选课平台  */

  // 选课列表（选课任务）
  qryChoseCourseList: `/zxx/chose/qryChoseCourseList`, // 获取选课列表
  delChooseCourse: `/zxx/chose/dSjsChoseCourseDef`, // 获取选课列表 删除
  pubChoseTask: `/zxx/chose/pubChoseTask`, // 获取选课列表 发布

  // 选课设置 -》 基础信息
  qrySjsChoseTaskByChoseId: `/zxx/chose/qrySjsChoseTaskByChoseId`, // 查寻
  saveSjsChoseCourseDef: `/zxx/chose/doSjsChoseCourseDef`, // 保存

  // 选课设置 -》 可选学科tab
  qrySGKCourseList: `/zxx/chose/qrySGKCourseList`, // 选课模式查询
  saveSGKCourseList: `/zxx/chose/saveSGKCourseList`, // 选课模式查询保存
  qryGradeCourseList: '/zxx/chose/qryGradeCourseList', // 学科查询课程名称列表

  // 选课设置 -》参选学生tab
  qryClassesOptions: `/zxx/chose/qryDistinctClassList`, // 班级下拉列表
  qryJoinedStudents: `/zxx/chose/qryStuAttendList`, // 参与学生信息

  // 发布任务
  qryChoseStuSumList: `/zxx/chose/qryChoseStuSumList`, // 查询参选学生统计数量

  // 选课分析
  qrySingleSubjectAnalysis: `/zxx/chose/qryStuChoseResultInfo`, //  单科分析
  expQryStuAttendList: `/zxx/chose/expQryStuAttendList`, // 选课查询导出

  // 学生选课
  qryStuChooseCourseList: `/zxx/chose/qryStuChooseTaskList`, // 列表查询
  qryStuChooseTaskDef: `/zxx/chose/qryStuChooseTaskDef`, // 选课详情
  doStuChose: `/zxx/chose/doStuChose`, // 选课详情

  /* 课程计划 */
  uploadCoursePlain: `/zxx/uploadSeg`, // 上传模板

  /* 新高考排课 */
  // 教学计划-教学分班管理
  splitStu2AdminClass: `/zxx/split/splitStu2AdminClass`, // 教学分班设置排课详情接口
  saveMoveCourseList: `/zxx/split/saveMoveCourseList`, // 教学分班设置保存接口
  qrySplitClassesList: `/zxx/split/qrySplitClassesList`, // 教学分班设置查询接口
  qryMove2ClassList: `/zxx/split/qryMove2ClassList`, // 教学班教学设置-列表查询接口

  // 教学任务-教学任务报表
  qryTeaListByArrangeId: `/zxx/qryTeaListByArrangeId`, // 提取教师列表
  qryClassListByArrangeId: `/zxx/qryClassListByArrangeId`, // 提取班级列表

  /* 系统配置 */
  qryKeyList: `/base/qryKeyList`, // 数据字典表格数据
  qryCalendarByXnXq: `/zxx/calendar/qryCalendarInfoDetailByXnXq`, // 校历维护 详情
  qryCalendar: `/zxx/calendar/qryCalendarInfoDetail`, // 校历维护 详情
  saveCalendar: `/zxx/calendar/saveCalendarInfo`, // 校历维护 保存
  qryCoursePlain: `/zxx/calendar/qryCoursePlanList`, // 课程计划列表查询
  qryGrade: `/zxx/arrange/qrySegGradeInfo`, // 年级
  qrySegGrade: `/zxx/calendar/qrySegGradeRela`, // 级联年级

  /* 登录 */
  qryValidCode: `/zxx/visitor/picture/createValidateCode`, // 验证码
  userLogin: `/zxx/visitor/user/login`, // 登录
  logout: `/zxx/user/logout`, // 退出
  qrySjsSchoolList: `/zxx/qrySjsSchoolList`, // 学校列表

  // 用户基础信息
  qryBaseInfo: `/qry/qryBaseInfo`,
  initUserPwd: `/zxx/user/initUserPwd`, // 修改密码

  // 学校信息
  qrySchoolInfo: `/zxx/qrySjsSchoolById`, // 学校信息查询
  getDicList: `/zxx/getDicList`, // 学校类型查询
  saveSjsSchoolById: `/zxx/saveSjsSchoolById`, // 学校保存

  // 模板下载
  teachTaskExcelTemplate: `/static/template/teachTask.xls`, // 普通排课任课表_排课班级.xls
  coursePlainExcelTemplate: `/static/template/coursePlain.xls`, // 课程计划
  subjectLayerExcelTemplate: `/static/template/subjectLayer.xls`, // 走班排课-教学计划-学科分层及课时-走班学科课程分层定义
  chooseCourseExcelTemplate: `/static/template/chooseCourse.xls`, // 走班排课-教学计划-导入学生选课 分层教学学生选课结果
  joinedStudentExcelTemplate: `/static/template/joinedStudent.xls` // 选课平台-选课设置 - 参选学生tab
}
