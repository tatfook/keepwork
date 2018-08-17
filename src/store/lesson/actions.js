import { lesson } from '@/api'
import { props } from './mutations'

let {
  GET_USER_INFO_SUCCESS,
  GET_PACKAGE_DETAIL_SUCCESS
} = props

const actions = {
  async getUserDetail(context) {
    let { commit, rootGetters: { 'user/authRequestConfig': authRequestConfig } } = context
    let userLessonInfo = await lesson.users.getUserDetail(null, authRequestConfig)
    commit(GET_USER_INFO_SUCCESS, userLessonInfo)
  },
  async getPackageDetail({ commit }, { packageId }) {
    let detail = await lesson.packages.packageDetail({
      id: packageId
    })
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  },
  async subscribePackage({ context }, { packageId }) {
    let subscribeResult = await lesson.packages.subscribe({
      id: packageId
    })
    return subscribeResult
  }
}

export default actions
