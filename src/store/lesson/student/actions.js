import { lesson } from '@/api'
import { props } from './mutations'

let {
  GET_PACKAGE_DETAIL_SUCCESS
} = props

const actions = {
  async getPackageDetail({ commit }, { packageId }) {
    let detail = await lesson.admin.packages({
      id: packageId
    })
    console.log(detail)
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  }
}

export default actions
