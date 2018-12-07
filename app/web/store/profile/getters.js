import _ from 'lodash'
const getters = {
  userFavoriteState: state => ({ userId }) =>
    _.get(state.usersFavoriteState, userId),
  favoriteUsers: state => ({ userId }) => _.get(state.favoriteUsers, userId),
  followUsers: state => ({ userId }) => _.get(state.followUsers, userId)
}

export default getters
