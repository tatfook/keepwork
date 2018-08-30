import _ from 'lodash'

const getters = {
  userinfo: state => state.userinfo,
  isLogin: (state, { userId }) => !!userId,
  packageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  subjects: state => state.subjects
}

export default getters
