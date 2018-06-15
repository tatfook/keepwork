<template>
  <component :is='layoutTemplate' v-if='layout'>
    <mod-list-viewer v-if='headerModList' slot='header' :modList='headerModList' :theme='theme' />
    <mod-list-viewer v-if='footerModList' slot='footer' :modList='footerModList' :theme='theme' />
    <mod-list-viewer v-if='sidebarModList' slot='sidebar' :modList='sidebarModList' :theme='theme' />
    <mod-list-viewer :modList='modList' :theme='theme' />
    <div v-if="code ? false : true" class="img404">
      <img src="https://test.keepwork.com/wiki/assets/imgs/404.png" alt="">
      <p>{{$t('common.NoPages')}}</p>
      <el-button class="back" type="primary" round onclick="window.history.back()">{{$t('common.back')}}</el-button>
    </div>
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
      code: 'code',
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
<style lang="scss">
.img404{
  width:40%;
  text-align: center;
  padding: 40px 0 10px 0;
  vertical-align: middle;
  margin: auto;
  img{
    width: 100%;
    object-fit: cover;
  }
  p{
    font-size: 28px;
    margin: 30px 0;
    color: #303133;
    font-weight: bold;
  }
  .back{
    font-size: 14px;
    font-weight: 500;
    width: 110px;
    height: 40px;
    line-height: 40px;
    padding: 0;
    border: 1px solid #337ab7;
    background-color: #337ab7;
    margin: 0 10px;
    border-radius: 100px;
    color: #FFF;
  }
}
</style>