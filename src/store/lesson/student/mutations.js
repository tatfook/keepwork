import Vue from 'vue'

const GET_PACKAGE_DETAIL_SUCCESS = 'GET_PACKAGE_DETAIL_SUCCESS'

export const props = {
  GET_PACKAGE_DETAIL_SUCCESS
}

const mutations = {
  [GET_PACKAGE_DETAIL_SUCCESS](state, { detail }) {
    console.log(detail)
    Vue.set(state, 'packageDetail', detail)
  }
}

export default mutations
