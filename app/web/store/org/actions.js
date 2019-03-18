import Cookies from 'js-cookie'
import _ from 'lodash'
import { keepwork } from '@/api'
import { props } from './mutations'

const {
  LOGIN_SUCCESS,
  GET_ORG_SUCCESS,
  SET_CURRENT_ORG,
  GET_ORG_PACKAGES_SUCCESS,
  GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS,
  GET_ORG_CLASSES_SUCCESS,
  GET_ORG_TEACHERS_SUCCESS,
  GET_ORG_STUDENTS_SUCCESS
} = props

const actions = {
  async login(context, { organizationName, username, password }) {
    let { commit } = context
    const userinfo = await keepwork.lessonOrganizations
      .login({
        organizationName,
        username,
        password
      })
      .catch(error => {
        return Promise.reject(error.response)
      })
    if (userinfo) {
      let { token } = userinfo
      Cookies.set('token', token)
      window.localStorage.setItem('satellizer_token', token)
      commit(LOGIN_SUCCESS, { userinfo })
    }
    return userinfo
  },
  async getOrgDetailByLoginUrl(context, { orgLoginUrl }) {
    let { commit } = context
    let orgDetail = await keepwork.lessonOrganizations.getByUrl({
      url: orgLoginUrl
    })
    commit(GET_ORG_SUCCESS, { orgDetail })
  },
  setCurrentOrg(context, { orgDetail }) {
    let { commit } = context
    commit(SET_CURRENT_ORG, { orgDetail })
  },
  async getOrgPackages(context, { organizationId }) {
    let { commit } = context
    let orgPackages = await keepwork.lessonOrganizations.getOrgPackages({
      organizationId
    })
    commit(GET_ORG_PACKAGES_SUCCESS, { organizationId, orgPackages })
  },
  async getOrgPackagesByGraphql(context, { organizationId }) {
    let { commit } = context
    let result = await keepwork.graphql.getQueryResult({
      query:
        'query($id: Int, $name: String) {organization(id: $id, name: $name) {id, organizationPackages {organizationId, package{id,packageName}, lessons{id,lessonName} } } } ',
      variables: {
        id: organizationId
      }
    })
    let orgPackages = _.get(result, 'organization.organizationPackages')
    commit(GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS, { organizationId, orgPackages })
  },
  async getOrgClassList(context, { organizationId }) {
    let { commit } = context
    let orgClasses = await keepwork.lessonOrganizationClasses.getClasses({
      organizationId
    })
    commit(GET_ORG_CLASSES_SUCCESS, { organizationId, orgClasses })
  },
  async createNewClass(context, { organizationId, name, packages }) {
    let result = await keepwork.lessonOrganizationClasses
      .createClasses({ organizationId, name, packages })
      .catch(error => {
        return Promise.reject(error.response)
      })
    return Promise.resolve(result)
  },
  async getOrgTeacherList(context, { organizationId }) {
    let { commit } = context
    let orgTeachers = await keepwork.lessonOrganizationClassMembers.getTeachers(
      {
        organizationId
      }
    )
    commit(GET_ORG_TEACHERS_SUCCESS, { organizationId, orgTeachers })
  },
  async createNewTeacher(
    context,
    { organizationId, classId, memberName, realname }
  ) {
    let result = await keepwork.lessonOrganizationClassMembers
      .createClassMember({
        organizationId,
        classId,
        memberName,
        realname,
        roleId: 2
      })
      .catch(error => {
        return Promise.reject(error.response)
      })
    return Promise.resolve(result)
  },
  async getOrgStudentList(context, { organizationId }) {
    let { commit } = context
    let orgStudents = await keepwork.lessonOrganizationClassMembers.getStudents(
      {
        organizationId
      }
    )
    commit(GET_ORG_STUDENTS_SUCCESS, { organizationId, orgStudents })
  }
}

export default actions