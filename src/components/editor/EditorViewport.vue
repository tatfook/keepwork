<template>
  <div class='viewport-container' v-if='layout'>
    <component :is='layoutTemplate'>
      <editor-viewport-partial v-if='headerModList' slot='header' :modList='headerModList' :theme='theme' :area='HEADER_AREA' />
      <editor-viewport-partial v-if='footerModList' slot='footer' :modList='footerModList' :theme='theme' :area='FOOTER_AREA' />
      <editor-viewport-partial v-if='sidebarModList' slot='sidebar' :modList='sidebarModList' :theme='theme' :area='SIDEBAR_AREA' />
      <editor-viewport-partial :modList='mainModList' :theme='theme' :area='MAIN_AREA' />
    </component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  MAIN_AREA,
  HEADER_AREA,
  FOOTER_AREA,
  SIDEBAR_AREA
} from '@/lib/mod/layout/const'
import EditorViewportPartial from './EditorViewportPartial'
import layoutTemplates from '@/components/adi/layout/templates'
import themeFactory from '@/lib/theme/theme.factory'

export default {
  name: 'EditorViewport',
  data() {
    return {
      MAIN_AREA,
      HEADER_AREA,
      FOOTER_AREA,
      SIDEBAR_AREA
    }
  },
  components: {
    EditorViewportPartial
  },
  computed: {
    ...mapGetters({
      layout: 'layout',
      mainModList: 'mainModList',
      headerModList: 'headerModList',
      footerModList: 'footerModList',
      sidebarModList: 'sidebarModList',
      themeConf: 'themeConf',
      activeArea: 'activeArea'
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
  methods: {
    openModSelector(key) {
      this.$store.dispatch('setActiveManagePaneComponent', 'ModsList')
    },
    changeDraggableList(evt) {
      if (evt.moved) {
        this.$store.dispatch('moveMod', {
          oldIndex: evt.moved.oldIndex,
          newIndex: evt.moved.newIndex
        })
      }
    }
  }
}
</script>
<style scoped>
.viewport-container {
  flex: 1;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
}
.add-btn-row {
  text-align: center;
  padding-top: 43px;
  cursor: pointer;
}
.add-mod-btn {
  width: 66px;
  height: 66px;
  background-color: #3ba4ff;
  color: #fff;
  padding: 0;
  font-size: 40px;
}
.info {
  font-size: 25px;
  color: #c0c4cc;
  margin-top: 13px;
}
</style>
