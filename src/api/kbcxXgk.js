import request from '@/utils/request'
import URL from '@/api/url'

// 班级课表
export function qryAllClassTimetable(params) {
  return request({
    url: URL.qryAllClassTimetable,
    params
  })
}

export function qryClassTimetableXgk(params) {
  return request({
    url: URL.qryClassTimetableXgk,
    params
  })
}

// 查询单个教师、学生课表
export function qryOneStuTeaTimetable(params) {
  return request({
    url: URL.qryOneStuTeaTimetable,
    params
  })
}
