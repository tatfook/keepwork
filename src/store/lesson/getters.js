import _ from 'lodash'

const getters = {
  packageDetail: (state) => ({ packageId }) => _.get(state.packagesDetail, packageId)
}

export default getters
