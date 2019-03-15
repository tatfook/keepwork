import Vue from 'vue'

const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_CLASS_PACKAGES_SUCCESS = 'GET_CLASS_PACKAGES_SUCCESS'
const GET_CLASS_STUDENTS_SUCCESS = 'GET_CLASS_STUDENTS_SUCCESS'

export const props = {
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS,
  GET_CLASS_STUDENTS_SUCCESS
}


const mutations = {
  [GET_ORG_CLASSES_SUCCESS](state, payload) {
    Vue.set(state, 'orgClasses', payload)
  },
  [GET_CLASS_PACKAGES_SUCCESS](state, { classId, classPackages }) {
    Vue.set(state, 'orgClassPackages', {
      ...state.orgClassPackages,
      [classId]: classPackages
    })
  },
  [GET_CLASS_STUDENTS_SUCCESS](state, { classId, classStudents }) {
    Vue.set(state, 'orgClassStudents', {
      ...state.classStudents,
      [classId]: classStudents
    })
  }
}

export default mutations