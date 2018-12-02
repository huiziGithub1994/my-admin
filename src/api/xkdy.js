// 选课调研
import request from '@/utils/request'
import URL from '@/api/url'

// 选课列表
export function getXKDYListInfo(listQuery) {
  return request({
    url: URL.qryXKDYList,
    params: listQuery
  })
}
