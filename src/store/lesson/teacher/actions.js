import {
  props
} from './mutations'
import {
  lesson
} from '@/api'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'
const SUCCESS_FLAG = 'OK'
const {
  TOGGLE_HINT,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  BEGIN_THE_CLASS_SUCCESS,
  DISMISS_THE_CLASS_SUCCESS,
  TOGGLE_LESSON,
  TOGGLE_PERFORMANCE,
  TOGGLE_SUMMARY,
  UPDATE_LEARN_RECORDS_SUCCESS
} = props

const actions = {
  toggleHint({
    commit
  }) {
    commit(TOGGLE_HINT)
  },
  async getLessonContent(context, lessonId) {
    const {
      commit
    } = context
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
      modList
    })
  },
  async beginTheClass(context, payload) {
    const {
      commit
    } = context
    let classroom = await lesson.classrooms.begin({
      payload
    })
    commit(BEGIN_THE_CLASS_SUCCESS, classroom)
  },
  async dismissTheClass(context, payload) {
    const {
      commit,
      getters: {
        classroom,
        classId
      }
    } = context
    let flag = await lesson.classrooms.dismiss({
      classId
    })
    if (flag === SUCCESS_FLAG) {
      let _classroom = _.clone(classroom)
      _classroom.state = 2
      commit(DISMISS_THE_CLASS_SUCCESS, _classroom)
    }
  },
  async updateLearnRecords(context, payload) {
    const {
      commit,
      getters: {
        classId
      }
    } = context
    let learnRecords = await lesson.classrooms.learnRecords({
      classId
    })
    console.warn(learnRecords)
    commit(UPDATE_LEARN_RECORDS_SUCCESS, learnRecords)
  },
  toggleLesson({
    commit
  }, flag) {
    commit(TOGGLE_LESSON, flag)
  },
  togglePerformance({
    commit
  }, flag) {
    commit(TOGGLE_PERFORMANCE, flag)
  },
  toggleSummary({
    commit
  }, flag) {
    commit(TOGGLE_SUMMARY, flag)
  }
}

export default actions
