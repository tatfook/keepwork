import { lesson } from '@/api'
import { props } from './mutations'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'

let {
  SET_USER_SUBSCRIBES,
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  ENTER_CLASSROOM,
  RESUME_CLASSROOM,
  SAVE_LESSON_DETAIL,
  DO_QUIZ,
  RESUME_QUIZ,
  SET_ENTER_CLASS_ID,
  SWITCH_SUMMARY,
  LEAVE_THE_CLASS,
  CREATE_LEARN_RECORDS_SUCCESS,
  CLEAR_LEARN_RECORDS_ID,
  CLEAR_LESSON_DATA,
  CHANGE_STATUS,
  SWITCH_DEVICE,
  SAVE_VISITOR_INFO,
  CLEAR_VISITOR_INFO,
  SET_VISITOR_NICKNAME
} = props

const actions = {
  async getUserSubscribes({ commit, rootGetters: { 'user/userId': userId } }) {
    let userSubscribes = await lesson.users.userSubscribes({
      userId
    })
    commit(SET_USER_SUBSCRIBES, userSubscribes)
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
    const { studentPackageDetail } = getters
    const packageIndex = studentPackageDetail({ packageId })
      .lessons.map(l => l.id)
      .indexOf(Number(lessonId))
    let [res, detail] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId })
    ])
    if (packageIndex !== -1) detail.packageIndex = packageIndex + 1
    try {
      let modList = Parser.buildBlockList(res.content)
      let quiz = modList.filter(item => {
        return item.cmd === 'Quiz' && !_.isEmpty(item.data)
      })
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
      commit(CLEAR_LEARN_RECORDS_ID)
    } catch (error) {
      console.error(error)
    }
  },
  async subscribePackage({ context }, { packageId }) {
    let subscribeResult = await lesson.packages.subscribe({
      id: packageId
    })
    return subscribeResult
  },
  async enterClassRoom({ commit, dispatch }, { key }) {
    let enterClassInfo = await lesson.classrooms.join({
      key
    })
    enterClassInfo['key'] = key
    commit(ENTER_CLASSROOM, enterClassInfo)
    return Promise.resolve(enterClassInfo)
  },
  async resumeTheClass({ commit, dispatch }) {
    let classroom = await lesson.classrooms
      .currentClass()
      .catch(e => console.error(e))
    if (!classroom) {
      return
    }
    dispatch('resumeClassData', classroom)
  },
  async resumeClassData({ commit, dispatch }, payload) {
    const { learnRecordId, id } = payload
    if (learnRecordId) {
      let _classroom = _.clone(payload)
      _classroom['id'] = learnRecordId
      _classroom['classroomId'] = id
      commit(RESUME_CLASSROOM, _classroom)
    }
  },
  async resumeQuiz(
    {
      commit,
      getters: { lessonQuiz, lessonDetail }
    },
    { id, learnRecords = null }
  ) {
    if (!learnRecords && id) {
      learnRecords = await lesson.classrooms
        .learnRecordsById(id)
        .catch(e => console.error("can't find learnRecords"))
    }
    if (learnRecords && learnRecords.extra.quiz) {
      let quiz = _.get(learnRecords, 'extra.quiz', lessonQuiz)
      let _lessonDetail = _.clone(lessonDetail)
      _lessonDetail.quiz = quiz
      let filterQuiz = _.filter(quiz, ({ answer }) => answer)
      _.forEach(_lessonDetail.modList, q => {
        if (q.cmd === 'Quiz') {
          // let quiz = _.find(filterQuiz, o => o.key === q.data.quiz.data[0].id)
          let quiz = _.find(filterQuiz, o => o.data.title === q.data.quiz.data[0].title)
          if (quiz) {
            q.state = { result: quiz.result, answer: quiz.answer }
          }
        }
      })
      commit(RESUME_QUIZ, _lessonDetail)
    }
    if (learnRecords && learnRecords.extra.status) {
      let status = learnRecords.extra.status.split('')[0]
      commit(SWITCH_DEVICE, status)
    }
  },
  async resumeLearnRecordsId({ commit }, id) {
    commit(CREATE_LEARN_RECORDS_SUCCESS, id)
  },
  async doQuiz(
    {
      commit,
      getters: { lessonDetail }
    },
    { key, question, result, answer }
  ) {
    let _lessonDetail = _.clone(lessonDetail)
    // let index = _.findIndex(_lessonDetail.quiz, o => o.key === key)
    let index = _.findIndex(_lessonDetail.quiz, o => o.data.title === question)
    _lessonDetail.quiz[index].result = result
    _lessonDetail.quiz[index].answer = answer
    commit(DO_QUIZ, _lessonDetail)
  },
  async createLearnRecords(
    {
      commit,
      getters: { learnRecords, lessonUserId }
    },
    { packageId, lessonId, state = 0 }
  ) {
    let res = await lesson.users
      .createLearnRecords({
        packageId,
        lessonId,
        state,
        extra: learnRecords
      })
      .catch(e => console.error(e))
    if (res) {
      commit(CREATE_LEARN_RECORDS_SUCCESS, res.id)
    }
  },
  async uploadSelfLearnRecords(
    {
      getters: { learnRecordsId, learnRecords }
    },
    { packageId, lessonId, state = 0 }
  ) {
    learnRecordsId &&
      (await lesson.users
        .uploadSelfLearnRecords(learnRecordsId, {
          packageId,
          lessonId,
          state,
          extra: learnRecords
        })
        .catch(e => console.error(e)))
  },
  async uploadLearnRecords(context, state = 0) {
    const {
      getters: { classId, learnRecords }
    } = context
    const { username, name } = learnRecords
    if (username && name) {
      await lesson.classrooms.uploadLearnRecords({
        classId,
        learnRecords,
        state
      })
    }
  },
  async uploadVisitorLearnRecords(
    {
      getters: { visitorInfo, learnRecords }
    },
    { state = 0 }
  ) {
    const { token, classId, name, username } = visitorInfo
    learnRecords.username = username
    learnRecords.name = name || username
    learnRecords.status = 'p1'
    learnRecords.portrait = ''
    if (token && classId && !_.isNumber(token)) {
      await lesson.visitor.uploadLearnRecords({
        token,
        classId,
        learnRecords,
        state
      })
    }
  },
  async clearLearnRecordsId({ commit }) {
    commit(CLEAR_LEARN_RECORDS_ID)
  },
  async clearLessonData({ commit }) {
    commit(CLEAR_LESSON_DATA)
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
  },
  async checkClassroom({ commit, dispatch }) {
    await lesson.classrooms.currentClass().catch(e => {
      commit(LEAVE_THE_CLASS)
      return Promise.reject(e)
    })
  },
  async changeStatus({ commit }, payload) {
    commit(CHANGE_STATUS, payload)
  },
  async switchDevice({ commit }, payload) {
    commit(SWITCH_DEVICE, payload)
  },
  async saveVisitorInfo({ commit }, payload) {
    commit(LEAVE_THE_CLASS)
    commit(CLEAR_LEARN_RECORDS_ID)
    commit(CLEAR_LESSON_DATA)
    commit(SAVE_VISITOR_INFO, payload)
  },
  async setVisitorNickname({ commit }, nickname) {
    commit(SET_VISITOR_NICKNAME, nickname)
  },
  async clearVisitorInfo({ commit }) {
    commit(CLEAR_VISITOR_INFO)
  },
  async resumeVisitorLearnRecords(
    {
      commit,
      dispatch,
      getters: { visitorInfo }
    },
    id
  ) {
    const { token } = visitorInfo
    let res = await lesson.visitor
      .learnRecordsById(id, token)
      .catch(e => console.error(e))
    let _visitorInfo = _.clone(visitorInfo)
    let username = _.get(res, 'data.extra.username', '')
    let name = _.get(res, 'data.extra.name', '')
    if (username) {
      _visitorInfo.username = username
      _visitorInfo.name = _visitorInfo.name || name || username
      commit(SAVE_VISITOR_INFO, _visitorInfo)
    }
    let quiz = _.get(res.data, 'extra.quiz', '')
    if (quiz) {
      dispatch('resumeQuiz', { learnRecords: res.data })
    }
  }
}
export default actions
