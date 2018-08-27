import { props } from './mutations'
import { lesson } from '@/api'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'
const {
  TOGGLE_HINT,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  BEGIN_THE_CLASS_SUCCESS,
  DISMISS_THE_CLASS_SUCCESS,
  TOGGLE_LESSON,
  TOGGLE_PERFORMANCE,
  TOGGLE_SUMMARY,
  UPDATE_LEARN_RECORDS_SUCCESS,
  GET_PACKAGE_LESSON_LIST_SUCCESS,
  GET_USER_PACKAGES_SUCCESS,
  GET_CURRENT_CLASSROOM_SUCCESS,
  GET_CLASSROOM_LEARN_RECORDS,
  LEAVE_THE_CLASSROOM
} = props

const actions = {
  toggleHint({ commit }) {
    commit(TOGGLE_HINT)
  },
  async getLessonContent(context, lessonId) {
    const { commit } = context
    let res = await lesson.lessons.lessonContent({
      lessonId
    })
    let modList = Parser.buildBlockList(res.content)

    let _lesson = _.get(
      modList.find(item => item.cmd === 'Lesson'),
      'data.lesson',
      {}
    )
    commit(GET_LESSON_CONTENT_SUCCESS, {
      lessonId,
      content: res.content
    })
    commit(SAVE_LESSON_DETAIL, {
      lessonId,
      lesson: _lesson,
      modList
    })
  },
  async beginTheClass(context, payload) {
    const { commit } = context
    let classroom = await lesson.classrooms.begin({
      payload
    })
    commit(BEGIN_THE_CLASS_SUCCESS, classroom)
  },
  async dismissTheClass(context, payload) {
    const {
      commit,
      getters: { classroom, classId }
    } = context
    let flag = await lesson.classrooms.dismiss({
      classId
    })
    if (flag) {
      let _classroom = _.clone(classroom)
      _classroom.state = 2
      commit(DISMISS_THE_CLASS_SUCCESS, _classroom)
    }
  },
  async updateLearnRecords(context, payload) {
    const {
      commit,
      getters: { classId }
    } = context
    let learnRecords = await lesson.classrooms.learnRecords({
      classId
    })
    commit(UPDATE_LEARN_RECORDS_SUCCESS, learnRecords)
  },
  async getCurrentClass({ commit }) {
    await lesson.classrooms
      .currentClass()
      .then(classroom => commit(GET_CURRENT_CLASSROOM_SUCCESS, classroom))
      .catch(e => console.warn("can't find the classroom", e))
  },
  async leaveTheClassroom({ commit, getters: { isBeInClass, isClassIsOver } }) {
    isBeInClass && isClassIsOver && commit(LEAVE_THE_CLASSROOM)
  },
  toggleLesson({ commit }, flag) {
    commit(TOGGLE_LESSON, flag)
  },
  togglePerformance({ commit }, flag) {
    commit(TOGGLE_PERFORMANCE, flag)
  },
  toggleSummary({ commit }, flag) {
    commit(TOGGLE_SUMMARY, flag)
  },
  async getUserPackages(context, { useCache = true }) {
    let {
      commit,
      getters: { userPackages }
    } = context
    if (userPackages && userPackages.length && useCache) {
      return
    }
    let packages = await lesson.packages.getUserPackages()
    let packageRows = _.get(packages, 'rows')
    commit(GET_USER_PACKAGES_SUCCESS, { userPackages: packageRows })
  },
  async auditPackage(context, { packageId, state }) {
    let { dispatch } = context
    await lesson.packages.audit({ packageId, state: state })
    await dispatch('getUserPackages', { useCache: false })
  },
  async releasePackage(context, { packageDetail }) {
    let { dispatch } = context
    await lesson.packages.release({ packageDetail })
    await dispatch('getUserPackages', { useCache: false })
  },
  async deletePackage(context, { packageId }) {
    let { dispatch } = context
    await lesson.packages.delete({ packageId })
    await dispatch('getUserPackages', { useCache: false })
  },
  async getLessonList(context, { packageId, useCache = true }) {
    let {
      commit,
      getters: { packageLessons }
    } = context
    let targetPackageLessons = _.get(packageLessons, packageId, [])
    if (useCache && targetPackageLessons.length > 0) {
      return
    }
    let lessons = await lesson.packages.getLessonList({ packageId })
    commit(GET_PACKAGE_LESSON_LIST_SUCCESS, { packageId, lessons })
  },
  async getClassLearnRecords({ commit }, { id }) {
    await lesson.classrooms
      .getClassroomLearnRecords(id)
      .then(res => {
        console.log('getClassroomLearnRecords', res)
        commit(GET_CLASSROOM_LEARN_RECORDS, res)
      })
      .catch(err => console.log(err))
  },
  async modifyClassLearnRecords({ dispatch }, { id, learnRecordsArr }) {
    await lesson.classrooms.modifyClassroomLearnRecords({ id, learnRecordsArr }).then(res => {
      console.log('modifyClassroomRecords', res)
      // commit(GET_CLASSROOM_LEARN_RECORDS, res)
      dispatch('getClassLearnRecords', { id })
    }).catch(err => console.log(err))
  }
}

export default actions
