import store from './index'
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  menutype: state => state.app.menutype,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  curYear: state => state.user.curYear,
  curTerm: state => {
    const { curTerm } = state.user
    return curTerm
  },
  schoolId: state => {
    const { schoolId } = state.user
    return schoolId
  },
  calenderId: state => {
    const { calenderId } = state.user
    if (calenderId === '') {
      store.dispatch('GetInfo')
    } else {
      return calenderId
    }
  }
}
export default getters
