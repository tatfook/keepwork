import Vue from 'vue'

const GET_USER_FAVORITE_STATE_SUCCESS = 'GET_USER_FAVORITE_STATE_SUCCESS'
const GET_USER_FAVORITE_USERS_SUCCESS = 'GET_USER_FAVORITE_USERS_SUCCESS'
const GET_USER_FOLLOW_USERS_SUCCESS = 'GET_USER_FOLLOW_USERS_SUCCESS'
const GET_USER_CREATED_PROJECT_SUCCESS = 'GET_USER_CREATED_PROJECT_SUCCESS'
const GET_USER_JOINED_PROJECT_SUCCESS = 'GET_USER_JOINED_PROJECT_SUCCESS'
const GET_USER_STARRED_PROJECT_SUCCESS = 'GET_USER_STARRED_PROJECT_SUCCESS'

export const props = {
  GET_USER_FAVORITE_STATE_SUCCESS,
  GET_USER_FAVORITE_USERS_SUCCESS,
  GET_USER_FOLLOW_USERS_SUCCESS,
  GET_USER_CREATED_PROJECT_SUCCESS,
  GET_USER_JOINED_PROJECT_SUCCESS,
  GET_USER_STARRED_PROJECT_SUCCESS
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
  },
  [GET_USER_CREATED_PROJECT_SUCCESS](state, { createdProjects, userId }) {
    Vue.set(state, 'createdProjects', {
      ...state.createdProjects,
      [userId]: createdProjects
    })
  },
  [GET_USER_JOINED_PROJECT_SUCCESS](state, { joinedProjects, userId }) {
    Vue.set(state, 'joinedProjects', {
      ...state.joinedProjects,
      [userId]: joinedProjects
    })
  },
  [GET_USER_STARRED_PROJECT_SUCCESS](state, { starredProjects, userId }) {
    Vue.set(state, 'starredProjects', {
      ...state.starredProjects,
      [userId]: starredProjects
    })
  }
}

export default mutations
