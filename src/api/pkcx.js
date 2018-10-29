import request from '@/utils/request'

export function getListInfo(listQuery) {
  return request({
    url: '/pkcx/list',
    method: 'get',
    parems: listQuery
  })
}
