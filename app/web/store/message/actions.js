import { keepwork } from '@/api'
import { props } from './mutations'

const {
  GET_MESSAGES_SUCCESS,
  GET_UNREAD_MESSAGES_SUCCESS,
  LOAD_MORE_MESSAGES_SUCCESS
} = props

export default {
  async getMessages({ commit, dispatch }, params = {}) {
    const defaultParams = { 'x-order': 'id-desc-createdAt-desc' }
    const [messages, unreadMessages] = await Promise.all([
      keepwork.message.getMessages({ ...defaultParams, ...params }),
      keepwork.message.getMessages({ state: 0 })
    ])
    commit(GET_MESSAGES_SUCCESS, messages)
    commit(GET_UNREAD_MESSAGES_SUCCESS, unreadMessages)
  },
  async loadMessages({ commit, dispatch }, params = {}) {
    const defaultParams = { 'x-order': 'id-desc-createdAt-desc' }
    const [messages, unreadMessages] = await Promise.all([
      keepwork.message.getMessages({ ...defaultParams, ...params }),
      keepwork.message.getMessages({ state: 0 })
    ])
    console.log(messages)
    commit(LOAD_MORE_MESSAGES_SUCCESS, messages)
    commit(GET_UNREAD_MESSAGES_SUCCESS, unreadMessages)
  },
  async signMessages({ dispatch }, ids) {
    await keepwork.message.signMessages(ids)
  },
  async getUnreadMessages({ commit }) {
    const res = await keepwork.message.getMessages({ state: 0 })
    commit(GET_UNREAD_MESSAGES_SUCCESS, res)
  }
}