import Vue from 'vue'

const state = () => ({
  info: {}
})

const getters = {
  info: state => state.info
}

const actions = {}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
