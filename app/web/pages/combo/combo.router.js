import Vue from 'vue'
import Router from 'vue-router'

const ComboBoxView = () => import('@/components/combo/ComboBoxView')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/combo',
  routes: [
    {
      path: '*',
      name: 'Combo',
      component: ComboBoxView
    }
  ]
})
