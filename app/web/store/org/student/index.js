import getters from './getters'
import actions from './actions'
import mutations from './mutations'


const state = {
  orgClasses: [],
  orgPackages: [],
  orgLessonData: {},
  orgLessonDetail: {},
  classroom: {},
  orgPackagesDetail: {},
  enterClassId: '',
  learnRecordsId: '',
  lessonDetail: {},
  lessonQuiz: {},
  teachingLesson: []
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}