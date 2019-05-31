import { keepwork } from '@/api'
import { props } from './mutations'
import _ from 'lodash'

const {
  GET_MESSAGES_SUCCESS,
  GET_UNREAD_MESSAGES_SUCCESS,
  LOAD_MORE_MESSAGES_SUCCESS
} = props

export default {
  async getMessages({ commit, dispatch }, params = {}) {
    const messages = await dispatch('getMessagesAndFormat', params)
    commit(GET_MESSAGES_SUCCESS, messages)
    await dispatch('getUnreadMessages')
  },
  async loadMessages({ commit, dispatch }, params = {}) {
    const messages = await dispatch('getMessagesAndFormat', params)
    commit(LOAD_MORE_MESSAGES_SUCCESS, messages)
    await dispatch('getUnreadMessages')
  },
  async refreshMessagesBox({ dispatch, getters: { messagesBox }, rootGetters: { 'user/isLogined': isLogin } }) {
    if (!isLogin) return
    const messageCount = _.get(messagesBox, 'rows.length', 0)
    if (messageCount > 0) {
      await dispatch('loadMessages', { 'x-per-page': messageCount })
      await dispatch('getUnreadMessages')
    }
  },
  async signMessages({ dispatch }, ids) {
    await keepwork.message.signMessages(ids)
    dispatch('refreshMessagesBox')
  },
  async getUnreadMessages({ commit }) {
    const res = await keepwork.message.getMessages({ state: 0 })
    commit(GET_UNREAD_MESSAGES_SUCCESS, res)
  },
  async getMessagesAndFormat(context, params = {}) {
    const defaultParams = { 'x-order': 'createdAt-desc-id-desc' }
    const messages = await keepwork.message.getMessages({ ...defaultParams, ...params })
    return messages
  }
}