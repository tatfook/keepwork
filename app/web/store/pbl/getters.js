import _ from 'lodash'
const getters = {
  isShowLoginDialog: state => state.isShowLoginDialog,
  projectDetail: state => ({ projectId }) => _.get(state.projects, projectId),
  projectApplyList: state => ({ projectId }) => _.get(state.projectApplyList, projectId),
  projectMemberList: state => ({ projectId }) => _.get(state.memberList, projectId),
  userProjects: state => ({ userId }) => _.get(state.usersProjects, userId),
  projectFavoriteState: state => ({ projectId }) => _.get(state.projectsFavoriteState, projectId),
  projectStarState: state => ({ projectId }) => _.get(state.projectsStarState, projectId)
}

export default getters
