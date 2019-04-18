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
  GET_ORG_PACKAGES_BY_GRAPHQL_SUCCESS,
  GET_ORG_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  SAVE_LESSON_DETAIL,
  GET_ORG_CLASSES_SUCCESS,
  GET_ORG_TEACHERS_SUCCESS,
  GET_ORG_STUDENTS_SUCCESS,
  GET_USER_ORG_SUCCESS
} = props

const actions = {
  async login(context, { organizationName, username, password }) {
    let { dispatch } = context
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
      dispatch('setTokenUpdateAt')
      window.localStorage.setItem('satellizer_token', token)
      await dispatch(
        'user/getProfile',
        { forceLogin: false, useCache: false },
        { root: true }
      )
    }
    return userinfo
  },
  setTokenUpdateAt({ commit }) {
    commit(SET_TOKEN_UPDATE_AT)
  },
  async getOrgToken(context, { orgId }) {
    let token = await keepwork.lessonOrganizations
      .getOrgToken({ orgId })
      .catch()
    return token
  },
  async getCurrentOrgUserCounts({ dispatch, getters: { currentOrg } }) {
    await dispatch('getOrgUserCountsByGraphql', { orgId: currentOrg.id })
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
  async getOrgPackageDetail({ commit }, { packageId }) {
    const packageDetail = await keepwork.lessonOrganizations.getOrgStudentPackageDetail(
      { packageId }
    )
    commit(GET_ORG_PACKAGE_DETAIL_SUCCESS, { packageId, packageDetail })
    return packageDetail
  },
  async getLessonDetail(
    { commit, dispatch, getters },
    { packageId, lessonId }
  ) {
    let [res, detail] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId }),
      dispatch('getOrgPackageDetail', { packageId })
    ])
    const { orgPackagesDetail } = getters
    const packageIndex = _.findIndex(
      _.get(orgPackagesDetail, [packageId, 'lessons'], []),
      item => item.lessonId === _.toNumber(lessonId)
    )
    if (packageIndex !== -1) detail.packageIndex = packageIndex + 1

    let modList = Parser.buildBlockList(res.content)
    let quiz = modList
      .filter(item => item.cmd === 'Quiz' && !_.isEmpty(item.data))
      .map(({ data: { quiz: { data } } }) => ({
        key: data[0].id,
        data: data[0],
        result: null,
        answer: null
      }))
    commit(GET_LESSON_CONTENT_SUCCESS, {
      lessonId,
      content: res.content
    })
    commit(SAVE_LESSON_DETAIL, {
      lessonId,
      lesson: detail,
      quiz,
      modList
    })
  },
  async getOrgClassList(context, { organizationId }) {
    let { commit } = context
    let orgClasses = await keepwork.lessonOrganizationClasses.getClasses({
      organizationId
    })
    commit(GET_ORG_CLASSES_SUCCESS, { organizationId, orgClasses })
  },
  async createNewClass(context, { organizationId, name, packages }) {
    let { dispatch } = context
    let result = await keepwork.lessonOrganizationClasses
      .createClasses({ organizationId, name, packages })
      .catch(error => {
        return Promise.reject(error.response)
      })
    await dispatch('getOrgClassList', { organizationId })
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
    return Promise.reject(organizationClassMembers)
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
  },
  async getUserOrg({ commit }) {
    await keepwork.lessonOrganizations.getUserOrganizations().then(org => {
      commit(GET_USER_ORG_SUCCESS, org)
    }).catch(err => {
      console.error('err', err)
    })
  }
}

export default actions
