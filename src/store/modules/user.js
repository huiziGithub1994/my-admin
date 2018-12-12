import { login, logout, getInfo } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import { getToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    curYear: new Date().getFullYear(),
    curTerm: '1',
    schoolId: '',
    calenderId: ''
  },

  mutations: {
    SET_SCHOOLID: (state, schoolId) => {
      state.schoolId = schoolId
    },
    SET_CALENDERID: (state, calenderId) => {
      state.calenderId = calenderId
    },
    SET_CURYEAR: (state, curYear) => {
      state.curYear = curYear
    },
    SET_CURTERM: (state, curTerm) => {
      state.curTerm = curTerm
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            // const data = response.data
            // commit('SET_TOKEN', data.token)
            commit('SET_SCHOOLID', '001')
            commit('SET_CALENDERID', '00009')
            commit('SET_CURYEAR', 2018)
            commit('SET_CURTERM', '1')
            resolve(response.data)
          })
          .catch(error => {
            console.log(2, error)
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const data = response.data
            if (data.roles && data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', data.roles)
            } else {
              reject('getInfo: roles must be a non-null array !')
            }
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
