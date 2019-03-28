import _ from 'lodash'
import Cookies from 'js-cookie'
import jsrsasign from 'jsrsasign'
const getters = {
  token: state => Cookies.get('token'),
  userinfo: (state, getters, rootState) => _.get(rootState, 'user.profile'),
  getOrgUserCountById: state => ({ id }) => _.get(state.userCounts, id),
  getOrgRestCount: (state, { getOrgUserCountById }) => ({ id }) => {
    let userCounts = getOrgUserCountById({ id })
    if (!userCounts) {
      return
    }
    let { count, teacherCount, studentCount } = userCounts
    return count - teacherCount - studentCount
  },
  roleId: (state, { token }) => {
    if (!token) return
    let { roleId } = jsrsasign.KJUR.jws.JWS.readSafeJSONString(
      jsrsasign.b64utoutf8(token.split('.')[1])
    )
    return roleId
  },
  isOrgMember: (state, { roleId }) => Boolean(roleId),
  isTeacher: (sate, { roleId }) => roleId === 2,
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
  getOrgStudentsByClassId: state => ({ orgId, classId }) =>
    _.get(state.orgStudents, `${orgId}.${classId}`)
}

export default getters
