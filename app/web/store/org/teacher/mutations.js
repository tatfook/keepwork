import Vue from 'vue'

const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_CLASS_PACKAGES_SUCCESS = 'GET_CLASS_PACKAGES_SUCCESS'

export const props = {
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS
}


const mutations = {
  [GET_ORG_CLASSES_SUCCESS](state, payload) {
    Vue.set(state, 'orgClasses', payload)
  },
  [GET_CLASS_PACKAGES_SUCCESS](state, { classId, classPackages }) {
    console.log(classId)
    Vue.set(state, 'orgClassPackages', {
      ...state.orgClassPackages,
      [classId]: classPackages
    })
  }
}

export default mutations