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
  COPY_CLASSROOM_QUIZ,
  GET_TAUGHT_CLASSROOM_COURSES_SUCCESS,
  GET_ORG_STUDENTS_SUCCESS
} = props

const actions = {
  async getOrgClasses({ commit, getters: { orgClasses } }, { cache = false } = {}) {
    if (!(cache && !_.isEmpty(orgClasses))) {
      const classes = await lessonOrganizations.getOrgClasses({ roleId: 2 })
      commit(GET_ORG_CLASSES_SUCCESS, classes)
    }
  },
  async getOrgClassPackagesById({ commit }, { classId }) {
    const classPackages = await lessonOrganizations.getClassPackagesById({ classId })
    commit(GET_CLASS_PACKAGES_SUCCESS, { classId, classPackages })
  },
  async getOrgClassStudentsById({ commit, getters: { orgClassStudents } }, { classId }) {
    const classStudents = await lessonOrganizationClassMembers.getClassStudentsById({ classId })
    commit(GET_CLASS_STUDENTS_SUCCESS, { classId, classStudents })
  },
  async getOrgStudents({ commit, rootGetters: { 'org/currentOrg': { id: organizationId } } }) {
    const res = await lessonOrganizationClassMembers.getStudents({ organizationId })
    const orgStudents = _.reduce(
      _.get(res, 'rows', []),
      (obj, item) => {
        const name = _.get(item, 'users.username', '')
        const classes = _.map(_.get(item, 'lessonOrganizationClasses', []), item => item.id)
        obj[name] = classes
        return obj
      },
      {}
    )
    commit(GET_ORG_STUDENTS_SUCCESS, orgStudents)
  },
  async getTaughtClassroomCourses({ commit, getters: { classroomCoursesData } }, { classId, cache = false }) {
    if (!(cache && classroomCoursesData[classId])) {
      const classroomCourses = await lesson.classrooms.getTaughtClassroomCourses({ classId })
      commit(GET_TAUGHT_CLASSROOM_COURSES_SUCCESS, { classId, classroomCourses })
    }
  },
  async getOrgClassPackageDetail({ commit }, { classId, packageId }) {
    const packageDetail = await lessonOrganizationClasses.getClassPackageDetail({ classId, packageId })
    commit(GET_CLASS_PACKAGE_DETAIL_SUCCESS, { classId, packageId, packageDetail })
  },
  async addStudentToClass(
    { dispatch, rootGetters: { 'org/currentOrg': { id: organizationId } } },
    { classIds, currentClassId, memberName, realname }
  ) {
    try {
      await lessonOrganizationClassMembers.createClassMember({
        organizationId,
        classIds,
        realname,
        memberName,
        roleId: 1
      })
      await dispatch('getOrgClassStudentsById', { classId: currentClassId })
    } catch (error) {
      return Promise.reject(error.response)
    }
  },
  async removeStudentFromClass({ dispatch, rootDispatch }, { classId, studentId }) {
    try {
      await lessonOrganizationClassMembers.removeMemberFromClass(studentId)
      await dispatch('getOrgClassStudentsById', { classId })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getLessonDetail({ commit, dispatch, getters }, { classId, packageId, lessonId }) {
    let [ res, detail ] = await Promise.all([
      lesson.lessons.lessonContent({ lessonId }),
      lesson.lessons.lessonDetail({ lessonId }),
      dispatch('getOrgClassPackageDetail', { classId, packageId })
    ])
    const { orgClassPackagesDetail } = getters
    const packageIndex = _.findIndex(
      _.get(orgClassPackagesDetail, [ classId, packageId, 'lessons' ], []),
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
  async beginTheClass({ commit, rootGetters: { 'org/currentOrgId': organizationId } }, payload) {
    const classroom = await lesson.classrooms.begin({
      payload: { ...payload, organizationId }
    })
    commit(BEGIN_THE_CLASS_SUCCESS, classroom)
  },
  async dismissTheClass(context, payload) {
    const { commit, getters: { classroom, classId } } = context
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
  async getCurrentClass({ commit, rootGetters: { 'org/currentOrgId': organizationId, 'org/userinfo': userInfo } }) {
    await lesson.classrooms
      .currentClass()
      .then(classroom => {
        if (classroom.organizationId === organizationId && userInfo.id === classroom.userId) {
          commit(GET_CURRENT_CLASSROOM_SUCCESS, classroom)
        }
      })
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
