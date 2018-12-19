import Vue from 'vue'

const GET_BALANCE_SUCCESS = 'GET_BALANCE_SUCCESS'
const GET_TRADES_SUCCESS = 'GET_TRADES_SUCCESS'
const GET_DISCOUNTS_SUCCESS = 'GET_DISCOUNTS_SUCCESS'
const CREATE_RECHARGE_ORDER_SUCCESS = 'CREATE_RECHARGE_ORDER_SUCCESS'
const CLEAR_RECHARGE_ORDER_RECORD = 'CLEAR_RECHARGE_ORDER_RECORD'
const SET_RECHARGE_ORDER_STATE = 'SET_RECHARGE_ORDER_STATE'
const CREATE_TRADE_ORDER = 'CREATE_TRADE_ORDER'

export const props = {
  GET_BALANCE_SUCCESS,
  GET_TRADES_SUCCESS,
  GET_DISCOUNTS_SUCCESS,
  CREATE_RECHARGE_ORDER_SUCCESS,
  SET_RECHARGE_ORDER_STATE,
  CLEAR_RECHARGE_ORDER_RECORD,
  CREATE_TRADE_ORDER
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
  [CREATE_RECHARGE_ORDER_SUCCESS](state, order) {
    Vue.set(state, 'rechargeOrder', order)
  },
  [CLEAR_RECHARGE_ORDER_RECORD](state) {
    Vue.set(state, 'rechargeOrder', {})
  },
  [SET_RECHARGE_ORDER_STATE](state, code = 256) {
    Vue.set(state, 'rechargeOrder', {
      ...state.rechargeOrder,
      state: code
    })
  },
  [CREATE_TRADE_ORDER](state, payload) {
    Vue.set(state, 'tradeOrder', payload)
  }
}

export default mutations
