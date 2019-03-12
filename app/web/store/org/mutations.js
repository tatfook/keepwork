import Vue from 'vue'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

export const props = {
  LOGIN_SUCCESS
}

const mutations = {
  [LOGIN_SUCCESS](state, userinfo) {
    Vue.set(state, 'userinfo', userinfo)
  }
}

export default mutations
