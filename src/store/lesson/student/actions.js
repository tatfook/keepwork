import { lesson } from '@/api'
import { props } from './mutations'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'

let {
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  ENTER_CLASSROOM,
  RESUME_CLASSROOM,
  SAVE_LESSON_DETAIL,
  DO_QUIZ,
  SET_ENTER_CLASS_ID,
  SWITCH_SUMMARY,
  LEAVE_THE_CLASS
} = props

const actions = {
  async getPackageDetail({ commit }, { packageId }) {
    let detail = await lesson.packages.packageDetail({
      id: packageId
    })
    commit(GET_PACKAGE_DETAIL_SUCCESS, {
      detail
    })
  },
  async getLessonContent(context, { lessonId }) {
    const {
      commit,
      rootGetters: { 'user/authRequestConfig': config }
    } = context
    let res = await lesson.lessons.lessonContent({
      lessonId,
      config
    })
    let modList = Parser.buildBlockList(res.content)
    let quiz = modList
      .filter(({ cmd }) => cmd === 'Quiz')
      .map(({ key, data }) => ({
        key: key,
        data: data.quiz.data[0],
        result: null
      }))
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
      quiz,
      modList
    })
  },
  async subscribePackage({ context }, { packageId }) {
    let subscribeResult = await lesson.packages.subscribe({
      id: packageId
    })
    return subscribeResult
  },
  async enterClassRoom({ commit }, { key }) {
    let enterClassInfo = await lesson.classrooms.join({
      key: key
    })
    enterClassInfo['key'] = key
    commit(ENTER_CLASSROOM, enterClassInfo)
  },
  async resumeTheClass(context) {
    const {
      commit,
      rootGetters: {
        'lesson/userinfo': { extra = {} }
      }
    } = context
    let { classroomId = null } = extra
    if (classroomId) {
      let classroom = await lesson.classrooms.getClassroomById(classroomId)
      commit(RESUME_CLASSROOM, classroom)
      console.log(classroom)
    }
  },
  async doQuiz({ commit }, { key, result, answer }) {
    commit(DO_QUIZ, {
      key,
      result,
      answer
    })
  },
  async uploadLearnRecords(context) {
    const {
      getters: { classId, learnRecords },
      rootGetters: { 'user/authRequestConfig': config }
    } = context
    console.warn(learnRecords)
    await lesson.classrooms.uploadLearnRecords({
      classId,
      learnRecords,
      config
    })
  },
  async switchSummary({ commit }, flag) {
    commit(SWITCH_SUMMARY, flag)
  },
  async setEnterClassID({ commit }, { key }) {
    commit(SET_ENTER_CLASS_ID, {
      key
    })
  },
  async leaveTheClass({ commit, dispatch }) {
    await lesson.classrooms.leave()
    await dispatch('lesson/getUserDetail', null, { root: true })
    commit(LEAVE_THE_CLASS)
  }
}
export default actions
