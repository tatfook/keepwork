import _ from 'lodash'
import { keepwork } from '@/api'
import { props } from './mutations'

let {
  GET_USER_FAVORITE_STATE_SUCCESS,
  GET_USER_FAVORITE_USERS_SUCCESS,
  GET_USER_FOLLOW_USERS_SUCCESS
} = props

const actions = {
  async initProfileData(context, { userId }) {
    let { dispatch } = context
    await dispatch(
      'user/getUserDetailWithRankByUserId',
      { userId },
      { root: true }
    )
    return Promise.resolve()
  },
  async getFavoriteState(context, { objectId, objectType, useCache = true }) {
    let {
      commit,
      getters: { userFavoriteState }
    } = context
    let favoriteState = userFavoriteState({ userId: objectId })
    if (favoriteState && useCache) {
      return
    }
    await keepwork.favorites
      .existFavorite({ objectId, objectType })
      .then(async isFavorite => {
        commit(GET_USER_FAVORITE_STATE_SUCCESS, {
          userId: objectId,
          isFavorite
        })
        return Promise.resolve()
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  async favoriteUser(context, { objectId, objectType }) {
    let { dispatch } = context
    await keepwork.favorites
      .favoriteObject({ objectId, objectType })
      .then(async () => {
        await Promise.all([
          dispatch('getFavoriteState', {
            objectId,
            objectType,
            useCache: false
          }),
          dispatch('initProfileData', { userId: objectId })
        ])
        return Promise.resolve()
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  async unFavoriteUser(context, { objectId, objectType }) {
    let { dispatch } = context
    await keepwork.favorites
      .unFavoriteObject({ objectId, objectType })
      .then(async () => {
        await Promise.all([
          dispatch('getFavoriteState', {
            objectId,
            objectType,
            useCache: false
          }),
          dispatch('initProfileData', { userId: objectId })
        ])
        return Promise.resolve()
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  async getFavoriteUsers({ commit }, { userId }) {
    let favoriteUsers = await keepwork.favorites
      .getUserFavorites({ objectType: 0, userId })
      .catch(err => console.error(err))
    commit(GET_USER_FAVORITE_USERS_SUCCESS, { favoriteUsers, userId })
  },
  async getFollowUsers({ commit }, { userId }) {
    let objectId = userId
    let followUsers = await keepwork.favorites
      .getUserFollows({ objectType: 0, objectId })
      .catch(err => console.error(err))
    commit(GET_USER_FOLLOW_USERS_SUCCESS, { followUsers, userId })
  }
}

export default actions
