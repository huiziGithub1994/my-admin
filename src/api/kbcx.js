import request from '@/utils/request'
import URL from '@/api/url'

// 老师课表
export function teaTableInfoList(params) {
  return request({
    url: URL.teaTableInfoList,
    params
  })
}

// 课程名称
export function qryCourseNameListForDiffeLayer(params) {
  return request({
    url: URL.qryCourseNameListForDiffeLayer,
    params
  })
}
// 教师名称
export function qryCourseForInTeacher(params) {
  return request({
    url: URL.qryCourseForInTeacher,
    params
  })
}
