import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const AccountContainer = () => import('@/components/account/AccountContainer')
const MyAccount = () => import('@/components/account/MyAccount')
const TransactionDetail = () => import('@/components/account/TransactionDetail')
const DiscountCoupon = () => import('@/components/account/DiscountCoupon')
const RechargePage = () => import('@/components/account/RechargePage')
const RechargeConfirm = () => import('@/components/account/RechargeConfirm')

const OrderConfirm = () => import('@/components/account/OrderConfirm')
const OrderPay = () => import('@/components/account/OrderPay')
const OrderCompletion = () => import('@/components/account/OrderCompletion')

export default new Router({
  mode: 'history',
  base: '/a',
  routes: [
    {
      path: '*',
      name: 'redirectToHome',
      redirect: '/account/myAccount'
    },
    {
      path: '/account',
      name: 'Account',
      component: AccountContainer,
      redirect: '/account/myAccount',
      children: [
        {
          path: 'myAccount',
          name: 'MyAccount',
          component: MyAccount
        },
        {
          path: 'transactionDetail',
          name: 'TransactionDetail',
          component: TransactionDetail
        },
        {
          path: 'discountCoupon',
          name: 'DiscountCoupon',
          component: DiscountCoupon
        }
      ]
    },
    {
      path: '/recharge',
      name: 'Recharge',
      component: RechargePage
    },
    {
      path: '/rechargeConfirm',
      name: 'RechargeConfirm',
      component: RechargeConfirm
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderPay',
      name: 'OrderPay',
      component: OrderPay
    },
    {
      path: '/orderCompletion',
      name: 'OrderCompletion',
      component: OrderCompletion
    }
  ]
})
