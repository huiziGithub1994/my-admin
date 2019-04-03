import request from '@/utils/request'
import URL from '@/api/url'

// 班级课表
export function qryClassTimetable(params) {
  return request({
    url: URL.qryClassTimetable,
    params
  })
}
