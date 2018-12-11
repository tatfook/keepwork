import Vue from 'vue'

const GET_USER_FAVORITE_STATE_SUCCESS = 'GET_USER_FAVORITE_STATE_SUCCESS'
const GET_USER_FAVORITE_USERS_SUCCESS = 'GET_USER_FAVORITE_USERS_SUCCESS'
const GET_USER_FOLLOW_USERS_SUCCESS = 'GET_USER_FOLLOW_USERS_SUCCESS'

export const props = {
  GET_USER_FAVORITE_STATE_SUCCESS,
  GET_USER_FAVORITE_USERS_SUCCESS,
  GET_USER_FOLLOW_USERS_SUCCESS
}

const mutations = {
  [GET_USER_FAVORITE_STATE_SUCCESS](state, { userId, isFavorite }) {
    Vue.set(state, 'usersFavoriteState', {
      ...state.usersFavoriteState,
      [userId]: isFavorite
    })
  },
  [GET_USER_FAVORITE_USERS_SUCCESS](state, { favoriteUsers, userId }) {
    Vue.set(state, 'favoriteUsers', {
      ...state.favoriteUsers,
      [userId]: favoriteUsers
    })
  },
  [GET_USER_FOLLOW_USERS_SUCCESS](state, { followUsers, userId }) {
    Vue.set(state, 'followUsers', {
      ...state.followUsers,
      [userId]: followUsers
    })
  }
}

export default mutations
