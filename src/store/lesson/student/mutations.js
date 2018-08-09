import Vue from 'vue'
import _ from 'lodash'

const GET_PACKAGE_DETAIL_SUCCESS = 'GET_PACKAGE_DETAIL_SUCCESS'
const GET_LESSON_DATA_SUCCESS = 'GET_LESSON_DATA_SUCCESS'
const GET_USER_SUBSCRIBES = 'GET_USER_SUBSCRIBES'
const GET_USER_SKILLS = 'GET_USER_SKILLS'
const ENTER_CLASSROOM = 'ENTER_CLASSROOM'
const DO_QUIZ = 'DO_QUIZ'
const SAVE_LESSON_DETAIL = 'SAVE_LESSON_DETAIL'
const SET_ENTER_CLASS_ID = 'SET_ENTER_CLASS_ID'

export const props = {
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_DATA_SUCCESS,
  GET_USER_SUBSCRIBES,
  GET_USER_SKILLS,
  ENTER_CLASSROOM,
  SAVE_LESSON_DETAIL,
  DO_QUIZ,
  SET_ENTER_CLASS_ID
}

const mutations = {
  [GET_PACKAGE_DETAIL_SUCCESS](state, { detail }) {
    Vue.set(state, 'packagesDetail', {
      ...state.packagesDetail,
      [detail.id]: detail
    })
  },
  [GET_LESSON_DATA_SUCCESS](state, { lessonId, content }) {
    Vue.set(state, 'lessonData', { lessonId, content })
  },
  [SAVE_LESSON_DETAIL](state, payload) {
    Vue.set(state, 'lessonDetail', payload)
  },
  [GET_USER_SUBSCRIBES](state, { userSubscribeList }) {
    Vue.set(state, 'userSubscribeList', userSubscribeList)
  },
  [GET_USER_SKILLS](state, { userSkillsList }) {
    Vue.set(state, 'userSkillsList', userSkillsList)
  },
  [ENTER_CLASSROOM](state, { enterClassInfo }) {
    Vue.set(state, 'enterClassInfo', enterClassInfo)
  },
  [DO_QUIZ](state, { key, result, answer }) {
    let _lessonDetail = _.clone(state.lessonDetail)
    let index = _.findIndex(_lessonDetail.quiz, o => o.key === key)
    _lessonDetail.quiz[index].result = result
    _lessonDetail.quiz[index].answer = answer
    Vue.set(state, 'lessonDetail', _lessonDetail)
  },
  [SET_ENTER_CLASS_ID](state, { key }) {
    Vue.set(state, 'enterClassId', key)
  }
}

export default mutations
