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
export function getOptionalSubject(listQuery) {
  return request({
    url: URL.qryOptionalCourse,
    params: listQuery
  })
}

// 选课设置-》可选学科tab  包含学科下拉列表数据
export function getAllCourse() {
  return request({
    url: URL.qryAllCourse
  })
}

// 选课设置-》班次参选学生tab  班级下拉列表
export function getClassesOptions(listQuery) {
  return request({
    url: URL.qryClassesOptions,
    params: listQuery
  })
}
// 选课设置-》班次参选学生tab 参与学生列表
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

// 选课结果-》选课组合分析tab
export function getAssembleSubjectAnalysis(listQuery) {
  return request({
    url: URL.qryAssembleSubjectAnalysis,
    params: listQuery
  })
}
