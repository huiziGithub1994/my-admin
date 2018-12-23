export default {
  /** 走班排课 */
  // 排课查询
  qryArrangeList: `/zxx/arrange/qryArrangeBaseInfoList`, // 排课查询列表
  delArrange: `/zxx/arrange/delArrangeById`, // 排课删除
  qryArrangeDetail: `/zxx/arrange/qryArrangeDetail`, // 排课查询详情

  // 教学计划
  saveArrange: `zxx/arrange/saveArrangeBaseInfo`, // 保存排课基础信息
  qrylayerList: `/zxx/layer/qryCourseLayerInfoList`, // 学科分层查询列表
  qrylayerCourseName: `/zxx/layer/qryCourseNameListForArrange`, // 学科分层课程名称下拉列表查询接口
  savelayerInfo: `/zxx/layer/saveCourseLayerInfo`, // 学科分层详情保存接口
  dellayerInfo: `/zxx/layer/delCourseLayerById`, // 学科分层详情删除接口
  splitClasses: `/zxx/transLayer2Class`, // 导入学生选课 试分班
  exportChooseCourse: `/zxx/layer/getStuChoiceCourseExcel`, // 导入学生选课 导出功能
  qryZbClassroomList: `base/qryzbClassroomList`, // 走班排课列表查询接口
  qryZbClassroom: `/base/zbClassroom`, // 走班排课详情查询接口

  // 排课规则
  qrySourceAssessment: `/base/qrySourceAssessment`, // 资源评估
  qryTeachGroupsTree: `/base/qryTeachGroupsTree`, // 教学分组
  qryTeachHoursTree: `/base/qryTeachHoursTree`, // 课时预排 treedata

  /**  普通排课 */
  // 教学计划
  qryTeachTask: `/base/qryTeachingTask`, // 教学任务详情
  qryClassList: `/base/qryClassList`, // 班级列表
  qryTeacherList: `/base/qryTeacherList`, // 班级列表

  // 排课规则 -》固排禁排
  qryGradeClassTree: `/base/qryGradeClassTree`, // 年级/班级禁排固排 treeData
  getTeacherTree: `/base/getTeacherTree`, // 教师禁排固排 treeData
  getTeacherTeachTask: `/base/getTeacherTeachTask`, // 教师禁排固排 教学任务
  getTeacherTimetable: `/base/getTeacherTimetable`, // 教师禁排固排 教学任课表
  getTeachGroupTree: `/base/getTeachGroupTree`, // 教研组禁排

  // 排课规则 -》合班设置
  getClasses: `/base/getClasses`, // 根据年级获取班级信息
  getCourse: `/base/getCourse`, // 获取课程信息

  /** 选课平台  */

  // 选课列表（选学调研）
  qryXKDYList: `/base/qryXKDYList`, // 获取选课列表

  // 选课设置 -》 基础信息
  chooseCourseBaseInfo: `/base/toChooseTaskInfo`,

  // 选课设置 -》 可选学科tab
  qryOptionalCourse: `/base/qryOptionalCourse`, //  数据
  qryAllCourse: `/base/qryAllCourse`, // 包含学科下拉列表数据

  // 班次参选学生tab
  qryClassesOptions: `/base/qryClassesOptions`, // 班级下拉列表
  qryJoinedStudents: `/base/qryJoinedStudents`, // 参与学生信息
  // 选课结果
  qrySingleSubjectAnalysis: `/base/qrySingleSubjectAnalysis`, //  单科分析
  qryAssembleSubjectAnalysis: `/base/qryAssembleSubjectAnalysis`, // 选课组合分析

  /* 课程计划 */
  uploadCoursePlain: `/zxx/uploadSeg`, // 上传模板

  /* 系统配置 */
  qryKeyList: `/base/qryKeyList`, // 数据字典表格数据
  qryCalendar: `/zxx/calendar/qryCalendarInfoDetail`, // 校历维护 详情
  saveCalendar: `/zxx/calendar/saveCalendarInfo`, // 校历维护 保存
  qryCoursePlain: `/base/qryCoursePlain`, // 课程计划
  qryGrade: `/zxx/arrange/qrySegGradeInfo`, // 年级

  /* 登录 */
  qryValidCode: `/zxx/visitor/picture/createValidateCode`, // 验证码
  userLogin: `/zxx/visitor/user/login`, // 登录
  logout: `/zxx/user/logout`, // 退出

  // 用户基础信息
  qryBaseInfo: `/qry/qryBaseInfo`,

  // 模板下载
  teachTaskExcelTemplate: `/static/template/teachTask.xls`, // 普通排课任课表_排课班级.xls
  coursePlainExcelTemplate: `/static/template/coursePlain.xls`, // 课程计划
  subjectLayerExcelTemplate: `/static/template/subjectLayer.xls`, // 走班排课-教学计划-学科分层及课时-走班学科课程分层定义
  chooseCourseExcelTemplate: `/static/template/chooseCourse.xls` // 走班排课-教学计划-导入学生选课 分层教学学生选课结果
}
