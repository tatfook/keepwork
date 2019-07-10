import Vue from 'vue'

const GET_CLASSIFIES_SUCCESS = 'GET_CLASSIFIES_SUCCESS'
const GET_SYSTEM_COMPS_SUCCESS = 'GET_SYSTEM_COMPS_SUCCESS'

export const props = {
  GET_CLASSIFIES_SUCCESS,
  GET_SYSTEM_COMPS_SUCCESS
}

const mutations = {
  [GET_CLASSIFIES_SUCCESS](state, classifies) {
    Vue.set(state, 'systemClassifies', classifies)
  },
  [GET_SYSTEM_COMPS_SUCCESS](state, comps) {
    Vue.set(state, 'systemComps', comps)
  }
}

export default mutations
