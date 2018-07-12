<template>
  <div class="md-page-viewer">
    <div v-if='sidebarModList' class="toggle-sidebar-main-button" :class="{'position-right': (showSidebarOrMain === 'sidebar')}" @click="toggleSidebarMainShow">
      <i class="iconfont icon-arrowsdownline"></i>
    </div>    
    <component :is='layoutTemplate' :showSidebarOrMain='showSidebarOrMain' v-if='layout'>
      <mod-list-viewer v-if='headerModList' slot='header' :modList='headerModList' :theme='theme' />
      <mod-list-viewer v-if='footerModList' slot='footer' :modList='footerModList' :theme='theme' />
      <mod-list-viewer v-if='sidebarModList' slot='sidebar' :modList='sidebarModList' :theme='theme' />
      <mod-list-viewer :modList='modList' :theme='theme' />
      <div v-if="show404" class="img404">
        <img src="https://test.keepwork.com/wiki/assets/imgs/404.png" alt="">
        <p>{{$t('common.NoPages')}}</p>
        <el-button class="back" type="primary" round onclick="window.history.back()">{{$t('common.back')}}</el-button>
      </div>
    </component>
    <scrollTop></scrollTop>
  </div>
</template>

<script>
import layoutTemplates from '@/components/adi/layout/templates'
import ModListViewer from './ModListViewer'
import themeFactory from '@/lib/theme/theme.factory'
import { mapGetters } from 'vuex'
import scrollTop from '@/components/common/QuickToTop'

export default {
  data() {
    return {
      mountedSecondsTimer: NaN,
      mountedSeconds: 0,
      showSidebarOrMain: 'main'
    }
  },
  mounted() {
    this.mountedSecondsTimer = setInterval(() => this.mountedSeconds++, 1000)
  },
  unmounted() {
    clearInterval(this.mountedSecondsTimer)
  },
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
    show404() {
      return this.code === undefined && this.mounted3SecondsAgo
    },
    mounted3SecondsAgo() {
      return this.mountedSeconds >= 3
    },
    theme() {
      let newTheme = themeFactory.generate(this.themeConf)
      if (this.storedTheme === newTheme) return this.storedTheme
      if (this.storedTheme) this.storedTheme.sheet.detach()
      this.storedTheme = newTheme
      this.storedTheme.sheet.attach()
      return this.storedTheme
    },
    layoutTemplate() {
      return layoutTemplates[this.layout.styleName]['component']
    }
  },
  components: {
    ModListViewer,
    scrollTop
  },
  methods: {
    toggleSidebarMainShow() {
      switch (this.showSidebarOrMain) {
        case 'main':
          this.showSidebarOrMain = 'sidebar'
          break
        default:
          this.showSidebarOrMain = 'main'
          break
      }
    }
  }
}
</script>
<style lang="scss">
.md-page-viewer {
  .el-aside {
    max-width: 100%;
  }
  .toggle-sidebar-main-button {
    display: none;
  }
}
@media (max-width: 768px) {
  .md-page-viewer {
    .hide {
      display: none;
    }
    .toggle-sidebar-main-button {
      display: block;
      cursor: pointer;
      width: 40px;
      height: 88px;
      line-height: 88px;
      background-color: #99cffe;
      color: #fff;
      position: fixed;
      top: 130px;
      border-radius: 20px;
      left: -20px;
      right: auto;
      text-align: right;
      padding: 0 3px;
      box-sizing: border-box;
      z-index: 11111;
    }
    .toggle-sidebar-main-button.position-right {
      left: auto;
      right: -20px;
      text-align: left;
      .iconfont {
        display: inline-block;
        transform: rotate(180deg);
      }
    }
  }
}
.img404 {
  width: 40%;
  text-align: center;
  padding: 40px 0 10px 0;
  vertical-align: middle;
  margin: auto;
  img {
    width: 100%;
    max-width: 456px;
    object-fit: cover;
  }
  p {
    font-size: 28px;
    margin: 30px 0;
    color: #303133;
    font-weight: bold;
  }
  .back {
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
    color: #fff;
  }
}
</style>