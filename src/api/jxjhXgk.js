import request from '@/utils/request'
import URL from '@/api/url'

export function splitStu2AdminClass(params) {
  return request({
    url: URL.splitStu2AdminClass,
    method: 'post',
    params
  })
}
