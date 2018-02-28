import Vue from 'vue'
import Router from 'vue-router'
const Editor = resolve => require(['@/components/editor/Editor'], resolve)
const MdPage = resolve => require(['@/components/md-page/MdPage'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'MdPage',
    component: MdPage
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor
  }
  ]
})
