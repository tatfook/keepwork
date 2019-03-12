import Cookies from 'js-cookie'
import { keepwork } from '@/api'
import { props } from './mutations'

const { LOGIN_SUCCESS } = props

const actions = {
  async login(context, { organizationName, username, password }) {
    let { commit } = context
    const userinfo = await keepwork.lessonOrganizations.login({
      organizationName,
      username,
      password
    })
    if (userinfo) {
      let { token } = userinfo
      Cookies.set('token', token)
      window.localStorage.setItem('satellizer_token', token)
      await commit(LOGIN_SUCCESS, { userinfo })
    }
  }
}

export default actions
