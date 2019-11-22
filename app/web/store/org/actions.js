import Cookies from 'js-cookie'
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
import { keepwork, lesson } from '@/api'
import { props } from './mutations'

const {
  GET_ORG_COUNT_SUCCESS,
  SET_TOKEN_UPDATE_AT,
  GET_ORG_SUCCESS,
  SET_CURRENT_ORG,
  GET_ORG_PACKAGES_SUCCESS,
  GET_ORG_PACKAGES_WITH_LESSON_SUCCESS,
  GET_ORG_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASSES_WITH_MEMBER_SUCCESS,
  GET_ORG_TEACHERS_SUCCESS,
  GET_ORG_STUDENTS_SUCCESS,
  GET_USER_ORG_SUCCESS,
  GET_ORG_ACTIVATE_CODE_SUCCESS,
  SET_PRINT_CODE_LIST,
  GET_HISTORY_CLASSES_SUCCESS,
  TOGGLE_EXPIRATION_DIALOG,
  GET_FORMS_SUCCESS,
  GET_FEEDBACK_SUCCESS,
  GET_LOGS_SUCCESS,
  GET_CLASS_EVALUATION_SUCCESS,
  GET_CLASS_EVALUATION_LIST_SUCCESS,
  GET_ORG_CLASS_REPORT_SUCCESS,
} = props

const actions = {
  async login(context, { organizationName, username, password }) {
    let { dispatch } = context
    const userinfo = await keepwork.lessonOrganizations
      .login({
        organizationName,
        username,
        password,
      })
      .catch(error => {
        return Promise.reject(error.response)
      })
    if (userinfo) {
      let { token } = userinfo
      Cookies.set('token', token)
      dispatch('setTokenUpdateAt')
      window.localStorage.setItem('satellizer_token', token)
      await dispatch('user/getProfile', { forceLogin: false, useCache: false }, { root: true })
    }
    return userinfo
  },
  setTokenUpdateAt({ commit }) {
    commit(SET_TOKEN_UPDATE_AT)
  },
  async getOrgToken(context, { orgId }) {
    let token = await keepwork.lessonOrganizations.getOrgToken({ orgId }).catch()
    return token
  },
  async refreshToken({ dispatch, commit, getters: { currentOrgId } }) {
    const token = await dispatch('getOrgToken', { orgId: currentOrgId })
    Cookies.set('token', token)
    commit(SET_TOKEN_UPDATE_AT)
  },
  async getCurrentOrgUserCounts({ dispatch, getters: { currentOrg } }) {
    await dispatch('getOrgUserCountsByGraphql', { orgId: currentOrg.id })
  },
  async getOrgUserCountsByGraphql({ commit, getters: { currentOrgId } }) {
    let userCounts = await keepwork.organizations.getMemberCountByOrgId({
      organizationId: currentOrgId,
    })
    commit(GET_ORG_COUNT_SUCCESS, { orgId: currentOrgId, userCounts })
  },
  async getOrgDetailByLoginUrl(context, { orgLoginUrl }) {
    let { commit } = context
    let orgDetail = await keepwork.lessonOrganizations.getByUrl({
      url: orgLoginUrl,
    })
    commit(GET_ORG_SUCCESS, { orgDetail })
    return orgDetail
  },
  setCurrentOrg(context, { orgDetail }) {
    let { commit } = context
    commit(SET_CURRENT_ORG, { orgDetail })
  },
  async getOrgPackages(context, { organizationId }) {
    let { commit } = context
    let orgPackages = await keepwork.lessonOrganizations.getOrgPackages({
      organizationId,
    })
    commit(GET_ORG_PACKAGES_SUCCESS, { organizationId, orgPackages })
  },
  async getOrgPackagesWithLessons({ commit }, { organizationId }) {
    let result = await keepwork.lessonOrganizations.getOrgPackagesWithLessons({
      organizationId,
    })
    commit(GET_ORG_PACKAGES_WITH_LESSON_SUCCESS, {
      organizationId,
      result,
    })
  },
  async getOrgClassPackages(context, { organizationId, classId }) {
    let classPackages = await keepwork.lessonOrganizations.getOrgClassPackages({
      organizationId,
      classId,
    })
    return classPackages
  },
  async getOrgPackageDetail({ commit }, { packageId, classId = 0, roleId = 64 }) {
    const packageDetail = await keepwork.lessonOrganizations.getOrgStudentPackageDetail({ packageId, classId, roleId })
    commit(GET_ORG_PACKAGE_DETAIL_SUCCESS, { packageId, packageDetail })
    return packageDetail
  },
  async getLessonDetail({ commit, dispatch, getters }, { packageId, lessonId }) {
    let [res, detail] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId }),
      dispatch('getOrgPackageDetail', { packageId }),
    ])
    const { orgPackagesDetail } = getters
    const packageInfo = _.find(
      _.get(orgPackagesDetail, [packageId, 'lessons'], []),
      item => item.lessonId === _.toNumber(lessonId),
    )
    detail.packageIndex = _.get(packageInfo, 'lessonNo', '')
    const modList = Parser.buildBlockList(res.content)
    const courseware = Parser.buildBlockList(res.courseware)
    const quiz = modList
      .filter(item => item.cmd === 'Quiz' && !_.isEmpty(item.data))
      .map(({ data: { quiz: { data } } }) => ({
        key: data[0].id,
        data: data[0],
        result: null,
        answer: null,
      }))
    commit(GET_LESSON_CONTENT_SUCCESS, {
      lessonId,
      content: res.content,
    })
    commit(SAVE_LESSON_DETAIL, {
      lessonId,
      lesson: detail,
      quiz,
      modList,
      courseware,
    })
  },
  async getOrgClassList(context, { organizationId }) {
    let { commit } = context
    let orgClasses = await keepwork.lessonOrganizationClasses.getClasses({
      organizationId,
    })
    commit(GET_ORG_CLASSES_SUCCESS, { organizationId, orgClasses })
  },
  async getCurrentOrgClassList({ commit, getters: { currentOrgId: organizationId } }) {
    const orgClasses = await keepwork.lessonOrganizationClasses.getClasses({
      organizationId,
    })
    commit(GET_ORG_CLASSES_SUCCESS, { organizationId, orgClasses })
  },
  async getClassesWithMember({ commit, getters: { currentOrgId: organizationId } }, _roleId) {
    let classes = await keepwork.lessonOrganizations.getClassAndMembers({ _roleId })
    commit(GET_CLASSES_WITH_MEMBER_SUCCESS, { classes, organizationId })
  },
  async createNewClass({ dispatch }, { organizationId, name, begin, end, packages }) {
    let result = await keepwork.lessonOrganizationClasses
      .createClasses({ organizationId, name, begin, end, packages })
      .catch(error => {
        return Promise.reject(error.response)
      })
    await dispatch('getOrgClassList', { organizationId })
    return Promise.resolve(result)
  },
  async updateClass({ dispatch }, { organizationId, classId, name, begin, end, packages }) {
    await keepwork.lessonOrganizationClasses
      .updateClass({ organizationId, classId, name, begin, end, packages })
      .catch(error => {
        return Promise.reject(error.response)
      })
    await dispatch('getOrgClassList', { organizationId })
  },
  async getOrgTeacherList(context, { organizationId, classId }) {
    let { commit } = context
    let orgTeachers = classId
      ? await keepwork.lessonOrganizationClassMembers.getTeachersByClassId({
        organizationId,
        classId,
      })
      : await keepwork.lessonOrganizationClassMembers.getTeachers({
        organizationId,
      })
    commit(GET_ORG_TEACHERS_SUCCESS, { organizationId, orgTeachers, classId })
  },
  async checkIsTeacherValid(context, { organizationId, username }) {
    return await keepwork.lessonOrganizations.checkUserInValid({
      organizationId,
      username,
    })
  },
  async createNewMember(context, { organizationId, classId, classIds, memberName, realname, roleId, parentPhoneNum }) {
    let { dispatch } = context
    let result = await keepwork.lessonOrganizationClassMembers
      .createClassMember({
        organizationId,
        classId,
        classIds,
        memberName,
        parentPhoneNum,
        realname,
        roleId,
      })
      .catch(error => {
        return Promise.reject(error.response)
      })
    await dispatch('getOrgUserCountsByGraphql', {
      orgId: organizationId,
    })
    return Promise.resolve(result)
  },
  async removeMemberFromClass(context, { id, roleId }) {
    let {
      dispatch,
      getters: { currentOrg },
    } = context
    await keepwork.lessonOrganizationClassMembers.removeMemberFromClass({ id, roleId }).catch(error => {
      return Promise.reject(error.response)
    })
    await dispatch('getOrgUserCountsByGraphql', {
      orgId: currentOrg.id,
    })
  },
  async getOrgStudentList(context, { organizationId, classId }) {
    let { commit } = context
    let result = classId
      ? await keepwork.lessonOrganizationClassMembers.getStudentsByClassId({
        organizationId,
        classId,
      })
      : await keepwork.lessonOrganizationClassMembers.getStudents({
        organizationId,
      })
    let orgStudents = result.rows
    commit(GET_ORG_STUDENTS_SUCCESS, { organizationId, orgStudents, classId })
  },
  async updateOrg(context, { orgLoginUrl, orgId, orgData }) {
    let { dispatch } = context
    await keepwork.lessonOrganizations.updateOrg({ orgId, orgData })
    let orgDetail = await dispatch('getOrgDetailByLoginUrl', { orgLoginUrl })
    await dispatch('setCurrentOrg', { orgDetail })
  },
  async getUserOrg({ commit }) {
    await keepwork.lessonOrganizations
      .getUserOrganizations()
      .then(org => {
        commit(GET_USER_ORG_SUCCESS, org)
      })
      .catch(err => {
        console.error('err', err)
      })
  },
  async createBatchCode({ dispatch, commit }, params) {
    let codeList = await keepwork.lessonOrganizations.createBatchCode(params)
    await dispatch('getOrgActivateCodes')
    commit(SET_PRINT_CODE_LIST, codeList)
    return codeList
  },
  async getOrgActivateCodes({ commit }, params) {
    await keepwork.lessonOrganizations
      .getOrgActivateCodes(params)
      .then(codeList => {
        commit(GET_ORG_ACTIVATE_CODE_SUCCESS, codeList)
      })
      .catch(err => {
        console.error(err)
      })
  },
  async getHistoryClasses({ commit, getters: { orgHistoricalClasses } }, { cache = false, params } = {}) {
    if (!(cache && !_.isEmpty(orgHistoricalClasses))) {
      await keepwork.lessonOrganizationClasses
        .getHistoryClasses(params)
        .then(res => {
          commit(GET_HISTORY_CLASSES_SUCCESS, res)
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  toggleExpirationDialogVisible({ commit }, status) {
    commit(TOGGLE_EXPIRATION_DIALOG, status)
  },
  checkCurrentOrgExpire(
    { dispatch, getters: { currentOrgToExpire, currentOrgHaveExpired } },
    { haveExpired = true, toExpire = true } = {},
  ) {
    if ((haveExpired && currentOrgHaveExpired) || (toExpire && currentOrgToExpire)) {
      dispatch('toggleExpirationDialogVisible', true)
      return true
    }
    return false
  },
  async checkFirstView({ getters: { currentOrg, userinfo } }) {
    const { id: userID } = userinfo
    const { extra, id: orgId, loginUrl: orgLoginUrl } = currentOrg
    const visitedList = _.get(extra, 'visitedList', [])
    const isFirstView = !_.includes(visitedList, userID)
    const newVisitedList = _.uniq([...visitedList, userID])
    if (isFirstView) {
      keepwork.lessonOrganizations.updateOrg({
        orgId,
        orgData: { extra: { ...extra, visitedList: newVisitedList } },
      })
    }
    return isFirstView
  },
  async createForm({ dispatch, getters }, formDetail) {
    let { currentOrgId } = getters
    let result = await keepwork.lessonOrganizationForms.createForm({
      formDetail: {
        ...formDetail,
        organizationId: currentOrgId,
      },
    })
    dispatch('getForms', {})
    return result
  },
  async getForms({ commit, getters }, { organizationId }) {
    let { currentOrgId } = getters
    organizationId = organizationId || currentOrgId
    let forms = await keepwork.lessonOrganizationForms.getForms({
      organizationId,
    })
    commit(GET_FORMS_SUCCESS, { organizationId, forms })
  },
  async updateForm({ dispatch }, { formId, formDetail }) {
    await keepwork.lessonOrganizationForms.updateForm({
      formId,
      formDetail,
    })
    dispatch('getForms', {})
  },
  async deleteForm({ dispatch }, { formId }) {
    await keepwork.lessonOrganizationForms.deleteForm({
      formId,
    })
    dispatch('getForms', {})
  },
  async submitForm({ dispatch }, { formId, quizzes }) {
    await keepwork.lessonOrganizationForms.submitForm({ formId, quizzes })
  },
  async getSubmitList({ commit }, { formId }) {
    let result = await keepwork.lessonOrganizationForms.getSubmitList({
      formId,
    })
    let submitList = result.rows
    commit(GET_FEEDBACK_SUCCESS, { formId, submitList })
  },
  async updateSubmit({ dispatch }, { formId, submitId, submitData }) {
    await keepwork.lessonOrganizationForms.updateSubmit({
      formId,
      submitId,
      submitData,
    })
    dispatch('getSubmitList', { formId })
  },
  async changePwd(context, { classId, memberId, password }) {
    await keepwork.organizations
      .changePwd({ classId, memberId, password })
      .then(() => {
        return Promise.resolve()
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  async getSearchedLogs(
    { commit, getters: { currentOrgId } },
    { username, type, description, createdAt, xPage, xPerPage, xOrder },
  ) {
    let params = {}
    if (username) params['username'] = username
    if (type) params['type'] = type
    if (description) params['description'] = description
    if (createdAt) params['createdAt'] = createdAt
    if (xPage) params['x-page'] = xPage
    if (xPerPage) params['x-per-page'] = xPerPage
    if (xOrder) params['x-order'] = xOrder
    let result = await keepwork.organizations.getLogs(params)
    commit(GET_LOGS_SUCCESS, { orgId: currentOrgId, result })
  },
  async sendSms(context, { cellphone }) {
    return await keepwork.users.sendSms({ cellphone })
  },
  async getClassEvaluation({ commit }, { classId, days }) {
    let result = await keepwork.evaluationReports.getClassReportByClassId({
      classId,
      days,
    })
    commit(GET_CLASS_EVALUATION_SUCCESS, { classId, result })
  },
  async getClassEvaluationList({ commit }, { classId, name, type, roleId, days }) {
    let result = await keepwork.evaluationReports.getClassEvaluationReport({
      classId,
      name,
      type,
      roleId,
      days,
    })
    commit(GET_CLASS_EVALUATION_LIST_SUCCESS, { classId, result })
  },
  async getOrgClassReport({ commit }, { days }) {
    let result = await keepwork.evaluationReports.getOrgClassReport({ days })
    commit(GET_ORG_CLASS_REPORT_SUCCESS, { days, result })
  },
  async createNewMessage({ dispatch }, newMessageData) {
    await keepwork.messages.createNewMessage(newMessageData)
  },
}

export default actions
