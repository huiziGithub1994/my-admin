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

// 选课详情
export function qryStuChooseTaskDef(listQuery) {
  return request({
    url: URL.qryStuChooseTaskDef,
    params: listQuery
  })
}
// 选课提交
export function doStuChose(listQuery) {
  return request({
    url: URL.doStuChose,
    params: listQuery
  })
}
