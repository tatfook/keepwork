import { props } from './mutations'
import { keepwork, lesson } from '@/api'
const { graphql } = keepwork
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
const { lessonOrganizations } = keepwork

const {
  GET_ORG_CLASSES_SUCCESS,
  GET_ORG_PACKAGE_DETAIL_SUCCESS,
  GET_ORG_PACKAGES_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  DO_QUIZ,
  CREATE_LEARN_RECORDS_SUCCESS,
  RESUME_QUIZ,
  ENTER_CLASSROOM,
  RESUME_CLASSROOM,
  LEAVE_THE_CLASS,
  GET_TEACHING_LESSON_SUCCESS
} = props

const actions = {
  async getOrgClasses({ commit, getters: { orgClasses } }, { cache = false } = {}) {
    if (!(cache && !_.isEmpty(orgClasses))) {
      const classes = await lessonOrganizations.getOrgClasses()
      commit(GET_ORG_CLASSES_SUCCESS, classes)
    }
  },
  async getOrgPackages({ commit }) {
    const orgPackages = await lessonOrganizations.getOrgStudentPackages()
    commit(GET_ORG_PACKAGES_SUCCESS, orgPackages)
  },
  async getOrgPackageDetail({ commit }, { packageId }) {
    const packageDetail = await lessonOrganizations.getOrgStudentPackageDetail({ packageId })
    commit(GET_ORG_PACKAGE_DETAIL_SUCCESS, { packageId, packageDetail })
    return packageDetail
  },
  async getLessonDetail({ commit }, { packageId, lessonId }) {
    let [ res, detail ] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId })
    ])

    let modList = Parser.buildBlockList(res.content)
    let quiz = modList
      .filter(item => item.cmd === 'Quiz' && !_.isEmpty(item.data))
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
  async doQuiz({ commit, getters: { orgLessonDetail } }, { key, question, result, answer }) {
    let _lessonDetail = _.clone(orgLessonDetail)
    let index = _.findIndex(_lessonDetail.quiz, o => o.data.title === question)
    _lessonDetail.quiz[index].result = result
    _lessonDetail.quiz[index].answer = answer
    commit(DO_QUIZ, _lessonDetail)
  },
  async uploadSelfLearnRecords({ getters: { learnRecordsId, learnRecords } }, { packageId, lessonId, state = 0 }) {
    if (learnRecordsId) {
      await lesson.users
        .uploadSelfLearnRecords(learnRecordsId, {
          packageId,
          lessonId,
          state,
          extra: learnRecords
        })
        .catch(e => console.error(e))
    }
  },
  async createLearnRecords({ commit, getters: { learnRecords, lessonUserId } }, { packageId, lessonId, state = 0 }) {
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
  resumeLearnRecordsId({ commit }, id) {
    commit(CREATE_LEARN_RECORDS_SUCCESS, id)
  },
  async resumeQuiz({ commit, getters: { lessonQuiz, orgLessonDetail } }, { id, learnRecords = null }) {
    if (!learnRecords && id) {
      learnRecords = await lesson.classrooms
        .learnRecordsById(id)
        .catch(e => console.error("can't find learnRecords"))
    }
    if (learnRecords && learnRecords.extra.quiz) {
      let quiz = _.get(learnRecords, 'extra.quiz', lessonQuiz)
      let _lessonDetail = _.clone(orgLessonDetail)
      _lessonDetail.quiz = quiz
      let filterQuiz = _.filter(quiz, ({ answer }) => answer)
      _.forEach(_lessonDetail.modList, q => {
        if (q.cmd === 'Quiz') {
          let quiz = _.find(filterQuiz, o => o.data.title === _.get(q, 'data.quiz.data[0].title', ''))
          if (quiz) {
            q.state = { result: quiz.result, answer: quiz.answer }
          }
        }
      })
      commit(RESUME_QUIZ, _lessonDetail)
    }
  },
  async enterClassroom({ commit }, { key }) {
    const classInfo = await lesson.classrooms.join({ key })
    commit(ENTER_CLASSROOM, { ...classInfo, key })
    return classInfo
  },
  async resumeClassroom({ dispatch }) {
    try {
      const classroom = await lesson.classrooms.currentClass()
      if (classroom) {
        dispatch('resumeClassData', classroom)
      }
    } catch (error) {
      console.error(error)
    }
  },
  async resumeClassData({ commit }, payload) {
    const { learnRecordId, id } = payload
    if (learnRecordId) {
      let _classroom = _.clone(payload)
      _classroom['id'] = learnRecordId
      _classroom['classroomId'] = id
      commit(RESUME_CLASSROOM, _classroom)
    }
  },
  async uploadLearnRecords({ getters: { classId, learnRecords } }, state = 0) {
    const { username, name } = learnRecords
    if (username && name) {
      await lesson.classrooms.uploadLearnRecords({
        classId,
        learnRecords,
        state
      })
    }
  },
  async leaveTheClass({ commit, dispatch }) {
    await lesson.classrooms.leave()
    commit(LEAVE_THE_CLASS)
  },
  async getTeachingLesson({ commit, rootGetters: { 'org/userinfo': { username, organizationId } } }) {
    const res = await graphql.getQueryResult({
      query:
				'query($organizationId: Int, $userId: Int, $username: String){organizationUser(organizationId: $organizationId, userId: $userId, username: $username) {userId, organizationId, classroom{id,key,state}, organizationClasses{id, classroom{id, packageId, lessonId, state, key, extra}} } }',
      variables: {
        organizationId,
        username
      }
    })
    const organizationClasses = _.filter(_.get(res, 'organizationUser.organizationClasses', []), item => item.classroom)
    const teachingLesson = _.map(organizationClasses, item => {
      const { extra = {}, ...reset } = item.classroom
      return {
        id: item.id,
        ...extra,
        ...reset
      }
    })
    commit(GET_TEACHING_LESSON_SUCCESS, teachingLesson)
  },
  async checkClassroom({ commit, dispatch }) {
    await lesson.classrooms.currentClass().catch(e => {
      commit(LEAVE_THE_CLASS)
      return Promise.reject(e)
    })
  },
}

export default actions
