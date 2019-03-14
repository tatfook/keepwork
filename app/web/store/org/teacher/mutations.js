import Vue from 'vue'

const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'

export const props = {
  GET_ORG_CLASSES_SUCCESS
}


const mutations = {
  [GET_ORG_CLASSES_SUCCESS](state, payload) {
    Vue.set(state, 'orgClasses', payload)
  }
}

export default mutations