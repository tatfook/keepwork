<template>
  <!-- <combo-box-view></combo-box-view> -->
  <router-view></router-view>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import router from './combo.router'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from 'vue-clipboard2'
import editorModule from '@/store/editor'
import userModule from '@/store/user'
import comboModule from '@/store/combo'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import EditorViewport from '@/components/editor/EditorViewport'
import '@/components/common/thirdAuth'
import ComboBoxView from '@/components/combo/ComboBoxView'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale,
  messages: i18nMessages
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
const store = new Vuex.Store({
  modules: {
    user: userModule,
    editor: editorModule,
    combo: comboModule
  }
})

export default {
  name: 'Combo',
  router,
  store,
  components: {
    ComboBoxView
  }
}
</script>
