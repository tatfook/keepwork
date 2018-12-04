import _ from 'lodash'
const getters = {
  userFavoriteState: state => ({ userId }) =>
    _.get(state.usersFavoriteState, userId)
}

export default getters
