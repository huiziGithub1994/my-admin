import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import router from '../router'
import Qs from 'qs'
import { setCookie } from '@/utils/auth'
// 创建axios实例
const axiosIns = axios.create()

// request拦截器
axiosIns.interceptors.request.use(
  config => {
    const isGetCode = config.url.indexOf('createValidateCode') !== -1
    if (store.getters.token && !isGetCode) {
      config.headers.common['x_auth_token'] = store.getters.token
    }
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
axiosIns.interceptors.response.use(
  response => {
    const token = response.headers['x_auth_token']
    const isGetCode = response.config.url.indexOf('createValidateCode') !== -1
    if (response.data.SUCCESS && token && isGetCode) {
      setCookie('Admin-Token', token)
      store.commit('SET_TOKEN', token)
    }
    return response.data
  },
  error => {
    console.log('interceptors.response-err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default function service(settings) {
  const defaultOption = {
    baseURL: process.env.BASE_API, // api 的 base_url
    timeout: 8000, // 请求超时时间
    method: 'get',
    ...settings
  }
  if (defaultOption.method === 'post') {
    defaultOption.data = settings.params
    Reflect.deleteProperty(defaultOption, 'params')
    if (!defaultOption.headers) {
      defaultOption.headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
      defaultOption.transformRequest = [
        function(data) {
          data = Qs.stringify(data)
          return data
        }
      ]
    }
  }

  return new Promise(function(resolve, reject) {
    axiosIns
      .request(defaultOption)
      .then(res => {
        if (res.SUCCESS) {
          resolve(res)
        } else {
          if (defaultOption.responseType === 'blob') {
            resolve(res)
          } else {
            Message({
              message: res.MSG || res.DATA || '请求处理异常,请稍后再试',
              type: 'error'
            })

            if (res.type === 'invalidSession') {
              router.push({ path: '/login' })
            }
            reject(res)
          }
        }
      })
      .catch(error => {
        //  1.判断请求超时
        if (
          error.code === 'ECONNABORTED' &&
          error.message.indexOf('timeout') !== -1
        ) {
          Message({
            message: '请求超时，请稍后再试！',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
  })
}
