import { props } from './mutations'
import { keepwork, lesson } from '@/api'
const { graphql, lessonOrganizations, lessonOrganizationClassMembers } = keepwork
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
import { Message } from 'element-ui'

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
  GET_TEACHING_LESSON_SUCCESS,
  GET_USER_INFO_SUCCESS,
  SWITCH_SUMMARY,
  GET_ORG_REAL_NAME_SUCCESS,
  GET_MY_TEACHER_SUCCESS,
  GET_MY_CLASSMATE_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS
} = props

const errMsg = {
  0: '失败,未知错误',
  1: '邀请码已失效',
  2: '无效的邀请码',
  3: '班级已结束',
  4: '班级未开始',
  5: '人数已达上限',
  6: '已经是该班级的学生',
  7: '不是该机构的邀请码'
}

const actions = {
  async getMyTeacher({ commit, rootGetters: { 'org/currentOrgId': currentOrgId } }, classId) {
    const payload = await lessonOrganizationClassMembers.getTeachersByClassId({ organizationId: currentOrgId, classId })
    commit(GET_MY_TEACHER_SUCCESS, payload)
  },
  async getMyClassmate({ commit, getters: { userInfo: { id } }, rootGetters: { 'org/currentOrgId': currentOrgId } }, classId) {
    const res = await lessonOrganizationClassMembers.getStudentsByClassId({ organizationId: currentOrgId, classId })
    const list = _.get(res, 'rows', [])
    const payload = _.filter(list, item => item.memberId !== id)
    commit(GET_MY_CLASSMATE_SUCCESS, payload)
  },
  async getClassPackages({ commit }, classId) {
    const res = await lessonOrganizations.getOrgStudentPackages({ classId })
    console.log(res)
    commit(GET_CLASS_PACKAGES_SUCCESS, res)
  },
  async getOrgClasses({ commit, getters: { orgClasses } }, { cache = false } = {}) {
    if (!(cache && !_.isEmpty(orgClasses))) {
      const classes = await lessonOrganizations.getOrgClasses({ roleId: 1 })
      commit(GET_ORG_CLASSES_SUCCESS, classes)
    }
  },
  async joinOrgClass({ dispatch, rootGetters: { 'org/currentOrg': currentOrg } }, payload) {
    try {
      const { refreshToken = true, ...rest } = payload
      rest.key = rest.key.replace(/ /g, '')
      await lessonOrganizations.joinOrganization(rest)
      await dispatch('org/refreshToken', {}, { root: true })
      await Promise.all([
        dispatch('getOrgPackages'),
        dispatch('getOrgClasses')
      ])
      Message({ type: 'success', message: '加入成功！' })
      return true
    } catch (err) {
      const code = _.get(err, 'response.data.code', 0)
      const message = _.get(errMsg, code, '')
      Message({ type: 'error', message })
      return false
    }
  },
  async getUserInfo({ commit }) {
    const userInfo = await lesson.users.getUserDetail()
    commit(GET_USER_INFO_SUCCESS, userInfo)
  },
  async getUserOrgRealName({ commit, rootGetters: { 'org/currentOrg': { id: organizationId }, 'org/userinfo': { username } } }) {
    const res = await graphql.getQueryResult({
      query:
        'query($organizationId: Int, $userId: Int, $username: String){ organizationUser(organizationId: $organizationId, userId: $userId, username: $username){organizationId, userId, organizationClassMembers{classId, roleId, realname} }}',
      variables: {
        organizationId,
        username
      }
    })
    const orgs = _.filter(_.get(res, 'organizationUser.organizationClassMembers', []), item => {
      const roleId = item.roleId
      const isStudent = (roleId & 1) > 0 // eslint-disable-line no-bitwise
      return (isStudent && item.realname)
    })
    const realName = _.get(orgs, '[0].realname', '')
    commit(GET_ORG_REAL_NAME_SUCCESS, realName)
  },
  async getOrgPackages({ commit, getters: { orgPackages } }, { cache = false } = {}) {
    if (!(cache && !_.isEmpty(orgPackages))) {
      const packages = await lessonOrganizations.getOrgStudentPackages()
      commit(GET_ORG_PACKAGES_SUCCESS, packages)
    }
  },
  async getOrgPackageDetail({ commit }, { roleId = 1, packageId }) {
    const packageDetail = await lessonOrganizations.getOrgStudentPackageDetail({ packageId, roleId })
    commit(GET_ORG_PACKAGE_DETAIL_SUCCESS, { packageId, packageDetail })
    return packageDetail
  },
  async getLessonDetail({ commit, dispatch, getters }, { packageId, lessonId }) {
    let [res, detail] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId }),
      dispatch('getOrgPackageDetail', { packageId })
    ])
    const { orgPackagesDetail } = getters
    const packageInfo = _.find(
      _.get(orgPackagesDetail, [packageId, 'lessons'], []),
      item => item.lessonId === _.toNumber(lessonId)
    )
    detail.packageIndex = _.get(packageInfo, 'lessonNo', '')
    let modList = Parser.buildBlockList(res.courseware)
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
    try {
      const [classInfo, classroom] = await Promise.all([
        lesson.classrooms.join({ key }),
        lesson.classrooms.getClassroomInfo(key)
      ])
      const { userId } = classroom
      commit(ENTER_CLASSROOM, { ...classInfo, userId, state: 1, key })
      return classInfo
    } catch (error) {
      console.error(error)
    }
  },
  async resumeClassroom({ dispatch, getters: { orgClasses }, rootGetters: { 'org/currentOrgId': organizationId } }) {
    try {
      const classroom = await lesson.classrooms.currentClass()
      const orgClassIds = _.map(orgClasses, cls => cls.id)
      if (classroom.organizationId === organizationId && _.includes(orgClassIds, classroom.classId)) {
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
  async uploadLearnRecords({ dispatch, getters: { classId, classroom, learnRecords } }, state = 0) {
    const { username } = learnRecords
    const { userId } = classroom
    const record = {
      classId,
      ...classroom,
      extra: {
        ...learnRecords
      },
      state
    }
    if (username) {
      await lesson.classrooms.uploadLearnRecords({
        classId,
        learnRecords,
        state
      })
      await dispatch('sendSocketMessageToTeacher', record)
    }
  },
  async sendSocketMessageToTeacher({ getters: { classroom } }, record = {}) {
    const { userId = '' } = classroom
    if (userId) {
      await lessonOrganizations.sendSocketMessage({
        userIds: [userId],
        msg: {
          type: 1,
          record
        }
      })
    }
  },
  async leaveTheClass({ commit, dispatch, rootGetters: { 'org/userinfo': userInfo } }) {
    const { username } = userInfo
    await lesson.classrooms.leave()
    await dispatch('sendSocketMessageToTeacher', { leaveClass: true, extra: { username } })
    commit(LEAVE_THE_CLASS)
  },
  async getTeachingLesson({ commit, rootGetters: { 'org/currentOrg': { id: organizationId }, 'org/userinfo': { username } } }) {
    const res = await graphql.getQueryResult({
      query: 'query($organizationId: Int, $userId: Int, $username: String){organizationUser(organizationId: $organizationId, userId: $userId, username: $username) {userId, organizationId, classroom{id, state}, organizationClasses{id,end,roleId, classrooms{id, key, state, packageId, lessonId, extra}} } }',
      variables: {
        organizationId,
        username
      }
    })
    const today = Date.now()
    const organizationClasses = _.filter(_.get(res, 'organizationUser.organizationClasses', []), item => (item.roleId & 1) > 0 && +new Date(item.end) > today) // eslint-disable-line no-bitwise
    const teachingLesson = _.reduce(organizationClasses, (arr, cur) => {
      return [...arr, ...cur.classrooms]
    }, [])
    const result = _.map(teachingLesson, item => {
      const { extra = {}, ...reset } = item
      return {
        id: item.id,
        ...extra,
        ...reset
      }
    })
    commit(GET_TEACHING_LESSON_SUCCESS, result)
  },
  async checkClassroom({ commit, dispatch }) {
    await lesson.classrooms.currentClass().catch(e => {
      commit(LEAVE_THE_CLASS)
      return Promise.reject(e)
    })
  },
  switchSummary({ commit }, flag) {
    commit(SWITCH_SUMMARY, flag)
  },
  async getNextLesson({ commit }, packageId) {
    const [learnRecords, packageDetail] = await Promise.all([
      lesson.lessons.getPackageLearnRecords({ packageId }),
      lessonOrganizations.getOrgStudentPackageDetail({ packageId, roleId: 1 })
    ])
    const lessons = _.sortBy(
      _.get(packageDetail, 'lessons', []),
      lesson => lesson.lessonNo
    )
    if (_.every(lessons, item => !item.isLearned)) {
      return _.get(lessons, '[0]')
    }
    const lessonsID = _.map(lessons, item => item.lessonId)
    const filterLearnRecords = _.filter(learnRecords.rows, item => _.includes(lessonsID, item.lessonId))
    const lastLearnRecord = _.get(filterLearnRecords, '[0]', {})
    const theLesson = _.find(lessons, item => item.lessonId === lastLearnRecord.lessonId)
    const theLessonIndex = _.findIndex(lessons, item => item.lessonId === lastLearnRecord.lessonId)
    if (lastLearnRecord.state === 0 && !theLesson.isLearned) {
      return theLesson
    }
    if (lastLearnRecord.state === 1 && theLesson.isLearned && theLessonIndex + 1 < lessons.length) {
      const nextLesson = lessons[theLessonIndex + 1]
      if (!nextLesson.isLearned) {
        return nextLesson
      }
    }
    const res = _.find(lessons, item => !item.isLearned)
    if (res) {
      return res
    }
    return lessons[0]
  }
}

export default actions
