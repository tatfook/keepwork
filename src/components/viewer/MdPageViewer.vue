<template>
  <component :is='layoutTemplate'>
    <mod-list-viewer v-if='hasHeader' slot='header' modList='headerModList' />
    <mod-list-viewer v-if='hasFooter' slot='footer' modList='footerModList' />
    <mod-list-viewer v-if='hasSidebar' slot='sidebar' modList='sidebarModList' />
    <mod-list-viewer modList='modList' />
  </component>
</template>

<script>
import layoutTemplates from '@/components/adi/layout/templates'
import ModListViewer from './MdPageViewer'
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
      return layoutTemplates[this.layout.styleID]
    }
  },
  components: {
    ModListViewer
  }
}
</script>
