import { login, logout } from '@/api/login'
import { getBaseInfo } from '@/api/base'
import { getCookie, removeCookie, setCookie } from '@/utils/auth'

const user = {
  state: {
    token: getCookie('Admin-Token'),
    name: '',
    avatar: '',
    roles: [],
    curYear: getCookie('curYear'),
    curTerm: getCookie('curTerm'),
    schoolId: getCookie('schoolId'),
    calenderId: getCookie('calenderId'),
    userType: getCookie('userType'),
    userName: getCookie('userName'),
    arrangeName: sessionStorage.getItem('arrangeName')
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
    SET_ARRANGENAME: (state, arrangeName) => {
      state.arrangeName = arrangeName
    },
    SET_USERTYPE: (state, userType) => {
      state.userType = userType
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
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
    LogOut({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            removeBaseInfo(commit, dispatch)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

function commitBaseInfo(commit, res) {
  const { curXq, curXn } = res.DATA
  const { schoolId, userType, userName } = res.DATA.userInfo
  commit('SET_SCHOOLID', schoolId)
  commit('SET_CURYEAR', curXn)
  commit('SET_CURTERM', curXq)
  commit('SET_USERTYPE', userType)
  commit('SET_USERNAME', userName)
  setCookie('schoolId', schoolId)
  setCookie('curYear', curXn)
  setCookie('curTureYear', curXn)
  setCookie('curTerm', curXq)
  setCookie('curTureTerm', curXq)
  setCookie('userType', userType)
  setCookie('userName', userName)
  if (userType === '2') {
    commit('SET_MENUTYPE', 'xk')
  } else {
    commit('SET_MENUTYPE', 'zb')
  }
}

function removeBaseInfo(commit, dispatch) {
  const commits = [
    'SET_TOKEN',
    'SET_SCHOOLID',
    'SET_CALENDERID',
    'SET_CURYEAR',
    'SET_CURTERM',
    'SET_ARRANGENAME',
    'SET_USERTYPE',
    'SET_USERNAME'
  ]
  commits.forEach(key => {
    commit(key, '')
  })
  dispatch('delAllViews')
  const removeCookies = [
    'Admin-Token',
    'schoolId',
    'calenderId',
    'curTerm',
    'curTureTerm',
    'curYear',
    'curTureYear',
    'userType',
    'menutype',
    'userName'
  ]
  removeCookies.forEach(key => {
    removeCookie(key)
  })
  const sessions = [
    'local_arrangeId',
    'local_curYear',
    'local_curTerm',
    'arrangeName'
  ]
  sessions.forEach(key => {
    sessionStorage.removeItem(key)
  })
}
export default user
