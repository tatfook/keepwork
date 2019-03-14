import Vue from 'vue'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const GET_ORG_SUCCESS = 'GET_ORG_SUCCESS'
const SET_CURRENT_ORG = 'SET_CURRENT_ORG'
const GET_ORG_PACKAGES_SUCCESS = 'GET_ORG_PACKAGES_SUCCESS'

export const props = {
  LOGIN_SUCCESS,
  GET_ORG_SUCCESS,
  SET_CURRENT_ORG,
  GET_ORG_PACKAGES_SUCCESS
}

const mutations = {
  [LOGIN_SUCCESS](state, { userinfo }) {
    Vue.set(state, 'userinfo', userinfo)
  },
  [GET_ORG_SUCCESS](state, { id, name, orgDetail }) {
    Vue.set(state, 'orgsDetailForId', {
      ...state.orgsDetailForId,
      [id]: orgDetail
    })
    Vue.set(state, 'orgsDetailForName', {
      ...state.orgsDetailForName,
      [name]: orgDetail
    })
  },
  [SET_CURRENT_ORG](state, { orgDetail }) {
    Vue.set(state, 'currentOrg', orgDetail)
  },
  [GET_ORG_PACKAGES_SUCCESS](state, { organizationId, orgPackages }) {
    Vue.set(state, 'orgPackages', {
      ...state.orgPackages,
      [organizationId]: orgPackages
    })
  }
}

export default mutations
