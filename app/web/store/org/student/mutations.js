import Vue from 'vue'

const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_CLASS_PACKAGE_DETAIL_SUCCESS = 'GET_CLASS_PACKAGE_DETAIL_SUCCESS'
const GET_CLASS_PACKAGES_SUCCESS = 'GET_CLASS_PACKAGES_SUCCESS'
const GET_ORG_PACKAGES_SUCCESS = 'GET_ORG_PACKAGES_SUCCESS'


export const props = {
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASS_PACKAGE_DETAIL_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS,
  GET_ORG_PACKAGES_SUCCESS
}

const mutations = {
  [GET_ORG_CLASSES_SUCCESS](state, classes) {
    Vue.set(state, 'orgClasses', classes)
  },
  [GET_CLASS_PACKAGES_SUCCESS](state, { classId, classPackages }) {
    Vue.set(state, 'orgClassPackages', {
      ...state.orgClassPackages,
      [classId]: classPackages
    })
  },
  [GET_CLASS_PACKAGE_DETAIL_SUCCESS](state, { classId, packageId, packageDetail }) {
    Vue.set(state, 'orgClassPackagesDetail', {
      ...state.orgClassPackagesDetail,
      [classId]: {
        ...state.orgClassPackagesDetail[classId],
        [packageId]: packageDetail
      }
    })
  },
  [GET_ORG_PACKAGES_SUCCESS](state, orgPackages) {
    Vue.set(state, 'orgPackages', orgPackages)
  }
}

export default mutations