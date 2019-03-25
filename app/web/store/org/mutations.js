import Vue from 'vue'
import _ from 'lodash'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const GET_ORG_COUNT_SUCCESS = 'GET_ORG_COUNT_SUCCESS'
const GET_ORG_SUCCESS = 'GET_ORG_SUCCESS'
const SET_CURRENT_ORG = 'SET_CURRENT_ORG'
const GET_ORG_PACKAGES_SUCCESS = 'GET_ORG_PACKAGES_SUCCESS'
const GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS = 'GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS'
const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_ORG_TEACHERS_SUCCESS = 'GET_ORG_TEACHERS_SUCCESS'
const GET_ORG_STUDENTS_SUCCESS = 'GET_ORG_STUDENTS_SUCCESS'

export const props = {
  LOGIN_SUCCESS,
  GET_ORG_COUNT_SUCCESS,
  GET_ORG_SUCCESS,
  SET_CURRENT_ORG,
  GET_ORG_PACKAGES_SUCCESS,
  GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS,
  GET_ORG_CLASSES_SUCCESS,
  GET_ORG_TEACHERS_SUCCESS,
  GET_ORG_STUDENTS_SUCCESS
}

const mutations = {
  [LOGIN_SUCCESS](state, { userinfo }) {
    Vue.set(state, 'userinfo', userinfo)
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
  [GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS](state, { organizationId, orgPackages }) {
    Vue.set(state, 'orgPackagesGraphql', {
      ...state.orgPackagesGraphql,
      [organizationId]: orgPackages
    })
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
  }
}

export default mutations
