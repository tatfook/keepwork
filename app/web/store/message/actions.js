import { keepwork } from '@/api'
import { props } from './mutations'

const {
  GET_MESSAGES_SUCCESS,
  SIGN_MESSAGES_SUCCESS,
  GET_UNREAD_MESSAGES_SUCCESS
} = props

export default {
  async getMessages({ commit }, params = { 'x-order': 'createdAt-desc' }) {
    const res = await keepwork.message.getMessages(params)
    commit(GET_MESSAGES_SUCCESS, res)
  },
  async signMessages({ commit }, ids) {
    await keepwork.message.signMessages(ids)
  },
  async getUnreadMessages({ commit }) {
    const res = await keepwork.message.getMessages({ state: 0 })
    commit(GET_UNREAD_MESSAGES_SUCCESS, res)
  }
}