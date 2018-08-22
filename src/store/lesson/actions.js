import _ from 'lodash'
import { lesson } from '@/api'
import { props } from './mutations'

let {
  GET_USER_INFO_SUCCESS,
  GET_USER_PACKAGES_SUCCESS,
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_ALL_SUBJECTS_SUCCESS
  // TO_BE_TEACHER
} = props

const actions = {
  async getUserDetail(context) {
    let { commit } = context
    let userLessonInfo = await lesson.users.getUserDetail()
    commit(GET_USER_INFO_SUCCESS, userLessonInfo)
  },
  async getPackageDetail(context, { packageId }) {
    let { commit } = context
    let detail = await lesson.packages.packageDetail({ packageId })
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  },
  async subscribePackage(context, { packageId }) {
    let subscribeResult = await lesson.packages.subscribe({ packageId })
    return subscribeResult
  },
  async setNickname(context, nickname) {
    const {
      dispatch,
      getters: { userId: id }
    } = context
    await lesson.users.setNickname({ nickname, id })
    await dispatch('getUserDetail')
  },
  async getUserPackages(context, { useCache = true }) {
    let { commit, getters: { userPackages } } = context
    if (userPackages && userPackages.length && useCache) {
      return
    }
    let packages = await lesson.packages.getUserPackages()
    let packageRows = _.get(packages, 'rows')
    commit(GET_USER_PACKAGES_SUCCESS, { userPackages: packageRows })
  },
  async getAllSubjects(context, { useCache = true }) {
    let { commit, getters: { subjects } } = context
    if (subjects && subjects.length && useCache) {
      return
    }
    let allSubjects = await lesson.subjects.getAllSubjects()
    commit(GET_ALL_SUBJECTS_SUCCESS, { subjects: allSubjects })
  }
}

export default actions
