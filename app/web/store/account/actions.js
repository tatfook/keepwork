import { keepwork } from '@/api'
const { account } = keepwork
import { props } from './mutations'
import _ from 'lodash'

const { GET_BALANCE_SUCCESS, GET_TRADES_SUCCESS, GET_DISCOUNTS_SUCCESS, CLEAR_ORDER_RECORD, SET_ORDER_STATE } = props

const actions = {
  async getBalance({ commit }) {
    const balance = await account.getBalance()
    commit(GET_BALANCE_SUCCESS, balance)
  },
  async getTrades({ commit }) {
    const trades = await account.getTrades()
    commit(GET_TRADES_SUCCESS, trades)
  },
  async getDiscounts({ commit }) {
    const discounts = await account.getDiscounts()
    console.warn(discounts)
    commit(GET_DISCOUNTS_SUCCESS, discounts)
  },
  async createOrder({ commit }, payload) {
    const order = await account.createOrder(payload)
    commit('CREATE_ORDER_SUCCESS', order)
    return order
  },
  clearOrderRecord({ commit }) {
    commit(CLEAR_ORDER_RECORD)
  },
  async getOrderState({ commit }, payload) {
    const order = await account.getOrderState(payload)
    if (order.state === 256) {
      commit(SET_ORDER_STATE, 256)
    }
    return order
  }
}

export default actions
