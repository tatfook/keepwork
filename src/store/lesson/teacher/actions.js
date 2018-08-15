import { props } from './mutations'
const { TOGGLE_HINT } = props

const actions = {
  toggleHint({ commit }) {
    commit(TOGGLE_HINT)
  }
}

export default actions
