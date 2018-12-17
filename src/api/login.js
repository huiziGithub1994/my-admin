import request from '@/utils/request'
import URL from '@/api/url'

// 登录
export function login(params) {
  return request({
    url: URL.userLogin,
    method: 'post',
    params
  })
}

// 获取验证码
export function getValidCode() {
  return request({
    url: URL.qryValidCode
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(params) {
  return request({
    url: '/user/logout',
    method: 'post',
    params
  })
}
