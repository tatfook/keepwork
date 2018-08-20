const getters = {
  isShowHint: state => state.isShowHint,
  isShowLesson: state => state.isShowLesson,
  isShowPerformance: state => state.isShowPerformance,
  isShowSummary: state => state.isShowSummary,
  lessonData: state => state.lessonData,
  lessonDetail: state => state.lessonDetail,
  classroom: state => state.classroom,
  isBeInClass: (state, { classId }) => !!classId,
  // isBeInClass: (state, { classId }) => true,
  isClassIsOver: (state, { classroom }) => classroom.state === 2,
  // isClassIsOver: (state, { classroom }) => true,
  classroomId: (state, { classroom }) => classroom.key || '',
  classId: (state, { classroom }) => classroom.id
}

export default getters
