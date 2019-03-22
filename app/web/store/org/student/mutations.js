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
    console.log(payload)
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
}

export default mutations