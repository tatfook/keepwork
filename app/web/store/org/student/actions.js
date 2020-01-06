import { props } from './mutations'
import { keepwork, lesson } from '@/api'
const {
  graphql,
  lessonOrganizations,
  lessonOrganizationClassMembers,
  lessonOrganizationClasses,
  evaluationReports,
} = keepwork
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
  GET_USER_INFO_SUCCESS,
  SWITCH_SUMMARY,
  GET_MY_TEACHER_SUCCESS,
  GET_MY_CLASSMATE_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS,
  GET_LAST_UPDATE_PROJECTS_SUCCESS,
  GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS,
  GET_EVALUATION_COMMENT_LIST_SUCCESS,
  GET_STUDENT_INFO_SUCCESS,
  GET_ORG_CLASS_REPORT_SUCCESS,
  GET_CLASS_REPORT_STATISTICS_SUCCESS,
  GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS
} = props

const actions = {
  async getEvaluationReportStatistics({ commit }, classId) {
    const report = await evaluationReports.getEvaluationReportStatistics({
      classId
    })
    commit(GET_CLASS_REPORT_STATISTICS_SUCCESS, { classId, report })
    return report
  },
  async getMyTeacher(
    {
      commit,
      rootGetters: { 'org/currentOrgId': currentOrgId }
    },
    classId
  ) {
    const payload = await lessonOrganizationClassMembers.getTeachersByClassId({
      organizationId: currentOrgId,
      classId
    })
    commit(GET_MY_TEACHER_SUCCESS, payload)
  },
  async getMyClassmate(
    {
      commit,
      getters: {
        userInfo: { id }
      },
      rootGetters: { 'org/currentOrgId': currentOrgId }
    },
    classId
  ) {
    const res = await lessonOrganizationClassMembers.getStudentsByClassId({
      organizationId: currentOrgId,
      classId
    })
    const list = _.get(res, 'rows', [])
    const payload = _.filter(list, item => item.memberId !== id)
    commit(GET_MY_CLASSMATE_SUCCESS, payload)
  },
  async getTeacherAndClassmate({ dispatch }, classId) {
    await Promise.all([
      dispatch('getMyTeacher', classId),
      dispatch('getMyClassmate', classId)
    ])
  },
  async getClassPackages({ commit }, classId) {
    const res = await lessonOrganizations.getOrgStudentPackages({ classId })
    commit(GET_CLASS_PACKAGES_SUCCESS, res)
  },
  async getOrgClasses(
    {
      commit,
      getters: { orgClasses }
    },
    { cache = false } = {}
  ) {
    if (!(cache && !_.isEmpty(orgClasses))) {
      const classes = await lessonOrganizations.getOrgClasses({ roleId: 1 })
      commit(GET_ORG_CLASSES_SUCCESS, classes)
      return classes
    }
    return orgClasses
  },
  async getLastUpdateProjects(
    {
      commit,
      getters: {
        myClassmate,
        userInfo: { id }
      }
    },
    params
  ) {
    params = params || {
      'x-order': 'updatedAt-desc',
      'x-per-page': 6,
      'x-page': 1,
      visibility: 0
    }
    const studentIDs = _.concat(_.map(myClassmate, item => item.memberId), id)
    const res = await keepwork.projects.getProjects({
      ...params,
      userId: {
        $in: studentIDs
      }
    })
    commit(GET_LAST_UPDATE_PROJECTS_SUCCESS, res.rows)
    return res
  },
  async getMoreLastUpdateProjects({ commit }, classId) {
    const list = await lessonOrganizationClasses.getClassLastUpdateProjects(
      classId
    )
    commit(GET_MORE_LAST_UPDATE_PROJECTS_SUCCESS, list)
    return list
  },
  async joinOrgClass({ dispatch }, payload) {
    try {
      const { refreshToken = true, ...rest } = payload
      rest.key = rest.key.replace(/ /g, '')
      const res = await lessonOrganizations.joinOrganization(rest)
      await Promise.all([
        dispatch('org/refreshToken', {}, { root: true }),
        dispatch('getStudentInfo'),
        dispatch('getOrgClasses')
      ])
      Message({ type: 'success', message: '加入成功！' })
      return res
    } catch (err) {
      let data = _.get(err, 'response.data', { message: '失败' })
      if (_.isString(data)) {
        data = JSON.parse(data)
      }
      Message({ type: 'error', message: data.message })
      return false
    }
  },
  async recharge({ dispatch }, payload) {
    payload.key = payload.key.replace(/ /g, '')
    try {
      const classIDs = await lessonOrganizationClassMembers.studentRecharge(payload)
      await Promise.all([
        dispatch('getOrgClasses'),
        dispatch('getStudentInfo'),
      ])
      return classIDs
    } catch (error) {
      return Promise.reject(error)
    }

  },
  async getUserInfo({ commit }) {
    const userInfo = await lesson.users.getUserDetail()
    commit(GET_USER_INFO_SUCCESS, userInfo)
  },
  async getOrgPackages(
    {
      commit,
      getters: { orgPackages }
    },
    { cache = false } = {}
  ) {
    if (!(cache && !_.isEmpty(orgPackages))) {
      const packages = await lessonOrganizations.getOrgStudentPackages()
      commit(GET_ORG_PACKAGES_SUCCESS, packages)
    }
  },
  async getOrgPackageDetail({ commit }, { roleId = 1, packageId }) {
    const packageDetail = await lessonOrganizations.getOrgStudentPackageDetail({
      packageId,
      roleId
    })
    commit(GET_ORG_PACKAGE_DETAIL_SUCCESS, { packageId, packageDetail })
    return packageDetail
  },
  async getLessonDetail(
    { commit, dispatch, getters },
    { packageId, lessonId }
  ) {
    let [res, detail] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId }),
      dispatch('getOrgPackageDetail', { packageId })
    ])
    const { orgPackagesDetail } = getters
    const lessons = _.sortBy(_.get(orgPackagesDetail, [packageId, 'lessons'], []), item => item.lessonNo)
    const lessonNo = _.findIndex(
      lessons,
      item => item.lessonId === _.toNumber(lessonId)
    )
    detail.packageIndex = lessonNo + 1
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
  async doQuiz(
    {
      commit,
      getters: { orgLessonDetail }
    },
    { key, question, result, answer }
  ) {
    let _lessonDetail = _.clone(orgLessonDetail)
    let index = _.findIndex(_lessonDetail.quiz, o => o.data.title === question)
    _lessonDetail.quiz[index].result = result
    _lessonDetail.quiz[index].answer = answer
    commit(DO_QUIZ, _lessonDetail)
  },
  async uploadSelfLearnRecords(
    {
      getters: { learnRecordsId, learnRecords }
    },
    { packageId, lessonId, state = 0 }
  ) {
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
  resumeLearnRecordsId({ commit }, id) {
    commit(CREATE_LEARN_RECORDS_SUCCESS, id)
  },
  async resumeQuiz(
    {
      commit,
      getters: { lessonQuiz, orgLessonDetail }
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
      let _lessonDetail = _.clone(orgLessonDetail)
      _lessonDetail.quiz = quiz
      let filterQuiz = _.filter(quiz, ({ answer }) => answer)
      _.forEach(_lessonDetail.modList, q => {
        if (q.cmd === 'Quiz') {
          let quiz = _.find(
            filterQuiz,
            o => o.data.title === _.get(q, 'data.quiz.data[0].title', '')
          )
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
  async resumeClassroom({
    dispatch,
    getters: { orgClasses },
    rootGetters: { 'org/currentOrgId': organizationId }
  }) {
    try {
      const classroom = await lesson.classrooms.currentClass()
      const orgClassIds = _.map(orgClasses, cls => cls.id)
      if (
        classroom.organizationId === organizationId &&
        _.includes(orgClassIds, classroom.classId)
      ) {
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
  async sendSocketMessageToTeacher(
    {
      getters: { classroom }
    },
    record = {}
  ) {
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
    const filterLearnRecords = _.filter(learnRecords.rows, item =>
      _.includes(lessonsID, item.lessonId)
    )
    const lastLearnRecord = _.get(filterLearnRecords, '[0]', {})
    const theLesson = _.find(
      lessons,
      item => item.lessonId === lastLearnRecord.lessonId
    )
    const theLessonIndex = _.findIndex(
      lessons,
      item => item.lessonId === lastLearnRecord.lessonId
    )
    if (lastLearnRecord.state === 0 && !theLesson.isLearned) {
      return theLesson
    }
    if (
      lastLearnRecord.state === 1 &&
      theLesson.isLearned &&
      theLessonIndex + 1 < lessons.length
    ) {
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
  },
  async getEvaluationReportCommentDetail({ commit }, params) {
    const report = await evaluationReports.getEvaluationReportCommentDetail(
      params
    )
    commit(GET_EVALUATION_REPORT_COMMENT_DETAIL_SUCCESS, report)
    return report
  },
  async getEvaluationCommentList({ commit }, { classId }) {
    let result = await keepwork.evaluationReports.getEvaluationCommentList({
      classId
    })
    commit(GET_EVALUATION_COMMENT_LIST_SUCCESS, {
      classId,
      evaluationCommentList: result
    })
  },
  async getStudentInfo({ commit }) {
    let userinfo = await keepwork.users.getUserinfo()
    commit(GET_STUDENT_INFO_SUCCESS, userinfo)
  },
  async updateStudentInfo({ dispatch }, userinfo) {
    try {
      await keepwork.users.updateUserinfo(userinfo)
      dispatch('user/getProfile', { useCache: false }, { root: true })
      dispatch('getStudentInfo')
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async verifyCode(context, { cellphone, verifCode }) {
    return await keepwork.users.verifyCode({ cellphone, verifCode })
  },
  async updateParentPhoneNum(
    context,
    { parentPhoneNum, verifCode, newParentPhoneNum, newVerifCode }
  ) {
    return await keepwork.users.updateParentPhoneNum({
      parentPhoneNum,
      verifCode,
      newParentPhoneNum,
      newVerifCode
    })
  }
}

export default actions
