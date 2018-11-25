import request from '@/utils/request'
import URL from '@/api/url'

// 数据字典列表
export function getKeyList(listQuery) {
  return request({
    url: URL.qryKeyList,
    params: listQuery
  })
}

// 校历维护
export function qryCalendar(listQuery) {
  return request({
    url: URL.qryCalendar,
    params: listQuery
  })
}
