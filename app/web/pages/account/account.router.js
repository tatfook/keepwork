import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const AccountContainer = () => import('@/components/account/AccountContainer')
const MyAccount = () => import('@/components/account/MyAccount')
const TransactionDetail = () => import('@/components/account/TransactionDetail')
const DiscountCoupon = () => import('@/components/account/DiscountCoupon')

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
    }
  ]
})
