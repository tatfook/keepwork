import _ from 'lodash'
const getters = {
  userinfo: state => state.userinfo,
  isOrgMember: (state, { userinfo }) => Boolean(_.get(userinfo, 'roleId')),
  getOrgDetailById: state => ({ id }) => _.get(state.orgsDetailForId, id),
  getOrgDetailByLoginUrl: state => ({ loginUrl }) =>
    _.get(state.orgsDetailForLoginUrl, loginUrl),
  currentOrg: state => state.currentOrg,
  getOrgPackagesById: state => ({ id }) => _.get(state.orgPackages, id),
  getOrgPackagesGraphqlById: state => ({ id }) => _.get(state.orgPackagesGraphql, id),
  getOrgClassesById: state => ({ id }) => _.get(state.orgClasses, id),
  getOrgTeachersById: state => ({ id }) => _.get(state.orgTeachers, id),
  getOrgStudentsById: state => ({ id }) => _.get(state.orgStudents, id)
}

export default getters
