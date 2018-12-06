export default {
  // 走班排课
  qryArrangeList: `/base/qryArrangeList`, // 排课查询列表
  qryArrangeDetail: `/base/qryArrangeDetail`, // 排课查询详情

  qrylayerList: `/base/qrylayerList`, // 学科分层查询列表
  qrylayerCourseName: `/base/qrylayerCourseName`, // 学科分层课程名称查询接口
  qrylayerInfo: `/base/qrylayerInfo`, // 学科分层详情查询接口
  qryZbClassroomList: `base/qryzbClassroomList`, // 走班排课列表查询接口
  qryZbClassroom: `/base/zbClassroom`, // 走班排课详情查询接口

  // 普通排课-》 教学计划
  qryTeachTask: `/base/qryTeachingTask`, // 教学任务详情
  qryClassList: `/base/qryClassList`, // 班级列表
  qryTeacherList: `/base/qryTeacherList`, // 班级列表

  // 普通排课-》 排课规则 -》固排禁排
  qryGradeClassTree: `/base/qryGradeClassTree`, // 年级/班级禁排固排 treeData
  getTeacherTree: `/base/getTeacherTree`, // 教师禁排固排 treeData
  getTeacherTeachTask: `/base/getTeacherTeachTask`, // 教师禁排固排 教学任务
  getTeacherTimetable: `/base/getTeacherTimetable`, // 教师禁排固排 教学任课表
  getTeachGroupTree: `/base/getTeachGroupTree`, // 教研组禁排

  // 普通排课-》 排课规则 -》合班设置
  getClasses: `/base/getClasses`, // 根据年级获取班级信息
  getCourse: `/base/getCourse`, // 获取课程信息

  // 选课平台 -》 选课列表（选学调研）
  qryXKDYList: `/base/qryXKDYList`, // 获取选课列表
  // 选课平台 -》 选课设置 -》 可选学科tab
  qryOptionalCourse: `/base/qryOptionalCourse`, //  数据
  qryAllCourse: `/base/qryAllCourse`, // 包含学科下拉列表数据

  // 选课平台 -》班次参选学生tab
  qryClassesOptions: `/base/qryClassesOptions`, // 班级下拉列表
  qryJoinedStudents: `/base/qryJoinedStudents`, // 参与学生信息
  // 选课平台 ->选课结果
  qrySingleSubjectAnalysis: `/base/qrySingleSubjectAnalysis`, //  单科分析
  qryAssembleSubjectAnalysis: `/base/qryAssembleSubjectAnalysis`, // 选课组合分析

  // 系统配置
  qryKeyList: `/base/qryKeyList`, // 数据字典表格数据
  qryCalendar: `/base/qryCalendar`, // 校历维护
  qryCoursePlain: `/base/qryCoursePlain`, // 课程计划

  // 模板下载
  teachTaskExcelTemplate: `/static/template/teachTask.xls`, // 普通排课任课表_排课班级.xls
  coursePlainExcelTemplate: `/static/template/coursePlain.xls` // 课程计划
}
