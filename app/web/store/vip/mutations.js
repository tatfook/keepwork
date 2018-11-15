import Vue from 'vue'

const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'

export const props = {
  TOGGLE_LOGIN_DIALOG
}

const mutations = {
  [TOGGLE_LOGIN_DIALOG](state, status) {
    Vue.set(state, 'isShowLoginDialog', status)
  }
}

export default mutations
