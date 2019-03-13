import Cookies from 'js-cookie'
import { keepwork } from '@/api'
import { props } from './mutations'

const { LOGIN_SUCCESS, GET_ORG_SUCCESS } = props

const actions = {
  async login(context, { organizationName, username, password }) {
    let { commit } = context
    const userinfo = await keepwork.lessonOrganizations
      .login({
        organizationName,
        username,
        password
      })
      .catch(error => {
        return Promise.reject(error.response)
      })
    if (userinfo) {
      let { token } = userinfo
      Cookies.set('token', token)
      window.localStorage.setItem('satellizer_token', token)
      commit(LOGIN_SUCCESS, { userinfo })
    }
    return userinfo
  },
  async getOrgDetailByName(context, { orgName }) {
    let { commit } = context
    let orgDetail = await keepwork.lessonOrganizations.getByName({
      name: orgName
    })
    let { id, name } = orgDetail
    commit(GET_ORG_SUCCESS, { id, name, orgDetail })
  }
}

export default actions
