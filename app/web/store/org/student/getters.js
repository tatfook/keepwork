import _ from 'lodash'


const getters = {
  orgClasses: state => state.orgClasses,
  orgPackages: state => state.orgPackages,
  orgClassPackages: state => state.orgClassPackages,
  orgClassPackagesDetail: state => state.orgClassPackagesDetail,
  orgLessonData: state => state.lessonData,
  orgLessonDetail: state => state.orgLessonDetail,
  classroom: state => state.classroom,
  classroomKey: (state, { classroom }) => _.get(classroom, 'key', ''),
  isBeInClassroom: (state, { classroom }) => !_.isEmpty(classroom),
  isTeaching: (state, { classroom }) => _.get(classroom, 'state', '') === 1,
  isClassOver: (state, { classroom }) => _.get(classroom, 'state', '') === 2,
  classId: (state, { classroom }) => classroom.id
}

export default getters