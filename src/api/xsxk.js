// 学生选课
import request from '@/utils/request'
import URL from '@/api/url'

// 选课列表
export function qryStuChooseCourseList(listQuery) {
  return request({
    url: URL.qryStuChooseCourseList,
    params: listQuery
  })
}
