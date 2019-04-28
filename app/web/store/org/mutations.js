import Vue from 'vue'
import _ from 'lodash'

const GET_ORG_COUNT_SUCCESS = 'GET_ORG_COUNT_SUCCESS'
const SET_TOKEN_UPDATE_AT = 'SET_TOKEN_UPDATE_AT'
const GET_ORG_SUCCESS = 'GET_ORG_SUCCESS'
const SET_CURRENT_ORG = 'SET_CURRENT_ORG'
const GET_ORG_PACKAGES_SUCCESS = 'GET_ORG_PACKAGES_SUCCESS'
const GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS =
  'GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS'
const GET_ORG_PACKAGE_DETAIL_SUCCESS = 'GET_ORG_PACKAGE_DETAIL_SUCCESS'
const GET_LESSON_CONTENT_SUCCESS = 'GET_LESSON_CONTENT_SUCCESS'
const SAVE_LESSON_DETAIL = 'SAVE_LESSON_DETAIL'
const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_ORG_TEACHERS_SUCCESS = 'GET_ORG_TEACHERS_SUCCESS'
const GET_ORG_STUDENTS_SUCCESS = 'GET_ORG_STUDENTS_SUCCESS'
const GET_USER_ORG_SUCCESS = 'GET_USER_ORG_SUCCESS'
const GET_ORG_ACTIVATE_CODE_SUCCESS = 'GET_ORG_ACTIVATE_CODE_SUCCESS'

export const props = {
  GET_ORG_COUNT_SUCCESS,
  SET_TOKEN_UPDATE_AT,
  GET_ORG_SUCCESS,
  SET_CURRENT_ORG,
  GET_ORG_PACKAGES_SUCCESS,
  GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS,
  GET_ORG_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  GET_ORG_CLASSES_SUCCESS,
  GET_ORG_TEACHERS_SUCCESS,
  GET_ORG_STUDENTS_SUCCESS,
  GET_USER_ORG_SUCCESS,
  GET_ORG_ACTIVATE_CODE_SUCCESS
}

const mutations = {
  [SET_TOKEN_UPDATE_AT](state) {
    Vue.set(state, 'tokenUpdateAt', Date.now())
  },
  [GET_ORG_COUNT_SUCCESS](state, { orgId, userCounts }) {
    Vue.set(state, 'userCounts', {
      ...state.userCounts,
      [orgId]: userCounts
    })
  },
  [GET_ORG_SUCCESS](state, { orgDetail }) {
    let { id, loginUrl } = orgDetail
    Vue.set(state, 'orgsDetailForId', {
      ...state.orgsDetailForId,
      [id]: orgDetail
    })
    Vue.set(state, 'orgsDetailForLoginUrl', {
      ...state.orgsDetailForLoginUrl,
      [loginUrl]: orgDetail
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
  },
  [GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS](
    state,
    { organizationId, orgPackages }
  ) {
    Vue.set(state, 'orgPackagesGraphql', {
      ...state.orgPackagesGraphql,
      [organizationId]: orgPackages
    })
  },
  [GET_ORG_PACKAGE_DETAIL_SUCCESS](state, { packageId, packageDetail }) {
    Vue.set(state, 'orgPackagesDetail', {
      ...state.orgPackagesDetail,
      [packageId]: packageDetail
    })
  },
  [GET_LESSON_CONTENT_SUCCESS](state, payload) {
    Vue.set(state, 'orgLessonData', payload)
  },
  [SAVE_LESSON_DETAIL](state, payload) {
    Vue.set(state, 'orgLessonDetail', payload)
  },
  [GET_ORG_CLASSES_SUCCESS](state, { organizationId, orgClasses }) {
    Vue.set(state, 'orgClasses', {
      ...state.orgClasses,
      [organizationId]: orgClasses
    })
  },
  [GET_ORG_TEACHERS_SUCCESS](state, { organizationId, orgTeachers }) {
    Vue.set(state, 'orgTeachers', {
      ...state.orgTeachers,
      [organizationId]: orgTeachers
    })
  },
  [GET_ORG_STUDENTS_SUCCESS](state, { organizationId, orgStudents, classId }) {
    Vue.set(state, 'orgStudents', {
      ...state.orgStudents,
      [organizationId]: {
        ..._.get(state, `orgStudents.${organizationId}`),
        [classId]: orgStudents
      }
    })
  },
  [GET_USER_ORG_SUCCESS](state, org) {
    Vue.set(state, 'userOrg', org)
  },
  [GET_ORG_ACTIVATE_CODE_SUCCESS](state, codeList) {
    Vue.set(state, 'orgActiveCodeList', codeList)
  }
}

export default mutations
