import request from '@/utils/request'
import URL from '@/api/url'

export function teaTableInfoList(params) {
  return request({
    url: URL.teaTableInfoList,
    params
  })
}
