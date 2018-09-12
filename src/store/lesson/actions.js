import { lesson } from '@/api'
import { props } from './mutations'

let {
  GET_USER_INFO_SUCCESS,
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_DETAIL_SUCCESS,
  GET_ALL_SKILLS_SUCCESS,
  GET_ALL_SUBJECTS_SUCCESS,
  LOGOUT,
  TOGGLE_LOGIN_DIALOG
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
  async getLessonDetail(context, { lessonId }) {
    let { commit } = context
    let detail = await lesson.lessons.lessonDetail({ lessonId })
    commit(GET_LESSON_DETAIL_SUCCESS, { detail })
  },
  async subscribePackage(context, { packageId }) {
    let { dispatch } = context
    let subscribeResult = await lesson.packages.subscribe({ packageId })
    await dispatch('getPackageDetail', { packageId })
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
  async getAllSkills(context, { useCache = true }) {
    let {
      commit,
      getters: { skills }
    } = context
    if (skills && skills.length && useCache) {
      return
    }
    let allSkills = await lesson.skills.getAllSkills()
    commit(GET_ALL_SKILLS_SUCCESS, { skills: allSkills })
  },
  async getAllSubjects(context, { useCache = true }) {
    let {
      commit,
      getters: { subjects }
    } = context
    if (subjects && subjects.length && useCache) {
      return
    }
    let allSubjects = await lesson.subjects.getAllSubjects()
    commit(GET_ALL_SUBJECTS_SUCCESS, { subjects: allSubjects })
  },
  async logout({ commit }) {
    commit(LOGOUT)
  },
  async toggleLoginDialog({ commit }, status) {
    commit(TOGGLE_LOGIN_DIALOG, status)
  }
}

export default actions
