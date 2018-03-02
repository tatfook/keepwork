import Vue from 'vue'
import Router from 'vue-router'
const Editor = resolve => require(['@/components/editor/Editor'], resolve)
const PageViewer = resolve => require(['@/components/page_viewer/MdPageViewer'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'PageViewer',
    component: PageViewer
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor
  }
  ]
})
