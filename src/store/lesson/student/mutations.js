import Vue from 'vue'

const GET_PACKAGE_DETAIL_SUCCESS = 'GET_PACKAGE_DETAIL_SUCCESS'
const GET_LESSON_CONTENT_SUCCESS = 'GET_LESSON_CONTENT_SUCCESS'
const GET_USER_SUBSCRIBES = 'GET_USER_SUBSCRIBES'
const ENTER_CLASSROOM = 'ENTER_CLASSROOM'
const DO_QUIZ = 'DO_QUIZ'
const SAVE_LESSON_DETAIL = 'SAVE_LESSON_DETAIL'
const SET_ENTER_CLASS_ID = 'SET_ENTER_CLASS_ID'
const SWITCH_SUMMARY = 'SWITCH_SUMMARY'
const LEAVE_THE_CLASS = 'LEAVE_THE_CLASS'
const RESUME_CLASSROOM = 'RESUME_CLASSROOM'
const RESUME_QUIZ = 'RESUME_QUIZ'

export const props = {
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  GET_USER_SUBSCRIBES,
  ENTER_CLASSROOM,
  SAVE_LESSON_DETAIL,
  SET_ENTER_CLASS_ID,
  RESUME_CLASSROOM,
  DO_QUIZ,
  SWITCH_SUMMARY,
  LEAVE_THE_CLASS,
  RESUME_QUIZ
}

const mutations = {
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
  [ENTER_CLASSROOM](state, { enterClassInfo }) {
    Vue.set(state, 'enterClassInfo', enterClassInfo)
  },
  [ENTER_CLASSROOM](state, payload) {
    Vue.set(state, 'enterClassInfo', payload)
  },
  [RESUME_CLASSROOM](state, payload) {
    Vue.set(state, 'enterClassInfo', payload)
  },
  [RESUME_QUIZ](state, payload) {
    Vue.set(state, 'lessonDetail', payload)
  },
  [DO_QUIZ](state, payload) {
    Vue.set(state, 'lessonDetail', payload)
  },
  [SWITCH_SUMMARY](state, flag) {
    Vue.set(state, 'isShowSummary', flag)
  },
  [SET_ENTER_CLASS_ID](state, { key }) {
    Vue.set(state, 'enterClassId', key)
  },
  [LEAVE_THE_CLASS](state) {
    Vue.set(state, 'enterClassInfo', {})
  }
}

export default mutations
