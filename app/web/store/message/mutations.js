import Vue from 'vue'

const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS'
const GET_UNREAD_MESSAGES_SUCCESS = 'GET_UNREAD_MESSAGES_SUCCESS'
const LOAD_MORE_MESSAGES_SUCCESS = 'LOAD_MORE_MESSAGES_SUCCESS'
const GET_UNREAD_LIST = 'GET_UNREAD_LIST'

export const props = {
  GET_MESSAGES_SUCCESS,
  GET_UNREAD_MESSAGES_SUCCESS,
  LOAD_MORE_MESSAGES_SUCCESS,
  GET_UNREAD_LIST
}

export default {
  [GET_MESSAGES_SUCCESS](state, payload) {
    Vue.set(state, 'messages', payload)
  },
  [GET_UNREAD_MESSAGES_SUCCESS](state, payload) {
    Vue.set(state, 'unreadMessagesCount', payload)
  },
  [LOAD_MORE_MESSAGES_SUCCESS](state, payload) {
    Vue.set(state, 'messagesBox', payload)
  },
  [GET_UNREAD_LIST](state, payload) {
    Vue.set(state, 'unreadList', payload)
  }
}