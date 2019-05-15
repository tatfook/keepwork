import Vue from 'vue'

const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS'
const SIGN_MESSAGES_SUCCESS = 'SIGN_MESSAGES_SUCCESS'
const GET_UNREAD_MESSAGES_SUCCESS = 'GET_UNREAD_MESSAGES_SUCCESS'

export const props = {
  GET_MESSAGES_SUCCESS,
  SIGN_MESSAGES_SUCCESS,
  GET_UNREAD_MESSAGES_SUCCESS
}

export default {
  [GET_MESSAGES_SUCCESS](state, payload) {
    Vue.set(state, 'messages', payload)
  },
  [SIGN_MESSAGES_SUCCESS](state, payload) {
    Vue.set(state, 'unreadMessages', payload)
  },
  [GET_UNREAD_MESSAGES_SUCCESS](state, payload) {
    Vue.set(state, 'unreadMessages', payload)
  }
}