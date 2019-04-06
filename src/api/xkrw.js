// 选课平台
import request from '@/utils/request'
import URL from '@/api/url'

// 选课列表
export function qryChoseCourseList(listQuery) {
  return request({
    url: URL.qryChoseCourseList,
    params: listQuery
  })
}
// 选课列表
export function pubChoseTask(listQuery) {
  return request({
    url: URL.pubChoseTask,
    params: listQuery
  })
}
// 选课列表 删除
export function delChooseCourse(listQuery) {
  return request({
    url: URL.delChooseCourse,
    params: listQuery
  })
}

// 选课设置 - 基础信息
export function qrySjsChoseTaskByChoseId(params) {
  return request({
    url: URL.qrySjsChoseTaskByChoseId,
    params
  })
}

// 选课设置 - 基础信息保存
export function saveSjsChoseCourseDef(params) {
  return request({
    url: URL.saveSjsChoseCourseDef,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params
  })
}

// 选课设置-》可选学科tab  表单信息
export function qrySGKCourseList(listQuery) {
  return request({
    url: URL.qrySGKCourseList,
    params: listQuery
  })
}
// 选课设置-》可选学科tab  学科查询课程名称列表
export function qryGradeCourseList(listQuery) {
  return request({
    url: URL.qryGradeCourseList,
    params: listQuery
  })
}

// 选课设置-》可选学科tab  保存
export function saveSGKCourseList(params) {
  return request({
    url: URL.saveSGKCourseList,
    params
  })
}

// 选课设置-》参选学生tab  班级下拉列表
export function getClassesOptions(listQuery) {
  return request({
    url: URL.qryClassesOptions,
    params: listQuery
  })
}
// 选课设置-》参选学生tab 参与学生列表
export function getJoinedStudents(listQuery) {
  return request({
    url: URL.qryJoinedStudents,
    params: listQuery
  })
}

// 选课结果-》单科分析tab
export function getSingleSubjectAnalysis(listQuery) {
  return request({
    url: URL.qrySingleSubjectAnalysis,
    params: listQuery
  })
}
