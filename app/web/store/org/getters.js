import _ from 'lodash'
const getters = {
  userinfo: state => state.userinfo,
  getOrgUserCountById: state => ({ id }) => _.get(state.userCounts, id),
  getOrgRestCount: (state, { getOrgUserCountById }) => ({ id }) => {
    let userCounts = getOrgUserCountById({ id })
    if (!userCounts) {
      return
    }
    let { count, teacherCount, studentCount } = userCounts
    return count - teacherCount - studentCount
  },
  isOrgMember: (state, { userinfo }) => Boolean(_.get(userinfo, 'roleId')),
  isTeacher: (sate, { userinfo }) => userinfo.roleId === 2,
  getOrgDetailById: state => ({ id }) => _.get(state.orgsDetailForId, id),
  getOrgDetailByLoginUrl: state => ({ loginUrl }) =>
    _.get(state.orgsDetailForLoginUrl, loginUrl),
  currentOrg: state => state.currentOrg,
  getOrgPackagesById: state => ({ id }) => _.get(state.orgPackages, id),
  getOrgPackagesGraphqlById: state => ({ id }) =>
    _.get(state.orgPackagesGraphql, id),
  getOrgClassesById: state => ({ id }) => _.get(state.orgClasses, id),
  getOrgTeachersById: state => ({ id }) => _.get(state.orgTeachers, id),
  getOrgStudentsById: state => ({ id }) => _.get(state.orgStudents, id),
  howManyDays: state => 0,
  getOrgStudentsByClassId: state => ({ orgId, classId }) =>
    _.get(state.orgStudents, `${orgId}.${classId}`)
}

export default getters
