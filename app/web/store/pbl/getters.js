import _ from 'lodash'
const getters = {
  isShowLoginDialog: state => state.isShowLoginDialog,
  projectDetail: state => ({ projectId }) => _.get(state.projects, projectId)
}

export default getters
