import Vue from 'vue'
import _ from 'lodash'

const GET_ORG_COUNT_SUCCESS = 'GET_ORG_COUNT_SUCCESS'
const SET_TOKEN_UPDATE_AT = 'SET_TOKEN_UPDATE_AT'
const GET_ORG_SUCCESS = 'GET_ORG_SUCCESS'
const SET_CURRENT_ORG = 'SET_CURRENT_ORG'
const GET_ORG_PACKAGES_SUCCESS = 'GET_ORG_PACKAGES_SUCCESS'
const GET_ORG_PACKAGES_WITH_LESSON_SUCCESS = 'GET_ORG_PACKAGES_WITH_LESSON_SUCCESS'
const GET_ORG_PACKAGE_DETAIL_SUCCESS = 'GET_ORG_PACKAGE_DETAIL_SUCCESS'
const GET_LESSON_CONTENT_SUCCESS = 'GET_LESSON_CONTENT_SUCCESS'
const SAVE_LESSON_DETAIL = 'SAVE_LESSON_DETAIL'
const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_CLASSES_WITH_MEMBER_SUCCESS = 'GET_CLASSES_WITH_MEMBER_SUCCESS'
const GET_ORG_TEACHERS_SUCCESS = 'GET_ORG_TEACHERS_SUCCESS'
const GET_ORG_STUDENTS_SUCCESS = 'GET_ORG_STUDENTS_SUCCESS'
const GET_USER_ORG_SUCCESS = 'GET_USER_ORG_SUCCESS'
const GET_ORG_ACTIVATE_CODE_SUCCESS = 'GET_ORG_ACTIVATE_CODE_SUCCESS'
const SET_PRINT_CODE_LIST = 'SET_PRINT_CODE_LIST'
const GET_HISTORY_CLASSES_SUCCESS = 'GET_HISTORY_CLASSES_SUCCESS'
const TOGGLE_EXPIRATION_DIALOG = 'TOGGLE_EXPIRATION_DIALOG'
const GET_FORMS_SUCCESS = 'GET_FORMS_SUCCESS'
const GET_FEEDBACK_SUCCESS = 'GET_FEEDBACK_SUCCESS'
const GET_LOGS_SUCCESS = 'GET_LOGS_SUCCESS'
const GET_CLASS_EVALUATION_SUCCESS = 'GET_CLASS_EVALUATION_SUCCESS'
const GET_CLASS_EVALUATION_LIST_SUCCESS = 'GET_CLASS_EVALUATION_LIST_SUCCESS'
const GET_ORG_CLASS_REPORT_SUCCESS = 'GET_ORG_CLASS_REPORT_SUCCESS'
const GET_SENDED_MESSAGE_SUCCESS = 'GET_SENDED_MESSAGE_SUCCESS'
const GET_CODES_STATUS_SUCCESS = 'GET_CODES_STATUS_SUCCESS'
const SET_USE_FORMAL_CODE_PARAMS = 'SET_USE_FORMAL_CODE_PARAMS'
const SET_RE_ACTIVATED_PARAMS = 'SET_RE_ACTIVATED_PARAMS'
const GET_HISTORY_STUDENTS_SUCCESS = 'GET_HISTORY_STUDENTS_SUCCESS'
const SET_EDITING_FORM = 'SET_EDITING_FORM'

export const props = {
  GET_ORG_COUNT_SUCCESS,
  SET_TOKEN_UPDATE_AT,
  GET_ORG_SUCCESS,
  SET_CURRENT_ORG,
  GET_ORG_PACKAGES_SUCCESS,
  GET_ORG_PACKAGES_WITH_LESSON_SUCCESS,
  GET_ORG_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASSES_WITH_MEMBER_SUCCESS,
  GET_ORG_TEACHERS_SUCCESS,
  GET_ORG_STUDENTS_SUCCESS,
  GET_USER_ORG_SUCCESS,
  GET_ORG_ACTIVATE_CODE_SUCCESS,
  SET_PRINT_CODE_LIST,
  GET_HISTORY_CLASSES_SUCCESS,
  TOGGLE_EXPIRATION_DIALOG,
  GET_FORMS_SUCCESS,
  GET_FEEDBACK_SUCCESS,
  GET_LOGS_SUCCESS,
  GET_CLASS_EVALUATION_SUCCESS,
  GET_CLASS_EVALUATION_LIST_SUCCESS,
  GET_ORG_CLASS_REPORT_SUCCESS,
  GET_SENDED_MESSAGE_SUCCESS,
  GET_CODES_STATUS_SUCCESS,
  SET_USE_FORMAL_CODE_PARAMS,
  SET_RE_ACTIVATED_PARAMS,
  GET_HISTORY_STUDENTS_SUCCESS,
  SET_EDITING_FORM,
}

const mutations = {
  [SET_TOKEN_UPDATE_AT](state) {
    Vue.set(state, 'tokenUpdateAt', Date.now())
  },
  [GET_ORG_COUNT_SUCCESS](state, { orgId, userCounts }) {
    Vue.set(state, 'userCounts', {
      ...state.userCounts,
      [orgId]: userCounts,
    })
  },
  [GET_ORG_SUCCESS](state, { orgDetail }) {
    let { id, loginUrl } = orgDetail
    Vue.set(state, 'orgsDetailForId', {
      ...state.orgsDetailForId,
      [id]: orgDetail,
    })
    Vue.set(state, 'orgsDetailForLoginUrl', {
      ...state.orgsDetailForLoginUrl,
      [loginUrl]: orgDetail,
    })
  },
  [SET_CURRENT_ORG](state, { orgDetail }) {
    Vue.set(state, 'currentOrg', orgDetail)
  },
  [GET_ORG_PACKAGES_SUCCESS](state, { organizationId, orgPackages }) {
    Vue.set(state, 'orgPackages', {
      ...state.orgPackages,
      [organizationId]: orgPackages,
    })
  },
  [GET_ORG_PACKAGES_WITH_LESSON_SUCCESS](state, { organizationId, result }) {
    Vue.set(state, 'orgPackagesWithLesson', {
      ...state.orgPackagesWithLesson,
      [organizationId]: result,
    })
  },
  [GET_ORG_PACKAGE_DETAIL_SUCCESS](state, { packageId, packageDetail }) {
    Vue.set(state, 'orgPackagesDetail', {
      ...state.orgPackagesDetail,
      [packageId]: packageDetail,
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
      [organizationId]: orgClasses,
    })
  },
  [GET_CLASSES_WITH_MEMBER_SUCCESS](state, { organizationId, classes }) {
    Vue.set(state, 'orgClassesWithMember', {
      ...state.orgClassesWithMember,
      [organizationId]: classes,
    })
  },
  [GET_ORG_TEACHERS_SUCCESS](state, { organizationId, orgTeachers, classId }) {
    Vue.set(state, 'orgTeachers', {
      ...state.orgTeachers,
      [organizationId]: {
        ..._.get(state, `orgTeachers.${organizationId}`),
        [classId]: orgTeachers,
      },
    })
  },
  [GET_ORG_STUDENTS_SUCCESS](state, { organizationId, orgStudents, classId }) {
    Vue.set(state, 'orgStudents', {
      ...state.orgStudents,
      [organizationId]: {
        ..._.get(state, `orgStudents.${organizationId}`),
        [classId]: orgStudents,
      },
    })
  },
  [GET_USER_ORG_SUCCESS](state, org) {
    Vue.set(state, 'userOrg', org)
  },
  [GET_ORG_ACTIVATE_CODE_SUCCESS](state, codeList) {
    Vue.set(state, 'orgActiveCodeList', codeList)
  },
  [SET_PRINT_CODE_LIST](state, codeList) {
    Vue.set(state, 'printCodeList', codeList)
  },
  [GET_HISTORY_CLASSES_SUCCESS](state, classesList) {
    Vue.set(state, 'orgHistoricalClasses', classesList)
  },
  [TOGGLE_EXPIRATION_DIALOG](state, status) {
    Vue.set(state, 'expirationDialogVisible', status)
  },
  [GET_FORMS_SUCCESS](state, { organizationId, forms }) {
    Vue.set(state, 'orgForms', {
      ...state.orgForms,
      [organizationId]: forms,
    })
  },
  [GET_FEEDBACK_SUCCESS](state, { formId, submitList }) {
    Vue.set(state, 'formsFeedback', {
      ...state.formsFeedback,
      [formId]: submitList,
    })
  },
  [GET_LOGS_SUCCESS](state, { orgId, result }) {
    Vue.set(state, 'orgLogs', {
      ...state.orgLogs,
      [orgId]: result,
    })
  },
  [GET_CLASS_EVALUATION_SUCCESS](state, { classId, result }) {
    Vue.set(state, 'classEvaluations', {
      ...state.classEvaluations,
      [classId]: result,
    })
  },
  [GET_CLASS_EVALUATION_LIST_SUCCESS](state, { classId, result }) {
    Vue.set(state, 'classEvaluationList', {
      ...state.classEvaluationList,
      [classId]: result,
    })
  },
  [GET_ORG_CLASS_REPORT_SUCCESS](state, { days, result }) {
    Vue.set(state, 'orgClassesReport', {
      ...state.orgClassesReport,
      [days]: result,
    })
  },
  [GET_SENDED_MESSAGE_SUCCESS](state, messages) {
    Vue.set(state, 'sendedMessages', messages)
  },
  [GET_CODES_STATUS_SUCCESS](state, result) {
    Vue.set(state, 'codeUsedStatus', result)
  },
  [SET_USE_FORMAL_CODE_PARAMS](state, useFormalCodeParams) {
    Vue.set(state, 'useFormalCodeParams', useFormalCodeParams)
  },
  [SET_RE_ACTIVATED_PARAMS](state, reActivatedParams) {
    Vue.set(state, 'reActivatedParams', reActivatedParams)
  },
  [GET_HISTORY_STUDENTS_SUCCESS](state, historyStudents) {
    Vue.set(state, 'historyStudents', historyStudents)
  },
  [SET_EDITING_FORM](state, formDetail) {
    Vue.set(state, 'editingForm', formDetail)
  },
}

export default mutations
