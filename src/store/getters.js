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
  curTerm: state => state.user.curTerm,
  schoolId: state => state.user.schoolId,
  calenderId: state => state.user.calenderId
}
export default getters
