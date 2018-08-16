import { lesson } from '@/api'
import { props } from './mutations'
import Parser from '@/lib/mod/parser'

let {
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  GET_USER_SUBSCRIBES,
  GET_USER_SKILLS,
  ENTER_CLASSROOM,
  SAVE_LESSON_DETAIL,
  DO_QUIZ,
  SET_ENTER_CLASS_ID,
  SWITCH_SUMMARY
} = props

const actions = {
  async getPackageDetail({ commit }, { packageId }) {
    let detail = await lesson.packages.packageDetail({
      id: packageId
    })
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  },
  async getLessonContent({ commit }, { lessonId }) {
    let content = await lesson.lessons.lessonContent({ lessonId })
    commit(GET_LESSON_CONTENT_SUCCESS, { lessonId, content })
    let modList = Parser.buildBlockList(content)
    let quiz = modList
      .filter(({ cmd }) => cmd === 'Quiz')
      .map(({ key, data }) => ({
        key: key,
        data: data.quiz.data[0],
        result: null
      }))
    commit(SAVE_LESSON_DETAIL, { lessonId, modList, quiz })
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
    let enterClassInfo = await lesson.classrooms.join({ key })
    commit(ENTER_CLASSROOM, { enterClassInfo })
  },
  async doQuiz({ commit }, { key, result, answer }) {
    commit(DO_QUIZ, { key, result, answer })
  },
  async switchSummary({ commit }, flag) {
    commit(SWITCH_SUMMARY, flag)
  },
  async setEnterClassID({ commit }, { key }) {
    commit(SET_ENTER_CLASS_ID, { key })
  }
}
export default actions
