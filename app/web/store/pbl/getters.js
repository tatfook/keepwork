import _ from 'lodash'
const getters = {
  isShowLoginDialog: state => state.isShowLoginDialog,
  excellentProjects: state => state.excellentProjects,
  allProjects: state => state.allProjects,
  projectDetail: state => ({ projectId }) => _.get(state.projects, projectId),
  projectApplyList: state => ({ projectId }) => _.get(state.projectApplyList, projectId),
  projectMemberList: state => ({ projectId }) => _.get(state.memberList, projectId),
  userProjects: state => ({ userId }) => _.get(state.usersProjects, userId),
  projectFavoriteState: state => ({ projectId }) => _.get(state.projectsFavoriteState, projectId),
  projectStarState: state => ({ projectId }) => _.get(state.projectsStarState, projectId),
  myProjects: state => state.myProjects,
  myContributeProjects: state => state.myContributeProjects,
  projectApplyState: state => ({ projectId, userId }) => _.get(state.projectApplyState, `${userId}.${projectId}`),
  projectCommentList: state => ({ projectId }) => _.get(state.commentList, projectId),
  diffTypeProject: state => ({ type }) => _.get(state.projectsType, type),
  issuesList: state => ({ projectId }) => _.get(state.issuesList, projectId),
  allUsers: state => state.allUsers,
  userFollows: state => state.userFollows,
  gamesList: state => state.gamesList,
  gameWorks: state => state.gameWorks
}

export default getters
