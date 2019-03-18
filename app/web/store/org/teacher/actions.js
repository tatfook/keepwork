import { props } from './mutations'
import { keepwork } from '@/api'
const { lessonOrganizations, lessonOrganizationClassMembers } = keepwork

const { GET_ORG_CLASSES_SUCCESS, GET_CLASS_PACKAGES_SUCCESS, GET_CLASS_STUDENTS_SUCCESS } = props

const actions = {
  async getOrgClasses({ commit }) {
    const classes = await lessonOrganizations.getOrgClasses()
    commit(GET_ORG_CLASSES_SUCCESS, classes)
  },
  async getOrgClassPackagesById(
    { commit, getters: { orgClassPackages } },
    { classId }
  ) {
    if (!orgClassPackages[classId]) {
      const classPackages = await lessonOrganizations.getClassPackagesById({ classId })
      commit(GET_CLASS_PACKAGES_SUCCESS, { classId, classPackages })
    }
  },
  async getOrgClassStudentsById({ commit, getters: { orgClassStudents } }, { classId, cache = false }) {
    if (!(cache && orgClassStudents[classId])) {
      const classStudents = await lessonOrganizationClassMembers.getClassStudentsById({ classId })
      commit(GET_CLASS_STUDENTS_SUCCESS, { classId, classStudents })
    }
  },
  async addStudentToClass(
    { dispatch, rootGetters: { 'org/currentOrg': { id: organizationId } } },
    { classId, memberName, realname }
  ) {
    try {
      await lessonOrganizationClassMembers.createClassMember({ organizationId, classId, realname, memberName, roleId: 1 })
      await dispatch('getOrgClassStudentsById', { classId })
    } catch (error) {
      return Promise.reject(error.response)
    }
  },
  async removeStudentFromClass({ dispatch }, { classId, studentId }) {
    try {
      await lessonOrganizationClassMembers.removeStudentFromClass(studentId)
      await dispatch('getOrgClassStudentsById', { classId })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default actions
