const getters = {
  isShowHint: state => state.isShowHint,
  isShowLesson: state => state.isShowLesson,
  isShowPerformance: state => state.isShowPerformance,
  isShowSummary: state => state.isShowSummary,
  lessonData: state => state.lessonData,
  lessonDetail: state => state.lessonDetail,
  classroom: state => state.classroom,
  isBeInClass: (state, { classId }) => !!classId,
  isClassIsOver: (state, { classroom }) => classroom.state === 2,
  classroomId: (state, { classroom }) => classroom.key || '',
  learnRecords: state => state.learnRecords || null,
  userPackages: state => state.userPackages,
  userLessons: state => state.userLessons,
  packageLessons: state => state.packageLessons,
  classId: (state, { classroom }) => classroom.id,
  classroomLearnRecord: status => status.classroomLearnRecord
}

export default getters
