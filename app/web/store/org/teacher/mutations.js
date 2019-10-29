import Vue from 'vue'

const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_CLASS_PACKAGES_SUCCESS = 'GET_CLASS_PACKAGES_SUCCESS'
const GET_CLASS_STUDENTS_SUCCESS = 'GET_CLASS_STUDENTS_SUCCESS'
const GET_CLASS_TEACHERS_SUCCESS = 'GET_CLASS_TEACHERS_SUCCESS'
const GET_CLASS_PACKAGE_DETAIL_SUCCESS = 'GET_CLASS_PACKAGE_DETAIL_SUCCESS'
const GET_CLASS_LESSON_CONTENT_SUCCESS = 'GET_CLASS_LESSON_CONTENT_SUCCESS'
const SAVE_CLASS_LESSON_DETAIL = 'SAVE_CLASS_LESSON_DETAIL'
const TOGGLE_LESSON_HINT = 'TOGGLE_LESSON_HINT'

const BEGIN_THE_CLASS_SUCCESS = 'BEGIN_THE_CLASS_SUCCESS'
const DISMISS_THE_CLASS_SUCCESS = 'DISMISS_THE_CLASS_SUCCESS'
const UPDATE_LEARN_RECORDS_SUCCESS = 'UPDATE_LEARN_RECORDS_SUCCESS'
const GET_CURRENT_CLASSROOM_SUCCESS = 'GET_CURRENT_CLASSROOM_SUCCESS'
const LEAVE_THE_CLASSROOM = 'LEAVE_THE_CLASSROOM'
const COPY_CLASSROOM_QUIZ = 'COPY_CLASSROOM_QUIZ'
const GET_TAUGHT_CLASSROOM_COURSES_SUCCESS = 'GET_TAUGHT_CLASSROOM_COURSES_SUCCESS'
const GET_ORG_STUDENTS_SUCCESS = 'GET_ORG_STUDENTS_SUCCESS'

const GET_CLASS_EVALUATION_REPORTS_SUCCESS = 'GET_CLASS_EVALUATION_REPORTS_SUCCESS'
const SET_CLASS_EVALUATION_REPORT_COUNT = 'SET_CLASS_EVALUATION_REPORT_COUNT'
const GET_EVALUATION_REPORT_DETAIL_SUCCESS = 'GET_EVALUATION_REPORT_DETAIL_SUCCESS'
const GET_LAST_UPDATE_PROJECTS_SUCCESS = 'GET_LAST_UPDATE_PROJECTS_SUCCESS'
const GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS =
  'GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS'
const GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS = 'GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS'

export const props = {
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS,
  GET_CLASS_STUDENTS_SUCCESS,
  GET_CLASS_TEACHERS_SUCCESS,
  GET_CLASS_PACKAGE_DETAIL_SUCCESS,
  GET_CLASS_LESSON_CONTENT_SUCCESS,
  SAVE_CLASS_LESSON_DETAIL,
  TOGGLE_LESSON_HINT,
  BEGIN_THE_CLASS_SUCCESS,
  DISMISS_THE_CLASS_SUCCESS,
  UPDATE_LEARN_RECORDS_SUCCESS,
  GET_CURRENT_CLASSROOM_SUCCESS,
  LEAVE_THE_CLASSROOM,
  COPY_CLASSROOM_QUIZ,
  GET_TAUGHT_CLASSROOM_COURSES_SUCCESS,
  GET_ORG_STUDENTS_SUCCESS,
  GET_CLASS_EVALUATION_REPORTS_SUCCESS,
  SET_CLASS_EVALUATION_REPORT_COUNT,
  GET_EVALUATION_REPORT_DETAIL_SUCCESS,
  GET_LAST_UPDATE_PROJECTS_SUCCESS,
  GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS,
  GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS
}


const mutations = {
  [GET_LAST_UPDATE_PROJECTS_SUCCESS](state, payload) {
    Vue.set(state, 'lastUpdateProjects', payload)
  },
  [GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS](state, payload) {
    Vue.set(state, 'moreLastUpdateProjects', payload)
  },
  [GET_EVALUATION_REPORT_DETAIL_SUCCESS](state, { status, payload }) {
    Vue.set(state, 'evaluationReportDetail', {
      ...state.evaluationReportDetail,
      [status]: payload
    })
  },
  [SET_CLASS_EVALUATION_REPORT_COUNT](state, { classId, count }) {
    Vue.set(state, 'orgClassEvaluationReportCount', {
      ...state.orgClassEvaluationReportCount,
      [classId]: count
    })
  },
  [GET_CLASS_EVALUATION_REPORTS_SUCCESS](state, { classId, reports }) {
    Vue.set(state, 'orgClassEvaluationReports', {
      ...state.orgClassEvaluationReports,
      [classId]: reports
    })
  },
  [GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS](state, report) {
    Vue.set(state, 'evaluationReportCommentDetail', report)
  },
  [GET_ORG_CLASSES_SUCCESS](state, payload) {
    Vue.set(state, 'orgClasses', payload)
  },
  [GET_ORG_STUDENTS_SUCCESS](state, payload) {
    Vue.set(state, 'orgStudents', payload)
  },
  [GET_CLASS_PACKAGES_SUCCESS](state, { classId, classPackages }) {
    Vue.set(state, 'orgClassPackages', {
      ...state.orgClassPackages,
      [classId]: classPackages
    })
  },
  [GET_CLASS_STUDENTS_SUCCESS](state, { classId, classStudents }) {
    Vue.set(state, 'orgClassStudents', {
      ...state.orgClassStudents,
      [classId]: classStudents
    })
  },
  [GET_CLASS_TEACHERS_SUCCESS](state, { classId, classTeachers }) {
    Vue.set(state, 'orgClassTeachers', {
      ...state.orgClassTeachers,
      [classId]: classTeachers
    })
  },
  [GET_TAUGHT_CLASSROOM_COURSES_SUCCESS](state, { classId, classroomCourses }) {
    Vue.set(state, 'classroomCoursesData', {
      ...state.classroomCoursesData,
      [classId]: classroomCourses
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
  [GET_CLASS_LESSON_CONTENT_SUCCESS](state, payload) {
    Vue.set(state, 'orgLessonData', payload)
  },
  [SAVE_CLASS_LESSON_DETAIL](state, payload) {
    Vue.set(state, 'orgLessonDetail', payload)
  },
  [TOGGLE_LESSON_HINT](state) {
    Vue.set(state, 'isShowLessonHint', !state.isShowLessonHint)
  },
  [BEGIN_THE_CLASS_SUCCESS](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [DISMISS_THE_CLASS_SUCCESS](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [GET_CURRENT_CLASSROOM_SUCCESS](state, payload) {
    Vue.set(state, 'classroom', payload)
  },
  [UPDATE_LEARN_RECORDS_SUCCESS](state, payload) {
    Vue.set(state, 'learnRecords', payload)
  },
  [LEAVE_THE_CLASSROOM](state) {
    Vue.set(state, 'classroom', {})
  },
  [COPY_CLASSROOM_QUIZ](state, payload) {
    Vue.set(state, 'classroomQuiz', payload)
  }
}

export default mutations