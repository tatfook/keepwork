import Vue from 'vue'

const GET_PACKAGE_DETAIL_SUCCESS = 'GET_PACKAGE_DETAIL_SUCCESS'
const GET_LESSON_CONTENT_SUCCESS = 'GET_LESSON_CONTENT_SUCCESS'
const GET_USER_SUBSCRIBES = 'GET_USER_SUBSCRIBES'
const GET_USER_SKILLS = 'GET_USER_SKILLS'
const ENTER_CLASSROOM = 'ENTER_CLASSROOM'

export const props = {
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  GET_USER_SUBSCRIBES,
  GET_USER_SKILLS,
  ENTER_CLASSROOM
}

const mutations = {
  [GET_PACKAGE_DETAIL_SUCCESS](state, { detail }) {
    Vue.set(state, 'packagesDetail', {
      ...state.packagesDetail,
      [detail.id]: detail
    })
  },
  [GET_LESSON_CONTENT_SUCCESS](state, { lessonId, content }) {
    Vue.set(state, 'lessons', {
      ...state.GET_LESSON_CONTENT_SUCCESS,
      [lessonId]: content
    })
  },
  [GET_USER_SUBSCRIBES](state, { userSubscribeList }) {
    Vue.set(state, 'userSubscribeList', userSubscribeList)
  },
  [GET_USER_SKILLS](state, { userSkillsList }) {
    Vue.set(state, 'userSkillsList', userSkillsList)
  },
  [ENTER_CLASSROOM](state, { enterClassInfo }) {
    Vue.set(state, 'enterClassInfo', enterClassInfo)
  }
}

export default mutations
