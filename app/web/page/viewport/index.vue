<template>
  <div>
    <editor-viewport> </editor-viewport>
    <real-name />
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from 'vue-clipboard2'
import editorModule from '@/store/editor'
import skydriveModule from '@/store/skydrive'
import userModule from '@/store/user'
import gitlabModule from '@/store/gitlab'
import pblModule from '@/store/pbl'
import ElementUI from 'element-ui'
import { transfer } from 'vuex-iframe-sync'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import EditorViewport from '@/components/editor/EditorViewport'
import '@/components/common/thirdAuth'
import ba from 'vue-ba'
import RealName from '@/components/common/RealName'

Vue.use(ba, process.env.BAIDU_SITE_ID)
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueClipboard)

const i18n = new VueI18n({
  locale,
  messages: i18nMessages
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

const store = new Vuex.Store({
  modules: {
    skydrive: skydriveModule,
    user: userModule,
    gitlab: gitlabModule,
    editor: editorModule,
    pbl: pblModule
  },
  plugins: [transfer()]
})

export default {
  name: 'Viewport',
  store,
  i18n,
  components: {
    RealName,
    EditorViewport
  }
}
</script>

<style>
html,
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
