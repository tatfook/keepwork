import Vue from 'vue'

const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_ORG_PACKAGE_DETAIL_SUCCESS = 'GET_ORG_PACKAGE_DETAIL_SUCCESS'
const GET_ORG_PACKAGES_SUCCESS = 'GET_ORG_PACKAGES_SUCCESS'
const SAVE_LESSON_DETAIL = 'SAVE_LESSON_DETAIL'
const GET_LESSON_CONTENT_SUCCESS = 'GET_LESSON_CONTENT_SUCCESS'
const DO_QUIZ = 'DO_QUIZ'
const RESUME_QUIZ = 'RESUME_QUIZ'
const CLEAR_LESSON_DATA = 'CLEAR_LESSON_DATA'
const CREATE_LEARN_RECORDS_SUCCESS = 'CREATE_LEARN_RECORDS_SUCCESS'
const ENTER_CLASSROOM = 'ENTER_CLASSROOM'
const RESUME_CLASSROOM = 'RESUME_CLASSROOM'
const LEAVE_THE_CLASS = 'LEAVE_THE_CLASS'
const GET_TEACHING_LESSON_SUCCESS = 'GET_TEACHING_LESSON_SUCCESS'
const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS'
const SWITCH_SUMMARY = 'SWITCH_SUMMARY'
const GET_ORG_REAL_NAME_SUCCESS = 'GET_ORG_REAL_NAME_SUCCESS'

export const props = {
  GET_ORG_CLASSES_SUCCESS,
  GET_ORG_PACKAGE_DETAIL_SUCCESS,
  GET_ORG_PACKAGES_SUCCESS,
  SAVE_LESSON_DETAIL,
  GET_LESSON_CONTENT_SUCCESS,
  DO_QUIZ,
  RESUME_QUIZ,
  CLEAR_LESSON_DATA,
  CREATE_LEARN_RECORDS_SUCCESS,
  ENTER_CLASSROOM,
  RESUME_CLASSROOM,
  LEAVE_THE_CLASS,
  GET_TEACHING_LESSON_SUCCESS,
  GET_USER_INFO_SUCCESS,
  SWITCH_SUMMARY,
  GET_ORG_REAL_NAME_SUCCESS
}

const mutations = {
  [GET_ORG_CLASSES_SUCCESS](state, classes) {
    Vue.set(state, 'orgClasses', classes)
  },
  [GET_ORG_PACKAGE_DETAIL_SUCCESS](state, { packageId, packageDetail }) {
    Vue.set(state, 'orgPackagesDetail', {
      ...state.orgPackagesDetail,
      [packageId]: packageDetail
    })
  },
  [GET_ORG_PACKAGES_SUCCESS](state, orgPackages) {
    Vue.set(state, 'orgPackages', orgPackages)
  },
  [GET_LESSON_CONTENT_SUCCESS](state, payload) {
    Vue.set(state, 'orgLessonData', payload)
  },
  [SAVE_LESSON_DETAIL](state, payload) {
    Vue.set(state, 'orgLessonDetail', payload)
  },
  [DO_QUIZ](state, payload) {
    Vue.set(state, 'orgLessonDetail', payload)
  },
  [RESUME_QUIZ](state, payload) {
    Vue.set(state, 'orgLessonDetail', payload)
  },
  [CLEAR_LESSON_DATA](state) {
    Vue.set(state, 'orgLessonDetail', '')
  },
  [CREATE_LEARN_RECORDS_SUCCESS](state, id) {
    Vue.set(state, 'learnRecordsId', id)
  },
  [ENTER_CLASSROOM](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [RESUME_CLASSROOM](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [LEAVE_THE_CLASS](state) {
    Vue.set(state, 'classroom', {})
  },
  [GET_TEACHING_LESSON_SUCCESS](state, payload) {
    Vue.set(state, 'teachingLesson', payload)
  },
  [GET_USER_INFO_SUCCESS](state, payload) {
    Vue.set(state, 'userInfo', payload)
  },
  [SWITCH_SUMMARY](state, flag) {
    Vue.set(state, 'isShowSummary', flag)
  },
  [GET_ORG_REAL_NAME_SUCCESS](state, realName) {
    Vue.set(state, 'orgRealName', realName)
  }
}

export default mutations