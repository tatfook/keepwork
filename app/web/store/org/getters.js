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
    let { count, studentCount } = userCounts
    return count - studentCount
  },
  roleId: (state, { token }) => {
    if (!token) return
    let { roleId } = jsrsasign.KJUR.jws.JWS.readSafeJSONString(
      jsrsasign.b64utoutf8(token.split('.')[1])
    )
    return roleId
  },
  isOrgMember: (state, { roleId }) => Boolean(roleId),
  isAdmin: (sate, { roleId }) => (roleId & 64) > 0, // eslint-disable-line no-bitwise
  isTeacher: (sate, { roleId }) => (roleId & 2) > 0, // eslint-disable-line no-bitwise
  isStudent: (sate, { roleId }) => (roleId & 1) > 0, // eslint-disable-line no-bitwise
  getOrgDetailById: state => ({ id }) => _.get(state.orgsDetailForId, id),
  getOrgDetailByLoginUrl: state => ({ loginUrl }) =>
    _.get(state.orgsDetailForLoginUrl, loginUrl),
  currentOrg: state => state.currentOrg,
  currentOrgId: (state, { currentOrg }) => currentOrg.id,
  getOrgPackagesById: state => ({ id }) => _.get(state.orgPackages, id),
  getOrgPackagesGraphqlById: state => ({ id }) =>
    _.get(state.orgPackagesGraphql, id),
  getOrgClassesById: state => ({ id }) => _.get(state.orgClasses, id),
  getOrgTeachersById: state => ({ id }) => _.get(state.orgTeachers, id),
  getOrgStudentsById: state => ({ id }) => _.get(state.orgStudents, id),
  getOrgStudentsByClassId: state => ({ orgId, classId }) =>
    _.get(state.orgStudents, `${orgId}.${classId}`),
  orgLessonDetail: state => state.orgLessonDetail,
  orgPackagesDetail: state => state.orgPackagesDetail
}

export default getters
