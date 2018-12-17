import { login, logout } from '@/api/login'
import { getBaseInfo } from '@/api/base'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import { getToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    curYear: new Date().getFullYear(),
    curTerm: '',
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
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            if (res.SUCCESS) {
              commitBaseInfo(commit, res)
            }
            resolve(res)
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
        getBaseInfo()
          .then(res => {
            if (res.SUCCESS) {
              commitBaseInfo(commit, res)
            }
            resolve(res)
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

function commitBaseInfo(commit, res) {
  const { curXq, calendarId, curXn } = res.DATA
  const { schoolId } = res.DATA.userInfo
  commit('SET_SCHOOLID', schoolId)
  commit('SET_CALENDERID', calendarId)
  commit('SET_CURYEAR', curXn)
  commit('SET_CURTERM', curXq)
}
export default user
