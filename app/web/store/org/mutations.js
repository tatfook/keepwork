import Vue from 'vue'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const GET_ORG_SUCCESS = 'GET_ORG_SUCCESS'

export const props = {
  LOGIN_SUCCESS,
  GET_ORG_SUCCESS
}

const mutations = {
  [LOGIN_SUCCESS](state, userinfo) {
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
  }
}

export default mutations
