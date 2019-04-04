import request from '@/utils/request'
import URL from '@/api/url'

// 班级课表
export function qryClassTimetable(params) {
  return request({
    url: URL.qryClassTimetable,
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
