import { keepwork } from '@/api'
import { props } from './mutations'
import _ from 'lodash'

const {
  GET_MESSAGES_SUCCESS,
  GET_UNREAD_MESSAGES_SUCCESS,
  LOAD_MORE_MESSAGES_SUCCESS
} = props

export default {
  async getMessages({ commit }, params = {}) {
    const defaultParams = { 'x-order': 'createdAt-desc-id-desc' }
    const messages = await keepwork.message.getMessages({ ...defaultParams, ...params })
    const unreadMessages = await keepwork.message.getMessages({ state: 0 })
    commit(GET_MESSAGES_SUCCESS, messages)
    commit(GET_UNREAD_MESSAGES_SUCCESS, unreadMessages)
  },
  async loadMessages({ commit }, params = {}) {
    const defaultParams = { 'x-order': 'createdAt-desc-id-desc' }
    const messages = await keepwork.message.getMessages({ ...defaultParams, ...params })
    const unreadMessages = await keepwork.message.getMessages({ state: 0 })
    commit(LOAD_MORE_MESSAGES_SUCCESS, messages)
    commit(GET_UNREAD_MESSAGES_SUCCESS, unreadMessages)
  },
  async refreshMessagesBox({ dispatch, getters: { messagesBox }, rootGetters: { 'user/isLogined': isLogin } }) {
    if (!isLogin) return
    const messageCount = _.get(messagesBox, 'rows.length', 0)
    await dispatch('loadMessages', { 'x-per-page': messageCount + 10 })
    await dispatch('getUnreadMessages')
  },
  async signMessages({ dispatch }, ids) {
    await keepwork.message.signMessages(ids)
    dispatch('refreshMessagesBox')
  },
  async getUnreadMessages({ commit }) {
    const res = await keepwork.message.getMessages({ state: 0 })
    commit(GET_UNREAD_MESSAGES_SUCCESS, res)
  }
}