import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const MessagePage = () => import('@/components/common/message/MessagePage')

export default new Router({
  mode: 'history',
  base: '/msg',
  routes: [{
    path: '*',
    name: 'redirectToMessage',
    redirect: { name: 'MessagePage' }
  }, {
    path: '/message',
    name: 'MessagePage',
    component: MessagePage,

  }]
})