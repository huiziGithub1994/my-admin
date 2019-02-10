import request from '@/utils/request'
import URL from '@/api/url'

// 禁排固排Tab页 教师禁排固排 查询或创建年级班级禁固排列表
export function qryPreArrangeCell(params) {
  return request({
    url: URL.qryPreArrangeCell,
    params
  })
}

// 禁排固排Tab页 教师禁排固排 保存年级班级禁固排列表
export function saveCommPreArrangeList(params) {
  return request({
    url: URL.saveCommPreArrangeList,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params
  })
}

// 禁排固排Tab页 教师禁排固排 treeData
export function qryCourseListByArrangeId(params) {
  return request({
    url: URL.qryCourseListByArrangeId,
    params
  })
}
// 禁排固排Tab页 教师禁排固排 根据排课教师id查询教师授课列表
export function qryTeaTaskListByTeaId(listQuery) {
  return request({
    url: URL.qryTeaTaskListByTeaId,
    params: listQuery
  })
}
// 禁排固排Tab页 教师禁排固排 教学任务课表
export function getTeacherTimetable(listQuery) {
  return request({
    url: URL.getTeacherTimetable,
    params: listQuery
  })
}
// 禁排固排Tab页 教研组禁排
export function getTeachGroupTreeData(listQuery) {
  return request({
    url: URL.getTeachGroupTree,
    params: listQuery
  })
}

// 合班设置Tab页 根据年级获取班级信息
export function getClasses(listQuery) {
  return request({
    url: URL.getClasses,
    params: listQuery
  })
}

// 合班设置Tab页 获取课程信息
export function getCourse(listQuery) {
  return request({
    url: URL.getCourse,
    params: listQuery
  })
}
