import Vue from 'vue'

const GET_PACKAGES_LIST = 'GET_PACKAGES_LIST'

export const props = {
  GET_PACKAGES_LIST
}

const mutations = {
  [GET_PACKAGES_LIST](state, packagesList) {
    Vue.set(state, 'packagesList', packagesList)
  }
}

export default mutations
