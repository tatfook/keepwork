import { props } from './mutations'
import { lesson } from '@/api'
import Parser from '@/lib/mod/parser'
const {
  TOGGLE_HINT,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  BEGIN_THE_CLASS_SUCCESS,
  TOGGLE_LESSON,
  TOGGLE_PERFORMANCE,
  TOGGLE_SUMMARY
} = props

const actions = {
  toggleHint({ commit }) {
    commit(TOGGLE_HINT)
  },
  async getLessonContent(context, lessonId) {
    const {
      commit,
      rootGetters: { 'user/authRequestConfig': config }
    } = context
    console.log('token', config)
    let res = await lesson.lessons.lessonContent({
      lessonId,
      config
    })
    let modList = Parser.buildBlockList(res.content)
    commit(GET_LESSON_CONTENT_SUCCESS, { lessonId, content: res.content })
    commit(SAVE_LESSON_DETAIL, { lessonId, modList })
  },
  async beginTheClass(context, payload) {
    const {
      commit,
      rootGetters: { 'user/authRequestConfig': config }
    } = context
    let classRoom = await lesson.classrooms.begin({ payload, config })
    commit(BEGIN_THE_CLASS_SUCCESS, classRoom)
  },
  toggleLesson({ commit }, flag) {
    commit(TOGGLE_LESSON, flag)
  },
  togglePerformance({ commit }, flag) {
    commit(TOGGLE_PERFORMANCE, flag)
  },
  toggleSummary({ commit }, flag) {
    commit(TOGGLE_SUMMARY, flag)
  }
}

export default actions
