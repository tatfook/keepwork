import { props } from './mutations'
import { keepwork, lesson } from '@/api'
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
const { lessonOrganizations, lessonOrganizationClassMembers, lessonOrganizationClasses } = keepwork

const {
  GET_ORG_CLASSES_SUCCESS,
  GET_CLASS_PACKAGES_SUCCESS,
  GET_CLASS_STUDENTS_SUCCESS,
  GET_CLASS_PACKAGE_DETAIL_SUCCESS,
  GET_CLASS_LESSON_CONTENT_SUCCESS,
  SAVE_CLASS_LESSON_DETAIL,
  TOGGLE_LESSON_HINT,
  BEGIN_THE_CLASS_SUCCESS,
  DISMISS_THE_CLASS_SUCCESS,
  UPDATE_LEARN_RECORDS_SUCCESS,
  GET_CURRENT_CLASSROOM_SUCCESS,
  LEAVE_THE_CLASSROOM,
  COPY_CLASSROOM_QUIZ
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
  async getOrgClassStudentsById({ commit, getters: { orgClassStudents } }, { classId, cache = false }) {
    if (!(cache && orgClassStudents[classId])) {
      const classStudents = await lessonOrganizationClassMembers.getClassStudentsById({ classId })
      commit(GET_CLASS_STUDENTS_SUCCESS, { classId, classStudents })
    }
  },
  async getOrgClassPackageDetail({ commit }, { classId, packageId }) {
    const packageDetail = await lessonOrganizationClasses.getClassPackageDetail({ classId, packageId })
    commit(GET_CLASS_PACKAGE_DETAIL_SUCCESS, { classId, packageId, packageDetail })
  },
  async addStudentToClass(
    { dispatch, rootGetters: { 'org/currentOrg': { id: organizationId } } },
    { classId, memberName, realname }
  ) {
    try {
      await lessonOrganizationClassMembers.createClassMember({
        organizationId,
        classId,
        realname,
        memberName,
        roleId: 1
      })
      await dispatch('getOrgClassStudentsById', { classId })
    } catch (error) {
      return Promise.reject(error.response)
    }
  },
  async removeStudentFromClass({ dispatch }, { classId, studentId }) {
    try {
      await lessonOrganizationClassMembers.removeMemberFromClass(studentId)
      await dispatch('getOrgClassStudentsById', { classId })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getLessonDetail({ commit, dispatch, getters }, { classId, packageId, lessonId }) {
    await dispatch('getOrgClassPackageDetail', { classId, packageId })
    // const { teacherPackageDetail } = getters
    // const packageIndex = teacherPackageDetail({ packageId }).lessons.map(l => l.id).indexOf(Number(lessonId))
    let [ res, detail ] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId })
    ])
    // if (packageIndex !== -1) detail.packageIndex = packageIndex + 1
    let modList = Parser.buildBlockList(res.content)
    let quiz = modList
      .filter(item => item.cmd === 'Quiz' && !_.isEmpty(item.data))
      .map(({ data: { quiz: { data } } }) => ({
        key: data[0].id,
        data: data[0],
        result: null,
        answer: null
      }))
    commit(GET_CLASS_LESSON_CONTENT_SUCCESS, {
      lessonId,
      content: res.content
    })
    commit(SAVE_CLASS_LESSON_DETAIL, {
      lessonId,
      lesson: detail,
      quiz,
      modList
    })
  },
  toggleLessonHint({ commit }) {
    commit(TOGGLE_LESSON_HINT)
  },
  async beginTheClass({ commit }, payload) {
    const classroom = await lesson.classrooms.begin({
      payload
    })
    commit(BEGIN_THE_CLASS_SUCCESS, classroom)
  },
  async dismissTheClass(context, payload) {
    const {
      commit,
      getters: { classroom, classId }
    } = context
    let flag = await lesson.classrooms.dismiss({
      classId
    })
    if (flag) {
      let _classroom = _.clone(classroom)
      _classroom.state = 2
      commit(DISMISS_THE_CLASS_SUCCESS, _classroom)
    }
  },
  async updateLearnRecords({ commit, getters: { classId } }, payload) {
    const learnRecords = await lesson.classrooms.learnRecords({
      classId
    })
    commit(UPDATE_LEARN_RECORDS_SUCCESS, learnRecords)
  },
  async getCurrentClass({ commit }) {
    await lesson.classrooms
      .currentClass()
      .then(classroom => commit(GET_CURRENT_CLASSROOM_SUCCESS, classroom))
      .catch(e => {
        console.error("can't find the classroom", e)
        commit(LEAVE_THE_CLASSROOM)
      })
  },
  async resumeClassData({ commit }, payload) {
    commit(GET_CURRENT_CLASSROOM_SUCCESS, payload)
  },
  async copyClassroomQuiz({ commit, getters: { isBeInClass, isClassIsOver, orgLessonDetail } }) {
    if (isBeInClass && !isClassIsOver) {
      commit(COPY_CLASSROOM_QUIZ, _.get(orgLessonDetail, 'quiz', []))
    }
  },
  async leaveTheClassroom({ commit, getters: { isBeInClass, isClassIsOver } }) {
    isBeInClass && isClassIsOver && commit(LEAVE_THE_CLASSROOM)
  }
}

export default actions
