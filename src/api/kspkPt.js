// 普通排课 -》 开始排课
import request from '@/utils/request'
import URL from '@/api/url'

// 自动排课
export function startAutoArrange(params) {
  return request({
    url: URL.arrangeCourse,
    params
  })
}
