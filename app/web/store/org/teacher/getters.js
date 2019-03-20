
import _ from 'lodash'

const getters = {
  orgClasses: state => state.orgClasses,
  orgClassPackages: state => state.orgClassPackages,
  orgClassStudents: state => state.orgClassStudents,
  orgClassPackagesDetail: state => state.orgClassPackagesDetail,
  orgLessonData: state => state.lessonData,
  orgLessonDetail: state => state.orgLessonDetail,
  classroom: state => state.classroom,
  classroomKey: (state, { classroom }) => _.get(classroom, 'key', ''),
  isTeaching: (state, { classroom }) => _.get(classroom, 'state', '') === 1,
  isClassIsOver: (state, { classroom }) => _.get(classroom, 'state', '') === 2,
  classId: (state, { classroom }) => classroom.id,
  isShowLessonHint: state => state.isShowLessonHint
}

export default getters