import Vue from 'vue'

const GET_BALANCE_SUCCESS = 'GET_BALANCE_SUCCESS'
const GET_TRADES_SUCCESS = 'GET_TRADES_SUCCESS'
const GET_DISCOUNTS_SUCCESS = 'GET_DISCOUNTS_SUCCESS'
const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS'
const CLEAR_ORDER_RECORD = 'CLEAR_ORDER_RECORD'
const SET_ORDER_STATE = 'SET_ORDER_STATE'

export const props = {
  GET_BALANCE_SUCCESS,
  GET_TRADES_SUCCESS,
  GET_DISCOUNTS_SUCCESS,
  CREATE_ORDER_SUCCESS,
  SET_ORDER_STATE,
  CLEAR_ORDER_RECORD
}

const mutations = {
  [GET_BALANCE_SUCCESS](state, balance) {
    Vue.set(state, 'balance', balance)
  },
  [GET_TRADES_SUCCESS](state, trades) {
    Vue.set(state, 'trades', trades)
  },
  [GET_DISCOUNTS_SUCCESS](state, discounts) {
    Vue.set(state, 'discounts', discounts)
  },
  [CREATE_ORDER_SUCCESS](state, order) {
    Vue.set(state, 'order', order)
  },
  [CLEAR_ORDER_RECORD](state) {
    Vue.set(state, 'order', {})
  },
  [SET_ORDER_STATE](state, code = 256) {
    Vue.set(state, 'order', {
      ...state.order,
      state: code
    })
  }
}

export default mutations
