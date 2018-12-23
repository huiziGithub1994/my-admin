// 选课平台
import request from '@/utils/request'
import URL from '@/api/url'

// 选课设置 - 基础信息
export function getChooseCourseBaseInfo(surveyId) {
  return request({
    url: URL.chooseCourseBaseInfo,
    params: { surveyId }
  })
}

// 选课列表
export function getXKDYListInfo(listQuery) {
  return request({
    url: URL.qryXKDYList,
    params: listQuery
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
