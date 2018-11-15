import Vue from 'vue'

const PUBLISH_LESSON = 'PUBLISH_LESSON'
const TOGGLE_HINT = 'TOGGLE_HINT'
const GET_PACKAGE_DETAIL_SUCCESS = 'GET_PACKAGE_DETAIL_SUCCESS'
const GET_LESSON_CONTENT_SUCCESS = 'GET_LESSON_CONTENT_SUCCESS'
const SAVE_LESSON_DETAIL = 'SAVE_LESSON_DETAIL'
const BEGIN_THE_CLASS_SUCCESS = 'BEGIN_THE_CLASS_SUCCESS'
const DISMISS_THE_CLASS_SUCCESS = 'DISMISS_THE_CLASS_SUCCESS'
const UPDATE_LEARN_RECORDS_SUCCESS = 'UPDATE_LEARN_RECORDS_SUCCESS'
const GET_CURRENT_CLASSROOM_SUCCESS = 'GET_CURRENT_CLASSROOM_SUCCESS'
const GET_PACKAGE_LESSON_LIST_SUCCESS = 'GET_PACKAGE_LESSON_LIST_SUCCESS'
const GET_USER_PACKAGES_SUCCESS = 'GET_USER_PACKAGES_SUCCESS'
const GET_USER_LESSONS_SUCCESS = 'GET_USER_LESSONS_SUCCESS'
const GET_CLASSROOM_LEARN_RECORDS = 'GET_CLASSROOM_LEARN_RECORDS'
const LEAVE_THE_CLASSROOM = 'LEAVE_THE_CLASSROOM'
const COPY_CLASSROOM_QUIZ = 'COPY_CLASSROOM_QUIZ'

export const props = {
  PUBLISH_LESSON,
  TOGGLE_HINT,
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  BEGIN_THE_CLASS_SUCCESS,
  DISMISS_THE_CLASS_SUCCESS,
  UPDATE_LEARN_RECORDS_SUCCESS,
  GET_PACKAGE_LESSON_LIST_SUCCESS,
  GET_USER_PACKAGES_SUCCESS,
  GET_USER_LESSONS_SUCCESS,
  GET_CURRENT_CLASSROOM_SUCCESS,
  GET_CLASSROOM_LEARN_RECORDS,
  LEAVE_THE_CLASSROOM,
  COPY_CLASSROOM_QUIZ
}

const mutations = {
  [TOGGLE_HINT](state) {
    Vue.set(state, 'isShowHint', !state.isShowHint)
  },
  [GET_PACKAGE_DETAIL_SUCCESS](state, { detail }) {
    Vue.set(state, 'packagesDetail', {
      ...state.packagesDetail,
      [detail.id]: detail
    })
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
  [GET_USER_PACKAGES_SUCCESS](state, { userPackages }) {
    Vue.set(state, 'userPackages', userPackages)
  },
  [GET_USER_LESSONS_SUCCESS](state, { userLessons }) {
    Vue.set(state, 'userLessons', userLessons)
  },
  [GET_PACKAGE_LESSON_LIST_SUCCESS](state, { packageId, lessons }) {
    Vue.set(state, 'packageLessons', {
      ...state.packageLessons,
      [packageId]: lessons
    })
  },
  [GET_CLASSROOM_LEARN_RECORDS](state, classroomLearnRecord) {
    Vue.set(state, 'classroomLearnRecord', classroomLearnRecord)
  },
  [LEAVE_THE_CLASSROOM](state) {
    Vue.set(state, 'classroom', {})
  },
  [COPY_CLASSROOM_QUIZ](state, payload) {
    Vue.set(state, 'classroomQuiz', payload)
  }
}

export default mutations
