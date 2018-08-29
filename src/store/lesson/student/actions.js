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
  RESUME_QUIZ,
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
      .map(({ data: { quiz: { data } } }) => ({
        key: data[0].id,
        data: [0],
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
  async enterClassRoom({ commit, dispatch }, { key }) {
    let enterClassInfo = await lesson.classrooms.join({
      key: key
    })
    enterClassInfo['key'] = key
    commit(ENTER_CLASSROOM, enterClassInfo)
  },
  async resumeTheClass({ commit, dispatch }) {
    await dispatch('lesson/getUserDetail', null, { root: true })
    let classroom = await lesson.classrooms
      .currentClass()
      .catch(e => console.error(e))
    if (!classroom) {
      return console.error('当前没有上课')
    }
    const { learnRecordId, id } = classroom
    let _classroom = _.clone(classroom)
    _classroom['id'] = learnRecordId
    _classroom['classroomId'] = id
    commit(RESUME_CLASSROOM, _classroom)
  },
  async resumeQuiz(
    {
      commit,
      getters: { lessonQuiz, lessonDetail }
    },
    { id }
  ) {
    let learnRecords = await lesson.classrooms
      .learnRecordsById(id)
      .catch(e => console.error(`can't find learnRecords`))
    if (learnRecords && learnRecords.extra.quiz) {
      let quiz = _.get(learnRecords, 'extra.quiz', lessonQuiz)
      let _lessonDetail = _.clone(lessonDetail)
      _lessonDetail.quiz = quiz
      let filterQuiz = _.filter(quiz, ({ answer }) => answer)
      _.forEach(_lessonDetail.modList, q => {
        if (q.cmd === 'Quiz') {
          let quiz = _.find(filterQuiz, o => o.key === q.data.quiz.data[0].id)
          if (quiz) {
            q.state = { result: quiz.result, answer: quiz.answer }
          }
        }
      })
      console.warn('lessonDetail--->', _lessonDetail)
      commit(RESUME_QUIZ, _lessonDetail)
    }
  },
  async doQuiz(
    {
      commit,
      getters: { lessonDetail }
    },
    { key, result, answer }
  ) {
    let _lessonDetail = _.clone(lessonDetail)
    console.warn('key', key)
    console.warn('quiz', lessonDetail.quiz)
    let index = _.findIndex(_lessonDetail.quiz, o => o.key === key)
    _lessonDetail.quiz[index].result = result
    _lessonDetail.quiz[index].answer = answer
    commit(DO_QUIZ, _lessonDetail)
  },
  async uploadLearnRecords(context) {
    const {
      getters: { classId, learnRecords }
    } = context
    console.warn(learnRecords)
    await lesson.classrooms.uploadLearnRecords({
      classId,
      learnRecords
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
