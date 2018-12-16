import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import Qs from 'qs'
// import { getToken } from '@/utils/auth'
// 创建axios实例
const axiosIns = axios.create()

// request拦截器
axiosIns.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
axiosIns.interceptors.response.use(
  response => {
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
