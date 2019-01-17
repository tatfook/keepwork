import Vue from 'vue'

const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS'
const GET_PACKAGES_LIST = 'GET_PACKAGES_LIST'
const GET_PACKAGE_DETAIL_SUCCESS = 'GET_PACKAGE_DETAIL_SUCCESS'
const GET_LESSON_DETAIL_SUCCESS = 'GET_LESSON_DETAIL_SUCCESS'
const GET_ALL_SKILLS_SUCCESS = 'GET_ALL_SKILLS_SUCCESS'
const GET_ALL_SUBJECTS_SUCCESS = 'GET_ALL_SUBJECTS_SUCCESS'
const LOGOUT = 'LOGOUT'
const SHOW_LOGIN_DIALOG = 'SHOW_LOGIN_DIALOG'
const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'

export const props = {
  GET_USER_INFO_SUCCESS,
  GET_PACKAGES_LIST,
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_DETAIL_SUCCESS,
  GET_ALL_SKILLS_SUCCESS,
  GET_ALL_SUBJECTS_SUCCESS,
  LOGOUT,
  SHOW_LOGIN_DIALOG,
  TOGGLE_LOGIN_DIALOG
}

const mutations = {
  [GET_USER_INFO_SUCCESS](state, userDetailInfo) {
    Vue.set(state, 'userinfo', userDetailInfo)
  },
  [LOGOUT](state) {
    Vue.set(state, 'userinfo', {})
  },
  [TOGGLE_LOGIN_DIALOG](state, payload) {
    Vue.set(state, 'isShowLoginDialog', payload)
  },
  [GET_PACKAGES_LIST](state, packagesList) {
    Vue.set(state, 'packagesList', packagesList)
  },
  [GET_PACKAGE_DETAIL_SUCCESS](state, { detail }) {
    Vue.set(state, 'packagesDetail', {
      ...state.packagesDetail,
      [detail.id]: detail
    })
  },
  [GET_LESSON_DETAIL_SUCCESS](state, { detail }) {
    Vue.set(state, 'lessonsDetail', {
      ...state.lessonsDetail,
      [detail.id]: detail
    })
  },
  [GET_ALL_SKILLS_SUCCESS](state, { skills }) {
    Vue.set(state, 'skills', skills)
  },
  [GET_ALL_SUBJECTS_SUCCESS](state, { subjects }) {
    Vue.set(state, 'subjects', subjects)
  }
}

export default mutations
