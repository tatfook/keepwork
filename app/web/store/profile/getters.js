import _ from 'lodash'
const getters = {
  userFavoriteState: state => ({ userId }) =>
    _.get(state.usersFavoriteState, userId),
  favoriteUsers: state => ({ userId }) => _.get(state.favoriteUsers, userId),
  followUsers: state => ({ userId }) => _.get(state.followUsers, userId),
  createdProjects: state => ({ userId }) => _.get(state.createdProjects, userId),
  joinedProjects: state => ({ userId }) => _.get(state.joinedProjects, userId),
  starredProjects: state => ({ userId }) => _.get(state.starredProjects, userId)
}

export default getters
