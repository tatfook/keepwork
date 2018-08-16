import { props } from './mutations'
import { lesson } from '@/api'
import Parser from '@/lib/mod/parser'
const { TOGGLE_HINT, GET_LESSON_CONTENT_SUCCESS, SAVE_LESSON_DETAIL } = props

const actions = {
  toggleHint({ commit }) {
    commit(TOGGLE_HINT)
  },
  async getLessonContent({ commit }, lessonId) {
    let content = await lesson.lessons.lessonContent({ lessonId })
    console.log(content)
    let modList = Parser.buildBlockList(content)
    console.warn(modList)
    commit(GET_LESSON_CONTENT_SUCCESS, { lessonId, content })
    commit(SAVE_LESSON_DETAIL, { lessonId, modList })
  }
}

export default actions
