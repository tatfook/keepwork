import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const AccountContainer = () => import('@/components/account/AccountContainer')
const MyAccount = () => import('@/components/account/MyAccount')
const TransactionDetail = () => import('@/components/account/TransactionDetail')
const DiscountCoupon = () => import('@/components/account/DiscountCoupon')
const RechargePay = () => import('@/components/account/RechargePay')
const RechargeConfirm = () => import('@/components/account/RechargeConfirm')
const RechargeSuccess = () => import('@/components/account/RechargeSuccess')

const OrderConfirm = () => import('@/components/account/OrderConfirm')
const OrderPay = () => import('@/components/account/OrderPay')
const OrderSuccess = () => import('@/components/account/OrderSuccess')

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
      path: '/rechargeConfirm',
      name: 'RechargeConfirm',
      component: RechargeConfirm
    },
    {
      path: '/rechargePay',
      name: 'RechargePay',
      component: RechargePay
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/rechargeSuccess',
      name: 'RechargeSuccess',
      component: RechargeSuccess
    },
    {
      path: '/orderPay',
      name: 'OrderPay',
      component: OrderPay
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
