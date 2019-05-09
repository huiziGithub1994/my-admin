import request from '@/utils/request'
import URL from '@/api/url'

// 估算分班
export function splitStu2AdminClass(params) {
  return request({
    url: URL.splitStu2AdminClass,
    params
  })
}

// 保存并分班
export function saveMoveCourseList(params) {
  return request({
    url: URL.saveMoveCourseList,
    params
  })
}
