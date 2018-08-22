import _ from 'lodash'

const getters = {
  userinfo: state => state.userinfo,
  userId: (state, { userinfo }) => _.get(userinfo, 'id', ''),
  packageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId)
}

export default getters
