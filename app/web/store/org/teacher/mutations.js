import Vue from 'vue'

const GET_ORG_CLASSES_SUCCESS = 'GET_ORG_CLASSES_SUCCESS'
const GET_CLASS_PACKAGES_SUCCESS = 'GET_CLASS_PACKAGES_SUCCESS'
const GET_CLASS_STUDENTS_SUCCESS = 'GET_CLASS_STUDENTS_SUCCESS'
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

export const props = {
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS,
  GET_CLASS_STUDENTS_SUCCESS,
  GET_CLASS_PACKAGE_DETAIL_SUCCESS,
  GET_CLASS_LESSON_CONTENT_SUCCESS,
  SAVE_CLASS_LESSON_DETAIL,
  TOGGLE_LESSON_HINT,
  BEGIN_THE_CLASS_SUCCESS,
  DISMISS_THE_CLASS_SUCCESS,
  UPDATE_LEARN_RECORDS_SUCCESS,
  GET_CURRENT_CLASSROOM_SUCCESS,
  LEAVE_THE_CLASSROOM,
  COPY_CLASSROOM_QUIZ
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
      ...state.orgClassStudents,
      [classId]: classStudents
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