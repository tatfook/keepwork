import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const MessageContainer = () => import('@/components/message/MessageContainer')
const MessageSystem = () => import('@/components/message/MessageSystem')

export default new Router({
  mode: 'history',
  base: '/msg',
  routes: [{
    path: '*',
    name: 'redirectToMessage',
    redirect: '/message/system'
  }, {
    path: '/message',
    name: 'MessageContainer',
    component: MessageContainer,
    redirect: '/message/system',
    children: [{
      name: 'System',
      path: 'system',
      component: MessageSystem
    }]
  }]
})