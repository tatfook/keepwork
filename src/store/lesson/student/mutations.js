import Vue from 'vue'

const SET_USER_SUBSCRIBES = 'SET_USER_SUBSCRIBES'
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
const CREATE_LEARN_RECORDS_SUCCESS = 'CREATE_LEARN_RECORDS_SUCCESS'
const CLEAR_LEARN_RECORDS_ID = 'CLEAR_LEARN_RECORDS_ID'
const CLEAR_LESSON_DATA = 'CLEAR_LESSON_DATA'
const CHANGE_STATUS = 'CHANGE_STATUS'
const SWITCH_DEVICE = 'SWITCH_DEVICE'

export const props = {
  SET_USER_SUBSCRIBES,
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
  RESUME_QUIZ,
  CREATE_LEARN_RECORDS_SUCCESS,
  CLEAR_LEARN_RECORDS_ID,
  CLEAR_LESSON_DATA,
  CHANGE_STATUS,
  SWITCH_DEVICE
}

const mutations = {
  [SET_USER_SUBSCRIBES](state, userSubscribes) {
    Vue.set(state, 'subscribesList', userSubscribes)
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
  },
  [CREATE_LEARN_RECORDS_SUCCESS](state, id) {
    Vue.set(state, 'learnRecordsId', id)
  },
  [CLEAR_LEARN_RECORDS_ID](state) {
    Vue.set(state, 'learnRecordsId', '')
  },
  [CLEAR_LESSON_DATA](state) {
    Vue.set(state, 'lessonDetail', '')
  },
  [CHANGE_STATUS](state, payload) {
    Vue.set(state, 'status', payload)
  },
  [SWITCH_DEVICE](state, payload) {
    Vue.set(state, 'device', payload)
  }
}

export default mutations
