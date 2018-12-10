import Vue from 'vue'

const GET_USER_FAVORITE_STATE_SUCCESS = 'GET_USER_FAVORITE_STATE_SUCCESS'

export const props = {
  GET_USER_FAVORITE_STATE_SUCCESS
}

const mutations = {
  [GET_USER_FAVORITE_STATE_SUCCESS](state, { userId, isFavorite }) {
    Vue.set(state, 'usersFavoriteState', {
      ...state.usersFavoriteState,
      [userId]: isFavorite
    })
  }
}

export default mutations
