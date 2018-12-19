import { keepwork, lesson } from '@/api'
const { account } = keepwork
import { props } from './mutations'
import _ from 'lodash'

const { GET_BALANCE_SUCCESS, GET_TRADES_SUCCESS, CREATE_RECHARGE_ORDER_SUCCESS, GET_DISCOUNTS_SUCCESS, CLEAR_RECHARGE_ORDER_RECORD, SET_RECHARGE_ORDER_STATE, CREATE_TRADE_ORDER } = props

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
    commit(GET_DISCOUNTS_SUCCESS, discounts)
  },
  async createRechargeOrder({ commit }, payload) {
    const order = await account.createRechargeOrder(payload)
    commit('CREATE_RECHARGE_ORDER_SUCCESS', order)
    return order
  },
  clearRechargeOrderRecord({ commit }) {
    commit(CLEAR_RECHARGE_ORDER_RECORD)
  },
  async getRechargeOrderState({ commit }, payload) {
    const order = await account.getRechargeOrderState(payload)
    if (order.state === 256) {
      commit(SET_RECHARGE_ORDER_STATE, 256)
    }
    return order
  },
  async createTradeOrder({ commit }, { type, goodsId, count = 1 }) {
    if (type === 'package') {
      const goodsDetail = await lesson.packages.packageDetail({ packageId: goodsId })
      commit(CREATE_TRADE_ORDER, { type, goodsId, count, goodsDetail })
      return
    }
    if (type === 'exchange') {
      console.warn('exchange ------------->')
    }
  }
}

export default actions
