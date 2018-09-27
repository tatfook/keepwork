import _ from 'lodash'
const getters = {
  isShowLoginDialog: state => state.isShowLoginDialog,
  projectDetail: state => ({ projectId }) => _.get(state.projects, projectId),
  projectApplyList: state => ({ projectId }) => _.get(state.projectApplyList, projectId)
}

export default getters
