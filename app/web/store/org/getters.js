import _ from 'lodash'
import Cookies from 'js-cookie'
import jsrsasign from 'jsrsasign'
const getters = {
  tokenUpdateAt: state => state.tokenUpdateAt, // to prevent the cache on token getting
  getToken: state => () => Cookies.get('token'),
  token: (state, { tokenUpdateAt, getToken }) => getToken(tokenUpdateAt),
  userinfo: (state, getters, rootState) => _.get(rootState, 'user.profile'),
  getOrgUserCountById: state => ({ id }) => _.get(state.userCounts, id),
  getOrgRestCount: (state, { getOrgUserCountById }) => ({ id }) => {
    let userCounts = getOrgUserCountById({ id })
    if (!userCounts) {
      return
    }
    let { upperLimit, studentCount } = userCounts
    return upperLimit - studentCount
  },
  roleId: (state, { tokenInfo }) => {
    return tokenInfo.roleId
  },
  tokenOrgId: (state, { tokenInfo }) => {
    return tokenInfo.organizationId
  },
  tokenInfo: (state, { token }) => {
    if (!token) return {}
    return jsrsasign.KJUR.jws.JWS.readSafeJSONString(jsrsasign.b64utoutf8(token.split('.')[1]))
  },
  isCurrentOrgToken: (state, { currentOrgId, tokenOrgId }) => currentOrgId === tokenOrgId,
  isOrgMember: (state, { roleId, isCurrentOrgToken }) => isCurrentOrgToken && Boolean(roleId),
  isAdmin: (sate, { roleId, isCurrentOrgToken }) => isCurrentOrgToken && (roleId & 64) > 0, // eslint-disable-line no-bitwise
  isTeacher: (sate, { roleId, isCurrentOrgToken }) => isCurrentOrgToken && (roleId & 2) > 0, // eslint-disable-line no-bitwise
  isStudent: (sate, { roleId, isCurrentOrgToken }) => isCurrentOrgToken && (roleId & 1) > 0, // eslint-disable-line no-bitwise
  getOrgDetailById: state => ({ id }) => _.get(state.orgsDetailForId, id),
  getOrgDetailByLoginUrl: state => ({ loginUrl }) => _.get(state.orgsDetailForLoginUrl, loginUrl),
  currentOrgHaveExpired: (state, { endTimestamp }) => {
    return Date.now() > endTimestamp
  },
  currentOrgToExpire: (state, { currentOrgHaveExpired, endTimestamp }) => {
    if (currentOrgHaveExpired) {
      return false
    }
    const now = Date.now()
    const oneDay = 1000 * 60 * 60 * 24
    const days = _.ceil(_.divide(_.subtract(endTimestamp, now), oneDay), 2)
    return days <= 20
  },
  endTimestamp: (state, { currentOrg: { endDate } }) => {
    const _endDate = new Date(endDate)
    const year = _endDate.getFullYear()
    const month = _endDate.getMonth() + 1
    const day = _endDate.getDate()
    const endTime = +new Date(`${year}-${month}-${day}`) + 1000 * 60 * 60 * 24 - 1000
    return endTime
  },
  currentOrg: state => state.currentOrg,
  currentOrgId: (state, { currentOrg }) => currentOrg.id,
  getOrgPackagesById: state => ({ id }) => _.get(state.orgPackages, id),
  getOrgPackagesWithLessonById: state => ({ id }) => _.get(state.orgPackagesWithLesson, id),
  getOrgClassesById: state => ({ id }) => _.get(state.orgClasses, id),
  getOrgTeachersById: state => ({ id }) => _.get(state.orgTeachers, id),
  getOrgTeachersByClassId: state => ({ orgId, classId }) => _.get(state.orgTeachers, `${orgId}.${classId}`),
  getOrgStudentsById: state => ({ id }) => _.get(state.orgStudents, id),
  getOrgStudentsByClassId: state => ({ orgId, classId }) => _.get(state.orgStudents, `${orgId}.${classId}`),
  allClassesWithMember: (state, { currentOrgId }) => _.get(state.orgClassesWithMember, currentOrgId),
  orgLessonDetail: state => state.orgLessonDetail,
  orgPackagesDetail: state => state.orgPackagesDetail,
  userOrg: state => state.userOrg,
  orgActiveCodeList: state => state.orgActiveCodeList,
  printCodeList: state => state.printCodeList,
  orgHistoricalClasses: state => state.orgHistoricalClasses,
  expirationDialogVisible: state => state.expirationDialogVisible,
  isFirstView: (state, { currentOrg, userinfo: { id } }) => {
    return !_.includes(_.get(currentOrg, 'extra.visitedList', []), id)
  },
  formsList: state => ({ id }) => _.get(state.orgForms, id),
  getFormDetailById: (state, { formsList, currentOrgId }) => ({ id, orgId }) => {
    orgId = orgId || currentOrgId
    return _.find(formsList({ id: orgId }), formDetail => _.toNumber(formDetail.id) === _.toNumber(id))
  },
  getFormFeedbackById: state => ({ id }) => state.formsFeedback[id],
  currentOrgLogs: (state, { currentOrgId }) => _.get(state.orgLogs, currentOrgId, []),
  getClassEvaluation: state => ({ classId }) => _.get(state.classEvaluations, classId),
  getClassEvaluationList: state => ({ classId }) => _.get(state.classEvaluationList, classId),
  getClassReportByDays: state => ({ days }) => state.orgClassesReport[days],
  getSendedMessages: state => state.sendedMessages || [],
  codeUsedStatus: state => state.codeUsedStatus || {},
  useFormalCodeParams: state => state.useFormalCodeParams,
  reActivatedParams: state => state.reActivatedParams,
  historyStudents: state => state.historyStudents,
  editingForm: state => state.editingForm,
  editingFormQuizzes: (state, { editingForm }) => editingForm.quizzes || [],
}

export default getters
