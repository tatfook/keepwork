import { props } from './mutations'
import { keepwork, lesson } from '@/api'
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
const { lessonOrganizations, lessonOrganizationClassMembers, lessonOrganizationClasses } = keepwork

const {
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS,
  GET_CLASS_PACKAGE_DETAIL_SUCCESS,
  GET_ORG_PACKAGES_SUCCESS
} = props

const actions = {
  async getOrgClasses({ commit, getters: { orgClasses } }, { cache = false } = {}) {
    if (!(cache && !_.isEmpty(orgClasses))) {
      const classes = await lessonOrganizations.getOrgClasses()
      commit(GET_ORG_CLASSES_SUCCESS, classes)
    }
  },
  async getOrgClassPackagesById({ commit, getters: { orgClassPackages } }, { classId }) {
    if (!orgClassPackages[classId]) {
      const classPackages = await lessonOrganizations.getClassPackagesById({ classId })
      commit(GET_CLASS_PACKAGES_SUCCESS, { classId, classPackages })
    }
  },
  async getOrgPackages({ commit }) {
    const studentPackages = await lessonOrganizations.getOrgStudentPackages()
    commit(GET_ORG_PACKAGES_SUCCESS, studentPackages)
  },
  async getOrgClassPackageDetail({ commit }, { classId, packageId }) {
    const packageDetail = await lessonOrganizationClasses.getClassPackageDetail({ classId, packageId })
    commit(GET_CLASS_PACKAGE_DETAIL_SUCCESS, { classId, packageId, packageDetail })
  },
}

export default actions