import request from '@/utils/request'
import URL from '@/api/url'

// 教学任务
export function getTeachTaskInfo(listQuery) {
  return request({
    url: URL.qryTeachTask,
    params: listQuery
  })
}
// 班级列表
export function getClassList(listQuery) {
  return request({
    url: URL.qryClassList,
    params: listQuery
  })
}
// 教师列表
export function getTeacherList(listQuery) {
  return request({
    url: URL.qryTeacherList,
    params: listQuery
  })
}
