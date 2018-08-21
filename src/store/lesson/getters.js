import _ from 'lodash'

const getters = {
  userinfo: (state) => state.userinfo,
  packageDetail: (state) => ({ packageId }) => _.get(state.packagesDetail, packageId)
}

export default getters
