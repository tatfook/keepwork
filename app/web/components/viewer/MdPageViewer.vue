<template>
  <div class="md-page-viewer" v-loading="pageLoading">
    <div v-if='isLayoutSidebarShow' class="toggle-sidebar-main-button" :class="{'position-right': (showSidebarOrMain === 'sidebar')}" @click="toggleSidebarMainShow">
      <i class="iconfont icon-arrowsdownline"></i>
    </div>
    <component :is='layoutTemplate' :showSidebarOrMain='showSidebarOrMain' v-if='layout'>
      <mod-list-viewer v-if='headerModList' slot='header' :modList='headerModList' :theme='theme' />
      <mod-list-viewer v-if='footerModList' slot='footer' :modList='footerModList' :theme='theme' />
      <mod-list-viewer v-if='sidebarModList' slot='sidebar' :modList='sidebarModList' :theme='theme' />
      <mod-list-viewer :modList='mainModList' :theme='theme' />
    </component>
    <div v-if="show404" class="img404">
      <img src="@/assets/img/no_right_to_access.png" alt="">
      <p>{{$t('common.NoPages')}}</p>
      <!-- <el-button type="primary" round onclick="window.history.back()">{{$t('common.back')}}</el-button> -->
      <el-button v-if="!userIsLogined" type="primary" round @click="toLogin">{{$t('common.login')}}</el-button>
    </div>
    <quick-to-top></quick-to-top>
    <div @click.stop v-if="isLoginDialogShow">
      <login-dialog :show="isLoginDialogShow" @close="closeLoginDialog"></login-dialog>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import layoutTemplates from '@/components/adi/layout/templates'
import ModListViewer from './ModListViewer'
import themeFactory from '@/lib/theme/theme.factory'
import { mapGetters, mapActions } from 'vuex'
import QuickToTop from '@/components/common/QuickToTop'
import LoginDialog from '@/components/common/LoginDialog'

export default {
  props: {
    showPreviewClose: {
      type: Boolean,
      default: false
    },
    pageLoading: Boolean
  },
  data() {
    return {
      isDialogClosed: false,
      showSidebarOrMain: 'main'
    }
  },
  async mounted() {
    await this.userGetWebsiteDetailInfoByPath({
      path: this.activePageInfo.sitepath
    }).catch(e => console.error(e))
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo',
      activePage: 'activePage',
      code: 'code',
      layout: 'layout',
      modList: 'modList',
      headerModList: 'headerModList',
      footerModList: 'footerModList',
      sidebarModList: 'sidebarModList',
      mainModList: 'mainModList',
      themeConf: 'themeConf',
      userIsLogined: 'user/isLogined',
      userGetSiteDetailInfoByPath: 'user/getSiteDetailInfoByPath'
    }),
    siteDetailInfo() {
      if (!this.activePageInfo) return {}
      return (
        this.userGetSiteDetailInfoByPath(this.activePageInfo.fullPath) || {}
      )
    },
    siteVisibility() {
      return _.get(this.siteDetailInfo, ['siteinfo', 'visibility'], 0)
    },
    isSitePrivate() {
      return this.siteVisibility === 1
    },
    isLoginDialogShow() {
      return !this.isDialogClosed && !this.userIsLogined && this.isSitePrivate
    },
    show404() {
      return (
        !this.pageLoading &&
        !this.isLoginDialogShow &&
        !this.headerModList &&
        !this.footerModList &&
        !this.sidebarModList &&
        this.code === undefined
      )
    },
    theme() {
      let newTheme = themeFactory.generate(this.themeConf)
      if (this.storedTheme === newTheme) return this.storedTheme
      if (this.storedTheme) this.storedTheme.sheet.detach()
      this.storedTheme = newTheme
      this.storedTheme.sheet.attach()
      return this.storedTheme
    },
    styleName(){
      return _.get(this.layout, 'styleName', '')
    },
    layoutTemplate() {
      return _.get(layoutTemplates, `${this.styleName}.component`)
    },
    isLayoutSidebarShow(){
      return _.get(layoutTemplates, `${this.styleName}.sidebar`) && this.sidebarModList.length > 0
    }
  },
  methods: {
    ...mapActions({
      userGetWebsiteDetailInfoByPath: 'user/getWebsiteDetailInfoByPath'
    }),
    closeLoginDialog() {
      this.isDialogClosed = true
    },
    toggleSidebarMainShow() {
      switch (this.showSidebarOrMain) {
        case 'main':
          this.showSidebarOrMain = 'sidebar'
          break
        default:
          this.showSidebarOrMain = 'main'
          break
      }
    },
    toLogin() {
      this.isDialogClosed = false
    }
  },
  components: {
    ModListViewer,
    QuickToTop,
    LoginDialog
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
    .hide-on-phone {
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
@media print {
  .md-page-viewer {
    .toggle-sidebar-main-button {
      display: none;
    }
  }
}
.img404 {
  width: 40%;
  text-align: center;
  padding: 40px 0 10px 0;
  vertical-align: middle;
  margin: 6% auto 0;
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
