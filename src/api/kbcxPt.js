import request from '@/utils/request'
import URL from '@/api/url'

// 班级课表
export function qryClassTimetable(params) {
  return request({
    url: URL.qryClassTimetable,
    params
  })
}
// 班级课表 导出excel
export function expCourse2Excel(params) {
  return request({
    url: URL.expCourse2Excel,
    responseType: 'blob',
    params
  })
}
// 教师/教室课表
export function qryTeaTimetable(params) {
  return request({
    url: URL.qryTeaTimetable,
    params
  })
}
