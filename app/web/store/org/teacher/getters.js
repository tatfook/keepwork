
const getters = {
  orgClasses: state => state.orgClasses,
  orgClassPackages: state => state.orgClassPackages,
  orgClassStudents: state => state.orgClassStudents,
  orgClassPackagesDetail: state => state.orgClassPackagesDetail,
  orgLessonData: state => state.lessonData,
  orgLessonDetail: state => state.orgLessonDetail,
  orgClassroomId: state => 'OrgClassroomId',
  isShowLessonHint: state => state.isShowLessonHint
}

export default getters