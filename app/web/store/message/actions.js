import { keepwork } from '@/api'
import { props } from './mutations'
import _ from 'lodash'

const {
  GET_MESSAGES_SUCCESS,
  LOAD_MORE_MESSAGES_SUCCESS,
  GET_UNREAD_LIST
} = props

const REGISTER_MESSAGE = 1
const SYSTEM_MESSAGE = 0

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


const formatMessages = messages => {
  return _.map(messages, item => {
    if (_.get(item, 'messages.type', 0) === SYSTEM_MESSAGE && _.get(item, 'messages.msg.type', 0) === REGISTER_MESSAGE) {
      const username = _.get(item, 'messages.msg.user.nickname', '')
      item.messages.msg.text = registerMessage(username)
    }
    return item
  })
}

export default {
  async getMessages({ commit, dispatch }, params = {}) {
    const messages = await dispatch('getMessagesAndFormat', params)
    commit(GET_MESSAGES_SUCCESS, messages)
  },
  async loadMessages({ commit, dispatch }, params = {}) {
    const messages = await dispatch('getMessagesAndFormat', params)
    commit(LOAD_MORE_MESSAGES_SUCCESS, messages)
  },
  async refreshMessagesBox({ dispatch, getters: { messagesBox }, rootGetters: { 'user/isLogined': isLogin } }) {
    if (!isLogin) return
    const messageCount = _.get(messagesBox, 'rows.length', 0)
    await dispatch('loadMessages', { 'x-per-page': _.max(messageCount, 10) })
    await dispatch('getUnreadList')
  },
  async signMessages({ dispatch }, ids) {
    await keepwork.messages.signMessages(ids)
    dispatch('refreshMessagesBox')
  },
  async getMessagesAndFormat(context, params = {}) {
    const defaultParams = { 'x-order': 'createdAt-desc-id-desc' }
    const messages = await keepwork.messages.getMessages({ ...defaultParams, ...params })
    messages.rows = formatMessages(messages.rows)
    return messages
  },
  async getUnreadList({ commit }) {
    const res = await keepwork.messages.getUnreadList()
    commit(GET_UNREAD_LIST, res)
  }
}