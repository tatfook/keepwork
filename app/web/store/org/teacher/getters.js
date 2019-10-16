
import _ from 'lodash'

const getters = {
  orgClasses: state => state.orgClasses,
  orgStudents: state => state.orgStudents,
  orgUserCounts: (state, getters, rootState, rootGetters) => {
    const { 'org/getOrgUserCountById': getOrgUserCountById, 'org/currentOrg': currentOrg } = rootGetters
    return getOrgUserCountById(currentOrg)
  },
  orgRestCount: (state, { orgUserCounts = {} }) => {
    const { count = 0, studentCount = 0 } = orgUserCounts
    const residue = count - studentCount
    return residue > -1 ? residue : 0
  },
  orgStudentLimit: (state, { orgUserCounts }) => _.get(orgUserCounts, 'count', 0),
  orgClassPackages: state => state.orgClassPackages,
  orgClassStudents: state => state.orgClassStudents,
  orgClassTeachers: state => state.orgClassTeachers,
  orgClassEvaluationReports: state => state.orgClassEvaluationReports,
  orgClassEvaluationReportCount: state => state.orgClassEvaluationReportCount,
  lastUpdateProjects: state => state.lastUpdateProjects,
  moreLastUpdateProjects: state => state.moreLastUpdateProjects,
  evaluationReportDetail: state => state.evaluationReportDetail,
  classroomCoursesData: state => state.classroomCoursesData,
  orgClassPackagesDetail: state => state.orgClassPackagesDetail,
  orgLessonData: state => state.lessonData,
  orgLessonDetail: state => state.orgLessonDetail,
  classroom: state => state.classroom,
  classroomKey: (state, { classroom }) => _.get(classroom, 'key', ''),
  isBeInClassroom: (state, { classroom }) => !_.isEmpty(classroom),
  isTeaching: (state, { classroom }) => _.get(classroom, 'state', '') === 1,
  isClassOver: (state, { classroom }) => _.get(classroom, 'state', '') === 2,
  classId: (state, { classroom }) => classroom.id,
  classroomId: (state, { classroom }) => classroom.id,
  isShowLessonHint: state => state.isShowLessonHint,
  isClassIsOver: (state, { classroom }) => classroom.state === 2,
  classroomLearnRecord: state => state.classroomLearnRecord,
  learnRecords: state => state.learnRecords,
  classroomQuiz: state => state.classroomQuiz,
  isBeInClass: (state, { classroom }) => !_.isEmpty(classroom)
}

export default getters