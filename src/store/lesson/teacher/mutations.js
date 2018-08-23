import Vue from 'vue'

const PUBLISH_LESSON = 'PUBLISH_LESSON'
const TOGGLE_HINT = 'TOGGLE_HINT'
const GET_LESSON_CONTENT_SUCCESS = 'GET_LESSON_CONTENT_SUCCESS'
const SAVE_LESSON_DETAIL = 'SAVE_LESSON_DETAIL'
const BEGIN_THE_CLASS_SUCCESS = 'BEGIN_THE_CLASS_SUCCESS'
const TOGGLE_LESSON = 'TOGGLE_LESSON'
const TOGGLE_PERFORMANCE = 'TOGGLE_PERFORMANCE'
const TOGGLE_SUMMARY = 'TOGGLE_SUMMARY'
const DISMISS_THE_CLASS_SUCCESS = 'DISMISS_THE_CLASS_SUCCESS'
const UPDATE_LEARN_RECORDS_SUCCESS = 'UPDATE_LEARN_RECORDS_SUCCESS'
const GET_CURRENT_CLASSROOM_SUCCESS = 'GET_CURRENT_CLASSROOM_SUCCESS'
const GET_PACKAGE_LESSON_LIST_SUCCESS = 'GET_PACKAGE_LESSON_LIST_SUCCESS'
const GET_USER_PACKAGES_SUCCESS = 'GET_USER_PACKAGES_SUCCESS'

export const props = {
  PUBLISH_LESSON,
  TOGGLE_HINT,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  BEGIN_THE_CLASS_SUCCESS,
  DISMISS_THE_CLASS_SUCCESS,
  TOGGLE_LESSON,
  TOGGLE_PERFORMANCE,
  TOGGLE_SUMMARY,
  UPDATE_LEARN_RECORDS_SUCCESS,
  GET_PACKAGE_LESSON_LIST_SUCCESS,
  GET_USER_PACKAGES_SUCCESS,
  GET_CURRENT_CLASSROOM_SUCCESS
}

const mutations = {
  [TOGGLE_HINT](state) {
    Vue.set(state, 'isShowHint', !state.isShowHint)
  },
  [GET_LESSON_CONTENT_SUCCESS](state, payload) {
    Vue.set(state, 'lessonData', payload)
  },
  [SAVE_LESSON_DETAIL](state, payload) {
    Vue.set(state, 'lessonDetail', payload)
  },
  [BEGIN_THE_CLASS_SUCCESS](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [DISMISS_THE_CLASS_SUCCESS](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [GET_CURRENT_CLASSROOM_SUCCESS](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [UPDATE_LEARN_RECORDS_SUCCESS](state, payload) {
    Vue.set(state, 'learnRecords', payload)
  },
  [TOGGLE_LESSON](state, payload) {
    Vue.set(state, 'isShowLesson', payload)
  },
  [TOGGLE_PERFORMANCE](state, payload) {
    Vue.set(state, 'isShowPerformance', payload)
  },
  [GET_USER_PACKAGES_SUCCESS](state, { userPackages }) {
    Vue.set(state, 'userPackages', userPackages)
  },
  [GET_PACKAGE_LESSON_LIST_SUCCESS](state, { packageId, lessons }) {
    Vue.set(state, 'packageLessons', {
      ...state.packageLessons,
      [packageId]: lessons
    })
  },
  [TOGGLE_SUMMARY](state, payload) {
    Vue.set(state, 'isShowSummary', payload)
  }
}

export default mutations
