<template>
  <component :is='layoutTemplate' v-if='layout'>
    <mod-list-viewer v-if='headerModList' slot='header' :modList='headerModList' :theme='theme' />
    <mod-list-viewer v-if='footerModList' slot='footer' :modList='footerModList' :theme='theme' />
    <mod-list-viewer v-if='sidebarModList' slot='sidebar' :modList='sidebarModList' :theme='theme' />
    <mod-list-viewer :modList='modList' :theme='theme' />
  </component>
</template>

<script>
import layoutTemplates from '@/components/adi/layout/templates'
import ModListViewer from './ModListViewer'
import themeFactory from '@/lib/theme/theme.factory'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      layout: 'layout',
      modList: 'modList',
      headerModList: 'headerModList',
      footerModList: 'footerModList',
      sidebarModList: 'sidebarModList',
      themeConf: 'themeConf'
    }),
    theme() {
      let newTheme = themeFactory.generate(this.themeConf)
      if (this.storedTheme === newTheme) return this.storedTheme
      if (this.storedTheme) this.storedTheme.sheet.detach()
      this.storedTheme = newTheme
      this.storedTheme.sheet.attach()
      return this.storedTheme
    },
    layoutTemplate() {
      return layoutTemplates[this.layout.styleName]
    }
  },
  components: {
    ModListViewer
  }
}
</script>
