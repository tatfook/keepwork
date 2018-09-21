import { props } from './mutations'

let {
  TOGGLE_LOGIN_DIALOG
} = props

const actions = {
  async toggleLoginDialog({ commit }, status) {
    commit(TOGGLE_LOGIN_DIALOG, status)
  }
}

export default actions
