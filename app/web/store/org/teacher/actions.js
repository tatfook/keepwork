import { props } from './mutations'
import { keepwork } from '@/api'
const { lessonOrganizations: orgApi } = keepwork

const { GET_ORG_CLASSES_SUCCESS, GET_CLASS_PACKAGES_SUCCESS, GET_CLASS_STUDENTS_SUCCESS } = props

const actions = {
  async getOrgClasses({ commit }) {
    const classes = await orgApi.getOrgClasses()
    commit(GET_ORG_CLASSES_SUCCESS, classes)
  },
  async getOrgClassPackagesById(
    { commit, rootGetters: { 'org/teacher/orgClassPackages': orgClassPackages } },
    { classId }
  ) {
    if (!orgClassPackages[classId]) {
      const classPackages = await orgApi.getClassPackagesById({ classId })
      commit(GET_CLASS_PACKAGES_SUCCESS, { classId, classPackages })
    }
  },
  async getOrgClassStudentsById({ commit }, { classId }) {
    const classStudents = await orgApi.getClassStudentsById({ classId })
    console.log(classId)
    console.log(classStudents)
    commit(GET_CLASS_STUDENTS_SUCCESS, { classId, classStudents })
  },
  async removeStudentFromClass({ commit }, { classId, studentId }) {
    console.log(studentId)
  }
}

export default actions
