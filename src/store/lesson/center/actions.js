import { lesson } from '@/api'
import { props } from './mutations'

let {
  GET_PACKAGES_LIST
} = props

const actions = {
  async getPackagesList({ commit }, payload) {
    let packagesList = await lesson.packages.packagesList(payload)
    commit(GET_PACKAGES_LIST, packagesList)
  }
}

export default actions
