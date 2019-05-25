import request from '@/utils/request'
import URL from '@/api/url'

// 班级课表
export function qryAllClassTimetable(params) {
  return request({
    url: URL.qryAllClassTimetable,
    params
  })
}
