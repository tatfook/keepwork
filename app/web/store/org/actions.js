import Cookies from 'js-cookie'
import _ from 'lodash'
import { keepwork } from '@/api'
import { props } from './mutations'

const {
  GET_ORG_COUNT_SUCCESS,
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
    }
    return userinfo
  },
  async getOrgToken(context, { orgId }) {
    let token = await keepwork.lessonOrganizations
      .getOrgToken({ orgId })
      .catch()
    return token
  },
  async getOrgUserCountsByGraphql(context, { orgId }) {
    let { commit } = context
    let result = await keepwork.graphql.getQueryResult({
      query:
        'query($id: Int, $name: String) {organization(id: $id, name: $name) {id, studentCount, teacherCount, count }}',
      variables: {
        id: orgId
      }
    })
    let userCounts = _.get(result, 'organization')
    commit(GET_ORG_COUNT_SUCCESS, { orgId, userCounts })
  },
  async getOrgDetailByLoginUrl(context, { orgLoginUrl }) {
    let { commit } = context
    let orgDetail = await keepwork.lessonOrganizations.getByUrl({
      url: orgLoginUrl
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
  async getOrgClassPackages(context, { organizationId, classId }) {
    let classPackages = await keepwork.lessonOrganizations.getOrgClassPackages({
      organizationId,
      classId
    })
    return classPackages
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
  async updateClass(context, { organizationId, classId, name, packages }) {
    await keepwork.lessonOrganizationClasses
      .updateClass({ organizationId, classId, name, packages })
      .catch(error => {
        return Promise.reject(error.response)
      })
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
  async getUserOrgRoleByGraphql(context, { organizationId, username }) {
    let result = await keepwork.graphql.getQueryResult({
      query:
        'query($organizationId: Int, $userId: Int, $username: String){ organizationUser(organizationId: $organizationId, userId: $userId, username: $username){organizationId, userId, organizationClassMembers{classId, roleId} }}',
      variables: {
        organizationId,
        username
      }
    })
    let organizationUser = result.organizationUser
    if (!organizationUser) {
      return Promise.reject(400)
    }
    let organizationClassMembers = organizationUser.organizationClassMembers
    if (organizationClassMembers.length === 0) {
      return Promise.resolve()
    }
    return Promise.reject(organizationClassMembers[0].roleId)
  },
  async createNewMember(
    context,
    { organizationId, classId, classIds, memberName, realname, roleId }
  ) {
    let { dispatch } = context
    let result = await keepwork.lessonOrganizationClassMembers
      .createClassMember({
        organizationId,
        classId,
        classIds,
        memberName,
        realname,
        roleId
      })
      .catch(error => {
        return Promise.reject(error.response)
      })
    await dispatch('getOrgUserCountsByGraphql', {
      orgId: organizationId
    })
    return Promise.resolve(result)
  },
  async removeMemberFromClass(context, { id }) {
    let {
      dispatch,
      getters: { currentOrg }
    } = context
    await keepwork.lessonOrganizationClassMembers
      .removeMemberFromClass(id)
      .catch(error => {
        return Promise.reject(error.response)
      })
    await dispatch('getOrgUserCountsByGraphql', {
      orgId: currentOrg.id
    })
  },
  async getOrgStudentList(context, { organizationId, classId }) {
    let { commit } = context
    let result = classId
      ? await keepwork.lessonOrganizationClassMembers.getStudentsByClassId({
        organizationId,
        classId
      })
      : await keepwork.lessonOrganizationClassMembers.getStudents({
        organizationId
      })
    let orgStudents = result.rows
    commit(GET_ORG_STUDENTS_SUCCESS, { organizationId, orgStudents, classId })
  },
  async updateOrg(context, { orgLoginUrl, orgId, orgData }) {
    let { dispatch } = context
    await keepwork.lessonOrganizations.updateOrg({ orgId, orgData })
    let orgDetail = await dispatch('getOrgDetailByLoginUrl', { orgLoginUrl })
    await dispatch('setCurrentOrg', { orgDetail })
  }
}

export default actions
