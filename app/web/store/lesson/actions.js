import { lesson, keepwork } from '@/api'
import { props } from './mutations'

let {
  GET_USER_INFO_SUCCESS,
  GET_PACKAGES_LIST,
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_DETAIL_SUCCESS,
  GET_ALL_SKILLS_SUCCESS,
  GET_ALL_SUBJECTS_SUCCESS,
  LOGOUT,
  TOGGLE_LOGIN_DIALOG,
  SET_PREVIEW_FLAG,
  GET_PACKAGE_BY_SYSTEM_TAGS_SUCCESS
} = props

const actions = {
  async getUserDetail(context) {
    let { commit } = context
    let userLessonInfo = await lesson.users.getUserDetail()
    commit(GET_USER_INFO_SUCCESS, userLessonInfo)
  },
  async getPackagesList({ commit }, payload) {
    let packagesList = await lesson.packages.packagesList(payload)
    commit(GET_PACKAGES_LIST, packagesList)
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
  async resumeClassData({ dispatch }) {
    await lesson.classrooms
      .currentClass()
      .then(res => {
        dispatch('lesson/student/resumeClassData', res, { root: true })
        dispatch('lesson/teacher/resumeClassData', res, { root: true })
      })
      .catch(e => console.error(e))
  },
  async logout({ commit }) {
    commit(LOGOUT)
  },
  async toggleLoginDialog({ commit }, payload) {
    commit(TOGGLE_LOGIN_DIALOG, payload)
  },
  async setPreviewFlag({ commit }, payload) {
    commit(SET_PREVIEW_FLAG, payload)
  },
  async getPackageSystemTags({ commit }, type) {
    const res = await keepwork.systemTags.getSystemTags(type)
    return res
  },
  async getPackageBySystemTags({ commit }, { typeId }) {
    const res = await keepwork.graphql.getQueryResult({
      query: 'query($id: Int){tag(id: $id) {id, tagname, packages{id, packageName, intro,  maxAge, minAge, extra, lessonCount} }}',
      variables: {
        id: Number(typeId)
      }
    })
    commit(GET_PACKAGE_BY_SYSTEM_TAGS_SUCCESS, res)
  }
}

export default actions
