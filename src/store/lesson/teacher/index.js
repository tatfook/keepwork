import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  isShowLesson: true,
  isShowPerformance: false,
  isShowSummary: false,
  isShowHint: true,
  classroom: {},
  lessonDetail: {},
  userPackages: [],
  userLessons: [],
  packageLessons: {},
  lessonContent: {},
  classroomLearnRecord: []
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
