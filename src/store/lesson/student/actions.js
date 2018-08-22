import { lesson } from '@/api'
import { props } from './mutations'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'

let {
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  ENTER_CLASSROOM,
  // RESUME_CLASSROOM,
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
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  },
  async getLessonContent(context, { lessonId }) {
    const {
      commit,
      rootGetters: { 'user/authRequestConfig': config }
    } = context
    let res = await lesson.lessons.lessonContent({ lessonId, config })
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
    commit(GET_LESSON_CONTENT_SUCCESS, { lessonId, content: res.content })
    commit(SAVE_LESSON_DETAIL, { lessonId, lesson: _lesson, quiz, modList })
  },
  async subscribePackage({ context }, { packageId }) {
    let subscribeResult = await lesson.packages.subscribe({
      id: packageId
    })
    return subscribeResult
  },
  async getUserSubscribes({ commit }, { userId }) {
    let userSubscribeList = await lesson.users.userSubscribes({ userId })
    commit(GET_USER_SUBSCRIBES, { userSubscribeList })
  },
  async getUserSkills({ commit }, { userId }) {
    let userSkillsList = await lesson.users.userSkills({ userId })
    commit(GET_USER_SKILLS, { userSkillsList })
  },
  async enterClassRoom({ commit }, { key }) {
    let enterClassInfo = await lesson.classrooms.join({ key: key })
    commit(ENTER_CLASSROOM, enterClassInfo)
  },
 // async resumeTheClass(context) {
    // const {
    //   rootGetters: {
    //     'lesson/userinfo': {
    //       extra: { classroomId }
    //     }
    //   }
    // } = context
  //}
  async enterClassRoom(context, { key }) {
    const {
      commit,
      rootGetters: { 'user/authRequestConfig': config }
    } = context
    let payload = { key: key }
    let enterClassInfo = await lesson.classrooms.join({ payload, config })
    commit(ENTER_CLASSROOM, { enterClassInfo })
  },
  async doQuiz({ commit }, { key, result, answer }) {
    commit(DO_QUIZ, { key, result, answer })
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
    commit(SET_ENTER_CLASS_ID, { key })
  },
  async leaveTheClass({ commit }) {
    commit(LEAVE_THE_CLASS)
  }
}
export default actions
