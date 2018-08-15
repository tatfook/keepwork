import Vue from 'vue'
// import _ from 'lodash'

const PUBLISH_LESSON = 'PUBLISH_LESSON'
const TOGGLE_HINT = 'TOGGLE_HINT'

export const props = {
  PUBLISH_LESSON,
  TOGGLE_HINT
}

const mutations = {
  [TOGGLE_HINT](state) {
    Vue.set(state, 'isShowHint', !state.isShowHint)
  }
}

export default mutations
