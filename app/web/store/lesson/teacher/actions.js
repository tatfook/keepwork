import { props } from './mutations'
import { lesson } from '@/api'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'
const {
  TOGGLE_HINT,
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  BEGIN_THE_CLASS_SUCCESS,
  DISMISS_THE_CLASS_SUCCESS,
  UPDATE_LEARN_RECORDS_SUCCESS,
  GET_PACKAGE_LESSON_LIST_SUCCESS,
  GET_USER_PACKAGES_SUCCESS,
  GET_USER_LESSONS_SUCCESS,
  GET_CURRENT_CLASSROOM_SUCCESS,
  GET_CLASSROOM_LEARN_RECORDS,
  LEAVE_THE_CLASSROOM,
  COPY_CLASSROOM_QUIZ
} = props

const actions = {
  toggleHint({ commit }) {
    commit(TOGGLE_HINT)
  },
  async getAllTeacherData(context) {
    let { dispatch } = context
    await dispatch('getUserLessons', { useCache: false })
    await dispatch('getUserPackages', { useCache: false })
  },
  async getPackageDetail({ commit }, { packageId }) {
    let detail = await lesson.packages.packageDetail({ packageId })
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  },
  async getLessonContent(
    { commit, dispatch, getters },
    { lessonId, packageId }
  ) {
    await dispatch('getPackageDetail', { packageId })
    const { teacherPackageDetail } = getters
    const packageIndex = teacherPackageDetail({ packageId })
      .lessons.map(l => l.id)
      .indexOf(Number(lessonId))
    let [res, detail] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId })
    ])
    if (packageIndex !== -1) detail.packageIndex = packageIndex + 1
    let modList = Parser.buildBlockList(res.content)
    let quiz = modList
      .filter(item => (item.cmd === 'Quiz' && !_.isEmpty(item.data)))
      .map(({ data: { quiz: { data } } }) => ({
        key: data[0].id,
        data: data[0],
        result: null,
        answer: null
      }))
    commit(GET_LESSON_CONTENT_SUCCESS, {
      lessonId,
      content: res.content
    })
    commit(SAVE_LESSON_DETAIL, {
      lessonId,
      lesson: detail,
      quiz,
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
      .catch(e => {
        console.error("can't find the classroom", e)
        commit(LEAVE_THE_CLASSROOM)
      })
  },
  async resumeClassData({ commit }, payload) {
    commit(GET_CURRENT_CLASSROOM_SUCCESS, payload)
  },
  async copyClassroomQuiz({ commit, getters: { isBeInClass, isClassIsOver, lessonDetail } }) {
    if (isBeInClass && !isClassIsOver) {
      commit(COPY_CLASSROOM_QUIZ, _.get(lessonDetail, 'quiz', []))
    }
  },
  async leaveTheClassroom({ commit, getters: { isBeInClass, isClassIsOver } }) {
    isBeInClass && isClassIsOver && commit(LEAVE_THE_CLASSROOM)
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
  async getUserLessons(context, { useCache = true }) {
    let {
      commit,
      getters: { userLessons }
    } = context
    if (userLessons && userLessons.length && useCache) {
      return
    }
    let lessons = await lesson.lessons.getUserLessons()
    let lessonsRows = _.get(lessons, 'rows')
    commit(GET_USER_LESSONS_SUCCESS, { userLessons: lessonsRows })
  },
  async createNewPackage(context, { newPackageData }) {
    let { dispatch } = context
    let newPackageDetail = await lesson.packages
      .create({ newPackageData })
      .catch(error => {
        return Promise.reject(error.response)
      })
    await dispatch('getAllTeacherData')
    return newPackageDetail
  },
  async addLessonToPackage(context, { packageId, lessonId, isLastOne = true }) {
    let { dispatch } = context
    await lesson.packages
      .addLesson({
        packageId,
        lessonId
      })
      .then(() => {
        return Promise.resolve()
      })
      .catch(error => {
        return Promise.reject(error.response)
      })
    if (isLastOne) {
      await dispatch('getAllTeacherData')
    }
  },
  async removeLessonFromPackage(
    context,
    { packageId, lessonId, isLastOne = true }
  ) {
    let { dispatch } = context
    await lesson.packages
      .removeLesson({
        packageId,
        lessonId
      })
      .then(() => {
        return Promise.resolve()
      })
      .catch(error => {
        return Promise.reject(error.response)
      })
    if (isLastOne) {
      await dispatch('getAllTeacherData')
    }
  },
  async createNewLesson(context, { newLessonData }) {
    let { dispatch } = context
    let newLessonDetail = await lesson.lessons
      .create({ newLessonData })
      .catch(error => {
        return Promise.reject(error.response)
      })
    await dispatch('getUserLessons', { useCache: false })
    return newLessonDetail
  },
  async updateLesson(context, { updatingData }) {
    let { dispatch } = context
    await lesson.lessons.update({ updatingData }).catch(error => {
      return Promise.reject(error.response)
    })
    await dispatch('getUserLessons', { useCache: false })
  },
  async updatePackage(context, { updatingPackageData }) {
    let { dispatch } = context
    await lesson.packages.update({ updatingPackageData }).catch(error => {
      return Promise.reject(error.response)
    })
    await dispatch('getAllTeacherData')
  },
  async auditPackage(context, { packageId, state }) {
    let { dispatch } = context
    await lesson.packages
      .audit({ packageId, state })
      .then(async () => {
        await dispatch('getAllTeacherData')
        return Promise.resolve()
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  async releasePackage(context, { packageDetail }) {
    let { dispatch } = context
    await lesson.packages.release({ packageDetail }).catch(error => {
      return Promise.reject(error.response)
    })
    await dispatch('getAllTeacherData')
  },
  async deletePackage(context, { packageId }) {
    let { dispatch } = context
    await lesson.packages.destroy({ packageId })
    await dispatch('getAllTeacherData')
  },
  async deleteLesson(context, { lessonId }) {
    let { dispatch } = context
    await lesson.lessons.destroy({ lessonId })
    await dispatch('getAllTeacherData')
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
    await lesson.classrooms
      .modifyClassroomLearnRecords({ id, learnRecordsArr })
      .then(res => {
        console.log('modifyClassroomRecords', res)
        // commit(GET_CLASSROOM_LEARN_RECORDS, res)
        dispatch('getClassLearnRecords', { id })
      })
      .catch(err => console.log(err))
  }
}

export default actions
