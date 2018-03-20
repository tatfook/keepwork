import Vue from 'vue'
import { keepwork } from '@/api'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

const state = () => ({
  info: {}
})

const getters = {
  info: state => state.info
}

const actions = {
  login({ commit }, payload) {
    keepwork.user.login(payload).then(info => {
      commit(LOGIN_SUCCESS, info)
    })
  }
}

const mutations = {
  [LOGIN_SUCCESS](state, payload) {
    Vue.set(state, 'info', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
