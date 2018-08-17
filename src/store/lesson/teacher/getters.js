const getters = {
  isShowHint: state => state.isShowHint,
  isShowLesson: state => state.isShowLesson,
  isShowSummary: state => state.isShowSummary,
  isShowPerformance: state => state.isShowPerformance,
  lessonData: state => state.lessonData,
  lessonDetail: state => state.lessonDetail,
  classRoom: state => state.classRoom || {},
  isBeInClass: (state, { classRoom }) => !!classRoom.key
}

export default getters
