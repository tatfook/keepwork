import _ from 'lodash'

const getters = {
  userinfo: state => state.userinfo,
  userId: (state, { userinfo }) => _.get(userinfo, 'id', ''),
  lockCoin: (state, { userinfo }) => _.get(userinfo, 'lockCoin', 0),
  packageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  subjects: state => state.subjects
}

export default getters
