import _ from 'lodash'

const getters = {
  studentPackageDetail: (state) => ({ packageId }) => _.get(state.packagesDetail, packageId)
}

export default getters
