import createEndpoint from './common/endpoint'

const endpoint = createEndpoint({
  baseURL: process.env.LESSON_API_PREFIX
})

const { get, post, put, delete: deleteMethod } = endpoint
const socketMessage = createEndpoint({
  baseURL: process.env.SOCKET_API_PREFIX + '/api/v0/'
})

const lessonOrganizations = {
  login: async ({ organizationName, username, password }) =>
    post('lessonOrganizations/login', { organizationName, username, password }),
  getOrgToken: async ({ orgId }) =>
    get(`lessonOrganizations/token?organizationId=${orgId}`),
  updateOrg: async ({ orgId, orgData }) =>
    put(`lessonOrganizations/${orgId}`, orgData),
  getByName: async ({ name }) =>
    get(`lessonOrganizations/getByName?name=${name}`),
  getOrgPackages: async ({ organizationId }) =>
    get(`lessonOrganizations/packages?organizationId=${organizationId}`),
  getOrgClassPackages: async ({ organizationId, classId }) =>
    get(
      `lessonOrganizations/packages?organizationId=${organizationId}&classId=${classId}`
    ),
  getOrgClasses: async params => get('lessonOrganizationClasses', { params }),
  getByUrl: async ({ url }) => get(`lessonOrganizations/getByUrl?url=${url}`),
  getClassPackagesById: async params =>
    get('lessonOrganizations/packages', { params }),
  getClassStudentsById: async params =>
    get('lessonOrganizationClassMembers/student', { params }),
  addStudentToClass: async params =>
    post('lessonOrganizationClassMembers', { ...params, roleId: 1 }),
  getOrgStudentPackages: async params =>
    get('lessonOrganizations/packages', { params: { ...params, roleId: 1 } }),
  getOrgStudentPackageDetail: async params =>
    get('lessonOrganizations/packageDetail', { params }),
  getUserOrganizations: async () => get('lessonOrganizations'),
  searchOrganizations: async params =>
    post('lessonOrganizations/search', params),
  createBatchCode: async params =>
    post('lessonOrganizationActivateCodes', params),
  getOrgActivateCodes: async params =>
    post('lessonOrganizationActivateCodes/search', params),
  joinOrganization: async params =>
    post('lessonOrganizationActivateCodes/activate', params),
  sendSocketMessage: async params => socketMessage.post('app/msg', params)
}
const lessonOrganizationClasses = {
  getClasses: async ({ organizationId }) =>
    get(`lessonOrganizationClasses?organizationId=${organizationId}`),
  createClasses: async ({ organizationId, name, begin, end, packages }) =>
    post('lessonOrganizationClasses', {
      organizationId,
      name,
      begin,
      end,
      packages
    }),
  getClassPackageDetail: async params =>
    get('lessonOrganizations/packageDetail', { params }),
  updateClass: async ({
    organizationId,
    classId,
    name,
    begin,
    end,
    packages
  }) =>
    put(`lessonOrganizationClasses/${classId}`, {
      organizationId,
      name,
      begin,
      end,
      packages
    }),
  getHistoryClasses: async params =>
    get('lessonOrganizationClasses/history', { params }),
  getClassLastUpdateProjects: async classId => get(`lessonOrganizationClasses/${classId}/project`)
}

const lessonOrganizationForms = {
  createForm: async ({ formDetail }) =>
    post('lessonOrganizationForms', formDetail),
  getForms: async ({ organizationId }) =>
    post('lessonOrganizationForms/search', { organizationId }),
  updateForm: async ({ formId, formDetail }) =>
    put(`lessonOrganizationForms/${formId}`, formDetail),
  deleteForm: async ({ formId }) =>
    deleteMethod(`lessonOrganizationForms/${formId}`),
  submitForm: async ({ formId, quizzes }) =>
    post(`lessonOrganizationForms/${formId}/submit`, { quizzes }),
  getSubmitList: async ({ formId }) =>
    get(`lessonOrganizationForms/${formId}/submit`),
  updateSubmit: async ({ formId, submitId, submitData }) =>
    put(`lessonOrganizationForms/${formId}/submit/${submitId}`, submitData)
}

const organizations = {
  changePwd: async ({ classId, memberId, password }) =>
    post('organizations/changepwd', { classId, memberId, password }),
  getLogs: async searchParams => post('organizations/log', searchParams)
}

const lessonOrganizationClassMembers = {
  getTeachers: async ({ organizationId }) =>
    get(
      `lessonOrganizationClassMembers/teacher?organizationId=${organizationId}`
    ),
  getStudents: async ({ organizationId }) =>
    get(
      `lessonOrganizationClassMembers/student?organizationId=${organizationId}`
    ),
  getStudentsByClassId: async ({ organizationId, classId }) =>
    get(
      `lessonOrganizationClassMembers/student?organizationId=${organizationId}&classId=${classId}`
    ),
  getTeachersByClassId: async ({ organizationId, classId }) =>
    get(
      `lessonOrganizationClassMembers/teacher?organizationId=${organizationId}&classId=${classId}`
    ),
  createClassMember: async ({
    organizationId,
    classId,
    classIds,
    memberName,
    realname,
    roleId
  }) =>
    post('lessonOrganizationClassMembers', {
      organizationId,
      classId,
      classIds,
      memberName,
      realname,
      roleId
    }),
  getClassStudentsById: async params =>
    get('lessonOrganizationClassMembers/student', { params }),
  removeMemberFromClass: async ({ id, roleId }) =>
    deleteMethod(`lessonOrganizationClassMembers/${id}?roleId=${roleId}`)
}

export default {
  organizations,
  lessonOrganizations,
  lessonOrganizationClasses,
  lessonOrganizationClassMembers,
  lessonOrganizationForms
}