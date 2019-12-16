import createEndpoint from './common/endpoint'

const endpoint = createEndpoint({
  baseURL: process.env.LESSON_API_PREFIX,
})

const { get, post, put, delete: deleteMethod } = endpoint
const socketMessage = createEndpoint({
  baseURL: process.env.SOCKET_API_PREFIX + '/api/v0/',
})

const lessonOrganizations = {
  login: async ({ organizationName, username, password }) =>
    post('lessonOrganizations/login', { organizationName, username, password }),
  getOrgToken: async ({ orgId }) => get(`lessonOrganizations/token?organizationId=${orgId}`),
  updateOrg: async ({ orgId, orgData }) => put(`lessonOrganizations/${orgId}`, orgData),
  getByName: async ({ name }) => get(`lessonOrganizations/getByName?name=${name}`),
  getOrgPackages: async ({ organizationId }) => get(`lessonOrganizations/packages?organizationId=${organizationId}`),
  getOrgClassPackages: async ({ organizationId, classId }) =>
    get(`lessonOrganizations/packages?organizationId=${organizationId}&classId=${classId}`),
  getOrgClasses: async params => get('lessonOrganizationClasses', { params }),
  getClassAndMembers: async params => get('lessonOrganizations/classAndMembers', { params }),
  getByUrl: async ({ url }) => get(`lessonOrganizations/getByUrl?url=${url}`),
  getClassPackagesById: async params => get('lessonOrganizations/packages', { params }),
  getClassStudentsById: async params => get('lessonOrganizationClassMembers/student', { params }),
  addStudentToClass: async params => post('lessonOrganizationClassMembers', { ...params, roleId: 1 }),
  getOrgStudentPackages: async params => get('lessonOrganizations/packages', { params: { ...params, roleId: 1 } }),
  getOrgStudentPackageDetail: async params => get('lessonOrganizations/packageDetail', { params }),
  getUserOrganizations: async () => get('lessonOrganizations'),
  searchOrganizations: async params => post('lessonOrganizations/search', params),
  createBatchCode: async params => post('lessonOrganizationActivateCodes', params),
  getOrgActivateCodes: async params => post('lessonOrganizationActivateCodes/search', params),
  joinOrganization: async params => post('lessonOrganizationActivateCodes/activate', params),
  checkUserInValid: async params => get('lessonOrganizations/checkUserInvalid', { params }),
  getOrgPackagesWithLessons: async params => get('lessonOrganizations/getOrgPackages', { params }),
  sendSocketMessage: async params => socketMessage.post('app/msg', params),
}
const lessonOrganizationClasses = {
  getClasses: async ({ organizationId }) => get(`lessonOrganizationClasses?organizationId=${organizationId}`),
  createClasses: async ({ organizationId, name, packages }) =>
    post('lessonOrganizationClasses', {
      organizationId,
      name,
      packages,
    }),
  getClassPackageDetail: async params => get('lessonOrganizations/packageDetail', { params }),
  updateClass: async ({ organizationId, classId, name, begin, end, packages }) =>
    put(`lessonOrganizationClasses/${classId}`, {
      organizationId,
      name,
      begin,
      end,
      packages,
    }),
  getHistoryClasses: async params => get('lessonOrganizationClasses/history', { params }),
  getClassLastUpdateProjects: async classId => get(`lessonOrganizationClasses/${classId}/project`),
}

const lessonOrganizationForms = {
  createForm: async ({ formDetail }) => post('lessonOrganizationForms', formDetail),
  getForms: async ({ organizationId }) => post('lessonOrganizationForms/search', { organizationId }),
  updateForm: async ({ formId, formDetail }) => put(`lessonOrganizationForms/${formId}`, formDetail),
  deleteForm: async ({ formId }) => deleteMethod(`lessonOrganizationForms/${formId}`),
  submitForm: async ({ formId, quizzes }) => post(`lessonOrganizationForms/${formId}/submit`, { quizzes }),
  getSubmitList: async ({ formId }) => get(`lessonOrganizationForms/${formId}/submit`),
  updateSubmit: async ({ formId, submitId, submitData }) =>
    put(`lessonOrganizationForms/${formId}/submit/${submitId}`, submitData),
}

const organizations = {
  changePwd: async ({ classId, memberId, password }) =>
    post('organizations/changepwd', { classId, memberId, password }),
  getLogs: async searchParams => post('organizations/log', searchParams),
  getMemberCountByOrgId: async params => get('lessonOrganizations/getMemberCountByRole', { params }),
}

const lessonOrganizationClassMembers = {
  getTeachers: async ({ organizationId }) =>
    get(`lessonOrganizationClassMembers/teacher?organizationId=${organizationId}`),
  getStudents: async ({ organizationId }) =>
    get(`lessonOrganizationClassMembers/student?organizationId=${organizationId}`),
  getStudentsByClassId: async ({ organizationId, classId }) =>
    get(`lessonOrganizationClassMembers/student?organizationId=${organizationId}&classId=${classId}`),
  getTeachersByClassId: async ({ organizationId, classId }) =>
    get(`lessonOrganizationClassMembers/teacher?organizationId=${organizationId}&classId=${classId}`),
  createClassMember: async params => post('lessonOrganizationClassMembers', params),
  getClassStudentsById: async params => get('lessonOrganizationClassMembers/student', { params }),
  removeMemberFromClass: async ({ id, roleId }) =>
    deleteMethod(`lessonOrganizationClassMembers/${id}?roleId=${roleId}`),
}

const evaluationReports = {
  sendSms: async ({ cellphone }) => post('evaluationReports/sendSms', { cellphone }),
  getEvaluationCommentList: async params => get('evaluationReports/evaluationCommentList', { params }),
  getClassEvaluationReport: async params => get('evaluationReports', { params }),
  createClassEvaluationReport: async params => post('evaluationReports', params),
  deleteClassEvaluationReport: async id => deleteMethod(`evaluationReports/${id}`),
  getEvaluationReportDetail: async ({ reportId, params = {} }) => get(`evaluationReports/${reportId}`, { params }),
  commentEvaluationReport: async params => post('evaluationReports/userReport', params),
  updateCommentEvaluationReport: async ({ userReportId, ...params }) =>
    put(`evaluationReports/userReport/${userReportId}`, params),
  updateEvaluationReport: async ({ reportId, ...params }) => put(`evaluationReports/${reportId}`, params),
  deleteEvaluationReportComment: async id => deleteMethod(`evaluationReports/userReport/${id}`),
  getEvaluationReportCommentDetail: async ({ userReportId, ...params }) =>
    get(`evaluationReports/userReport/${userReportId}`, { params }),
  reportToParent: async params => post('evaluationReports/reportToParent', params),
  getOrgClassReport: async params => get('evaluationReports/orgClassReport', { params }),
  getClassReportByClassId: async params => get('evaluationReports/classReport', { params }),
  getEvaluationReportStatistics: async params => get('evaluationReports/statistics', { params }),
}

const users = {
  sendSms: async ({ cellphone }) => post('users/sendSms', { cellphone }),
  verifyCode: async ({ cellphone, verifCode }) => post('users/verifyCode', { cellphone, verifCode }),
  updateParentPhoneNum: async ({ parentPhoneNum, verifCode, newParentPhoneNum, newVerifCode }) =>
    put('users/parentPhoneNum', {
      parentPhoneNum,
      verifCode,
      newParentPhoneNum,
      newVerifCode,
    }),
  getStudentInfo: params => get('users/userInfo', { params }),
  getUserinfo: async () => get('users/userInfo'),
  updateUserinfo: async userinfo => put('users/userInfo', userinfo),
}

export const messages = {
  createNewMessage: async newMessageData => post('messages', newMessageData),
  getSendedMessage: async params => get('messages', { params }),
  getMessages: async (params = {}) => get('userMessages', { params }),
  signMessages: async ids => put('userMessages/status', { ids }),
  getUnreadList: async () => get('userMessages/unReadCount'),
  getMessageIndex: async params => get('userMessages/indexOfMessage', { params }),
}

export const lessonOrganizationActivateCodes = {
  getUsedStatus: async () => get('lessonOrganizationActivateCodes/usedStatus'),
  setInvalid: async ids => put('lessonOrganizationActivateCodes/invalid', { ids }),
}

export default {
  organizations,
  lessonOrganizations,
  lessonOrganizationClasses,
  lessonOrganizationClassMembers,
  lessonOrganizationForms,
  users,
  evaluationReports,
  messages,
  lessonOrganizationActivateCodes,
}
