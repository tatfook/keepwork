import { keepwork, lesson } from '@/api'
const { account } = keepwork
import { props } from './mutations'
import _ from 'lodash'

const {
  GET_BALANCE_SUCCESS,
  GET_TRADES_SUCCESS,
  CREATE_RECHARGE_ORDER_SUCCESS,
  GET_DISCOUNTS_SUCCESS,
  CLEAR_RECHARGE_ORDER_RECORD,
  SET_RECHARGE_ORDER_STATE,
  CREATE_TRADE_ORDER,
  SUBMIT_TRADE_ORDER,
  PAY_TRADE_ORDER,
  GET_GOODS_SUCCESS
} = props

const SUCCESS_CODE = 256
const PACKAGE_TYPE = 2
const EXCHANGE_TYPE = 1

const actions = {
  async getBalance({ commit }) {
    const balance = await account.getBalance()
    commit(GET_BALANCE_SUCCESS, balance)
  },
  async getTrades({ commit }, args) {
    const trades = await account.getTrades(args)
    commit(GET_TRADES_SUCCESS, trades)
  },
  async getDiscounts({ commit }) {
    const discounts = await account.getDiscounts()
    commit(GET_DISCOUNTS_SUCCESS, discounts)
  },
  async createRechargeOrder({ commit }, payload) {
    const order = await account.createRechargeOrder(payload)
    commit(CREATE_RECHARGE_ORDER_SUCCESS, order)
    return order
  },
  async clearRechargeOrderRecord({ commit }) {
    commit(CLEAR_RECHARGE_ORDER_RECORD)
  },
  async getRechargeOrderState({ commit }, payload) {
    const order = await account.getRechargeOrderState(payload)
    if (order.state === SUCCESS_CODE) {
      commit(SET_RECHARGE_ORDER_STATE, SUCCESS_CODE)
    }
    return order
  },
  async createTradeOrder({ commit, dispatch }, payload) {
    const { type, id, goodsId } = payload
    if (type === PACKAGE_TYPE) {
      const goodsDetail = await lesson.packages.packageDetail({ packageId: id })
      const { packageName = '' } = goodsDetail
      return commit(CREATE_TRADE_ORDER, { ...payload, subject: packageName, goodsDetail })
    }
    if (type === EXCHANGE_TYPE) {
      const goods = await account.getGoods()
      commit(GET_GOODS_SUCCESS, goods)
      // FIXME: goodsId
      if (goodsId) {
        const goodsDetail = _.find(goods, (item) => item.goodsId === _.toNumber(goodsId))
        commit(CREATE_TRADE_ORDER, { ...payload, id: goodsDetail.id, goodsDetail })
      } else {
        const goodsDetail = _.find(goods, (item) => item.id === _.toNumber(id))
        commit(CREATE_TRADE_ORDER, { ...payload, goodsDetail })
      }
    }
  },
  async submitTradeOrder({ commit }, payload) {
    commit(SUBMIT_TRADE_ORDER, payload)
  },
  async payTradeOrder({ commit }, payload) {
    console.log(payload)
    const { finalCostByUnit, ...order } = payload
    let res = await account.createTradeOrder(order)
    if (res.discount) {
      return commit(PAY_TRADE_ORDER, { ...payload, discount: res.discount })
    }
    commit(PAY_TRADE_ORDER, payload)
  },
  async getGoods({ commit }) {
    const goods = await account.getGoods()
    commit(GET_GOODS_SUCCESS, goods)
  }
}

export default actions
