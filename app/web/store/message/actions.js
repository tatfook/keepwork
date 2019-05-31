import { keepwork } from '@/api'
import { props } from './mutations'
import _ from 'lodash'

const {
  GET_MESSAGES_SUCCESS,
  GET_UNREAD_MESSAGES_SUCCESS,
  LOAD_MORE_MESSAGES_SUCCESS
} = props

const registerMessage = username => {
  let html = `<p>欢迎来到 keepwork, ${username}!</p>`
  html += '<p>我们很荣幸有你的参与！通过keepwork，你可以创建自己的3D动画项目、编程项目、网站项目，并将你的作品分享给大家。</p>'
  html += '<p>接下来呢？</p>'
  html += '<p><a href="/create">创建自己的项目</a></p>'
  html += '<p><a href="http://paracraft.keepwork.com/download?lang=zh">下载Paracraft</a></p>'
  html += '<p><a href="/s">获得更多学习资料</a></p>'
  html += '<p><a href="/ranking">欣赏优秀项目</a></p>'
  return html
}

const formatMessages = (messages, username) => {
  return _.map(messages, (item, index) => {
    if (index === 0) {
      item.messages.msg.text = registerMessage(username)
      return item
    }
    return item
  })
}

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
    await dispatch('loadMessages', { 'x-per-page': _.max(messageCount, 10) })
    await dispatch('getUnreadMessages')
  },
  async signMessages({ dispatch }, ids) {
    await keepwork.message.signMessages(ids)
    dispatch('refreshMessagesBox')
  },
  async getUnreadMessages({ commit }) {
    const res = await keepwork.message.getMessages({ state: 0 })
    const count = _.get(res, 'count', 0)
    commit(GET_UNREAD_MESSAGES_SUCCESS, count)
  },
  async getMessagesAndFormat({ getters: { username } }, params = {}) {
    const defaultParams = { 'x-order': 'createdAt-desc-id-desc' }
    const messages = await keepwork.message.getMessages({ ...defaultParams, ...params })
    messages.rows = formatMessages(messages.rows, username)
    return messages
  }
}