import _ from 'lodash'
const getters = {
  userinfo: state => state.userinfo,
  isOrgMember: (state, { userinfo }) => Boolean(_.get(userinfo, 'roleId')),
  getOrgDetailById: state => ({ id }) => _.get(state.orgsDetailForId, id),
  getOrgDetailByName: state => ({ name }) =>
    _.get(state.orgsDetailForName, name)
}

export default getters
