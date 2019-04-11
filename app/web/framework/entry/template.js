import Layout from 'component/layout/default'
import 'babel-polyfill'

export default function(Vue) {
  Vue.component(Layout.name, Layout)
}
