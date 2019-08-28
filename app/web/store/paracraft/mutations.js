import Vue from 'vue'

const GET_CLASSIFIES_SUCCESS = 'GET_CLASSIFIES_SUCCESS'
const GET_SYSTEM_COMPS_SUCCESS = 'GET_SYSTEM_COMPS_SUCCESS'
const GET_ORG_LIST_SUCCESS = 'GET_ORG_LIST_SUCCESS'

export const props = {
  GET_CLASSIFIES_SUCCESS,
  GET_SYSTEM_COMPS_SUCCESS,
  GET_ORG_LIST_SUCCESS,
}

const mutations = {
  [GET_CLASSIFIES_SUCCESS](state, classifies) {
    Vue.set(state, 'systemClassifies', classifies)
  },
  [GET_SYSTEM_COMPS_SUCCESS](state, comps) {
    Vue.set(state, 'systemComps', comps)
  },
  [GET_ORG_LIST_SUCCESS](state, orgList) {
    Vue.set(state, 'userOrgList', orgList)
  }
}

export default mutations
