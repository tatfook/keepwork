import Vue from 'vue'

const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS'
const GET_PACKAGE_DETAIL_SUCCESS = 'GET_PACKAGE_DETAIL_SUCCESS'
const TO_BE_TEACHER = 'TO_BE_TEACHER'

export const props = {
  GET_USER_INFO_SUCCESS,
  GET_PACKAGE_DETAIL_SUCCESS,
  TO_BE_TEACHER
}

const mutations = {
  [GET_USER_INFO_SUCCESS](state, userDetailInfo) {
    Vue.set(state, 'userinfo', userDetailInfo)
  },
  [GET_PACKAGE_DETAIL_SUCCESS](state, { detail }) {
    Vue.set(state, 'packagesDetail', {
      ...state.packagesDetail,
      [detail.id]: detail
    })
  },
  [TO_BE_TEACHER](state, isToBeTeacherSuccess) {
    Vue.set(state, 'isToBeTeacherSuccess', isToBeTeacherSuccess)
  }
}

export default mutations
