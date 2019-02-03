import request from '@/utils/request'
import URL from '@/api/url'

// 根据年级串获取班级授课列表
export function qryCourseTaskList(listQuery) {
  return request({
    url: URL.qryCourseTaskList,
    params: listQuery
  })
}

// 保存班级授课列表
export function saveCourseTaskList(params) {
  return request({
    url: URL.saveCourseTaskList,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params
  })
}
