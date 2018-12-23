import request from '@/utils/request'
import URL from '@/api/url'

// 禁排固排Tab页 年级/班级禁排固排 treeData
export function getGradeClassTreeData(listQuery) {
  return request({
    url: URL.qryGradeClassTree,
    params: listQuery
  })
}

// 禁排固排Tab页 教师禁排固排 treeData
export function getTeacherTreeData(listQuery) {
  return request({
    url: URL.getTeacherTree,
    params: listQuery
  })
}
// 禁排固排Tab页 教师禁排固排 教学任务
export function getTeacherTeachTask(listQuery) {
  return request({
    url: URL.getTeacherTeachTask,
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
