import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import Qs from 'qs'
import { setToken } from '@/utils/auth'
// 创建axios实例
const axiosIns = axios.create()

// request拦截器
axiosIns.interceptors.request.use(
  config => {
    const isGetCode = config.url.indexOf('createValidateCode') !== -1
    if (store.getters.token && !isGetCode) {
      // config.headers.common['x_auth_token'] = store.getters.token
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
      setToken(token)
      store.commit('SET_TOKEN', token)
    }
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
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
    timeout: 5000, // 请求超时时间
    url: settings.url,
    method: settings.method ? settings.method : 'get'
  }

  if (defaultOption.method === 'post') {
    defaultOption.data = settings.params
    defaultOption.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    defaultOption.transformRequest = [
      function(data) {
        data = Qs.stringify(data)
        return data
      }
    ]
  } else {
    defaultOption.params = settings.params
  }

  return new Promise(function(resolve, reject) {
    axiosIns
      .request(defaultOption)
      .then(response => {
        resolve(response)
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
        resolve(error)
      })
  })
}
