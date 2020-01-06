import Vue from 'vue'

const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_ORG_PACKAGE_DETAIL_SUCCESS = 'GET_ORG_PACKAGE_DETAIL_SUCCESS'
const GET_ORG_PACKAGES_SUCCESS = 'GET_ORG_PACKAGES_SUCCESS'
const SAVE_LESSON_DETAIL = 'SAVE_LESSON_DETAIL'
const GET_LESSON_CONTENT_SUCCESS = 'GET_LESSON_CONTENT_SUCCESS'
const DO_QUIZ = 'DO_QUIZ'
const RESUME_QUIZ = 'RESUME_QUIZ'
const CLEAR_LESSON_DATA = 'CLEAR_LESSON_DATA'
const CREATE_LEARN_RECORDS_SUCCESS = 'CREATE_LEARN_RECORDS_SUCCESS'
const ENTER_CLASSROOM = 'ENTER_CLASSROOM'
const RESUME_CLASSROOM = 'RESUME_CLASSROOM'
const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS'
const SWITCH_SUMMARY = 'SWITCH_SUMMARY'
const GET_MY_TEACHER_SUCCESS = 'GET_MY_TEACHER_SUCCESS'
const GET_MY_CLASSMATE_SUCCESS = 'GET_MY_CLASSMATE_SUCCESS'
const GET_CLASS_PACKAGES_SUCCESS = 'GET_CLASS_PACKAGES_SUCCESS'
const GET_LAST_UPDATE_PROJECTS_SUCCESS = 'GET_LAST_UPDATE_PROJECTS_SUCCESS'
const GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS =
  'GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS'
const GET_EVALUATION_COMMENT_LIST_SUCCESS =
  'GET_EVALUATION_COMMENT_LIST_SUCCESS'
const GET_STUDENT_INFO_SUCCESS = 'GET_STUDENT_INFO_SUCCESS'
const GET_ORG_CLASS_REPORT_SUCCESS = 'GET_ORG_CLASS_REPORT_SUCCESS'
const GET_CLASS_REPORT_STATISTICS_SUCCESS = 'GET_CLASS_REPORT_STATISTICS_SUCCESS'
const GET_CLASS_REPORT_COMMENT_LIST_SUCCESS = 'GET_CLASS_REPORT_COMMENT_LIST_SUCCESS'
const GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS = 'GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS'

export const props = {
  GET_ORG_CLASSES_SUCCESS,
  GET_ORG_PACKAGE_DETAIL_SUCCESS,
  GET_ORG_PACKAGES_SUCCESS,
  SAVE_LESSON_DETAIL,
  GET_LESSON_CONTENT_SUCCESS,
  DO_QUIZ,
  RESUME_QUIZ,
  CLEAR_LESSON_DATA,
  CREATE_LEARN_RECORDS_SUCCESS,
  ENTER_CLASSROOM,
  RESUME_CLASSROOM,
  GET_USER_INFO_SUCCESS,
  SWITCH_SUMMARY,
  GET_MY_TEACHER_SUCCESS,
  GET_MY_CLASSMATE_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS,
  GET_LAST_UPDATE_PROJECTS_SUCCESS,
  GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS,
  GET_EVALUATION_COMMENT_LIST_SUCCESS,
  GET_STUDENT_INFO_SUCCESS,
  GET_ORG_CLASS_REPORT_SUCCESS,
  GET_CLASS_REPORT_STATISTICS_SUCCESS,
  GET_CLASS_REPORT_COMMENT_LIST_SUCCESS,
  GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS
}

const mutations = {
  [GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS](state, payload) {
    Vue.set(state, 'evaluationReportCommentDetail', payload)
  },
  [GET_CLASS_REPORT_STATISTICS_SUCCESS](state, { classId, report }) {
    Vue.set(state, 'classReportStatistics', {
      ...state.classReportStatistics,
      [classId]: report
    })
  },
  [GET_ORG_CLASSES_SUCCESS](state, classes) {
    Vue.set(state, 'orgClasses', classes)
  },
  [GET_ORG_PACKAGE_DETAIL_SUCCESS](state, { packageId, packageDetail }) {
    Vue.set(state, 'orgPackagesDetail', {
      ...state.orgPackagesDetail,
      [packageId]: packageDetail
    })
  },
  [GET_ORG_PACKAGES_SUCCESS](state, orgPackages) {
    Vue.set(state, 'orgPackages', orgPackages)
  },
  [GET_LESSON_CONTENT_SUCCESS](state, payload) {
    Vue.set(state, 'orgLessonData', payload)
  },
  [SAVE_LESSON_DETAIL](state, payload) {
    Vue.set(state, 'orgLessonDetail', payload)
  },
  [DO_QUIZ](state, payload) {
    Vue.set(state, 'orgLessonDetail', payload)
  },
  [RESUME_QUIZ](state, payload) {
    Vue.set(state, 'orgLessonDetail', payload)
  },
  [CLEAR_LESSON_DATA](state) {
    Vue.set(state, 'orgLessonDetail', '')
  },
  [CREATE_LEARN_RECORDS_SUCCESS](state, id) {
    Vue.set(state, 'learnRecordsId', id)
  },
  [ENTER_CLASSROOM](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [RESUME_CLASSROOM](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [GET_USER_INFO_SUCCESS](state, payload) {
    Vue.set(state, 'userInfo', payload)
  },
  [SWITCH_SUMMARY](state, flag) {
    Vue.set(state, 'isShowSummary', flag)
  },
  [GET_MY_TEACHER_SUCCESS](state, payload) {
    Vue.set(state, 'myTeacher', payload)
  },
  [GET_MY_CLASSMATE_SUCCESS](state, payload) {
    Vue.set(state, 'myClassmate', payload)
  },
  [GET_CLASS_PACKAGES_SUCCESS](state, payload) {
    Vue.set(state, 'classPackages', payload)
  },
  [GET_LAST_UPDATE_PROJECTS_SUCCESS](state, payload) {
    Vue.set(state, 'lastUpdateProjects', payload)
  },
  [GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS](state, payload) {
    Vue.set(state, 'moreLastUpdateProjects', payload)
  },
  [GET_EVALUATION_COMMENT_LIST_SUCCESS](
    state,
    { evaluationCommentList, classId }
  ) {
    Vue.set(state, 'evaluationCommentList', {
      ...state.evaluationCommentList,
      [classId]: evaluationCommentList
    })
  },
  [GET_STUDENT_INFO_SUCCESS](state, userinfo) {
    Vue.set(state, 'userinfo', userinfo)
  }
}

export default mutations
