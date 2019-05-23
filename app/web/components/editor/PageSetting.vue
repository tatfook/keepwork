<template>
  <div class='page-setting' v-loading='loading'>
    <div class="page-setting-top">
      <h1 class="top-path" :title="barePath">{{ barePath }}</h1>
      <i class="el-icon-close" @click="changeView('FileManager')"></i>
    </div>
    <div class="page-setting-item">
      <label class="page-setting-label" for="pageDisplayName">{{$t('editor.pageTitle')}}:</label>
      <el-input size="small" v-model="pageDisplayName" @blur="savePageDisplayName"></el-input>
      <span class="el-form-item__error" v-show="displayNameError">{{displayNameError}}</span>
    </div>
    <div class="page-setting-item">
      <label class="page-setting-label">{{$t('editor.pageLayout')}}:</label>
      <div class="page-setting-select">
        <el-select size="small" v-model="selectedLayoutId" filterable @change="selectPageLayout">
          <el-option v-for="(layout) in userSiteLayoutsMap" :key="layout.id" :label="layout.name" :value="layout.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class='page-setting-selected-style'>
      <component :is='selectedStyleComponent'>
        <div slot='header'>{{$t('editor.header')}}</div>
        <div slot='footer'>{{$t('editor.footer')}}</div>
        <div slot='sidebar'>{{$t('editor.aside')}}</div>
        {{$t('editor.main')}}
      </component>
    </div>
    <div class="layoutManagerBtnWrap" @click="openWebsiteSettingDialog">
      <el-button class="layoutManagerBtn" type="primary" size="small">{{$t('editor.layoutManagement')}}</el-button>
    </div>
    <div @click.stop v-if='isWebsiteSettingShow'>
      <website-setting-dialog :activeIndex="1" :show='isWebsiteSettingShow' :sitePath='currentPath' @close='closeWebsiteSettingDialog' />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import stylesList from '@/components/adi/layout/templates'
import { getPageInfoByPath } from '@/lib/utils/gitlab'
import WebsiteSettingDialog from '@/components/common/WebsiteSettingDialog'

export default {
  name: 'PageSetting',
  props: {
    pagePath: String
  },
  data() {
    return {
      loading: true,
      selectedLayoutId: '',
      isWebsiteSettingShow: false,
      pageDisplayName: '',
      displayNameError: ''
    }
  },
  async activated() {
    await Promise.all([
      this.gitlabGetRepositoryTree({ path: this.sitePath }),
      this.userGetSiteLayoutConfig({ path: this.sitePath })
    ]).catch(e => {
      console.error(e)
    })
    this.selectedLayoutId = this.settedPageLayoutId || this.defaultLayoutId
    this.pageDisplayName = this.settedPageDisplayName
    this.loading = false
  },
  computed: {
    ...mapGetters({
      userSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      userGetSettedPageLayoutByPath: 'user/getSettedPageLayoutByPath'
    }),
    currentPath() {
      let pathArr = this.pageInfo.barePath.split('/')
      let path = []
      path.push(pathArr[0])
      path.push(pathArr[1])
      return path.join('/')
    },
    pageInfo() {
      return getPageInfoByPath(this.pagePath)
    },
    sitePath() {
      return this.pageInfo.sitepath
    },
    barePath() {
      let index = this.pageInfo.barePath.indexOf('/')
      return this.pageInfo.barePath.substr(index + 1)
    },
    relativePath() {
      return this.pageInfo.relativePath
    },
    defaultLayoutId() {
      return _.get(
        this.userSiteLayoutConfig,
        ['layoutConfig', 'defaultLayoutId'],
        ''
      )
    },
    userSiteLayoutConfig() {
      return this.userSiteLayoutConfigBySitePath(this.sitePath)
    },
    userSiteLayoutsMap() {
      return _.keyBy(
        _.filter(
          _.get(this.userSiteLayoutConfig, ['layoutConfig', 'layouts'], []),
          o => !o.deleted
        ),
        'id'
      )
    },
    settedPageLayout() {
      return this.userGetSettedPageLayoutByPath(this.pagePath)
    },
    settedPageLayoutId() {
      return _.get(this.settedPageLayout, 'id', '')
    },
    settedPageDisplayName() {
      return _.get(
        this.userSiteLayoutConfig,
        ['pages', this.relativePath, 'displayName'],
        ''
      )
    },
    selectedLayout() {
      return this.userSiteLayoutsMap[this.selectedLayoutId]
    },
    selectedStyleComponent() {
      return _.get(
        stylesList[_.get(this.selectedLayout, 'styleName', 'basic')],
        'component'
      )
    }
  },
  methods: {
    ...mapActions({
      userGetSiteLayoutConfig: 'user/getSiteLayoutConfig',
      userSaveSiteLayoutConfig: 'user/saveSiteLayoutConfig',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      setActiveManagePaneComponent: 'setActiveManagePaneComponent'
    }),
    changeView(type) {
      this.setActiveManagePaneComponent(type)
    },
    async savePageDisplayName() {
      this.pageDisplayName = _.trim(this.pageDisplayName)
      if (this.settedPageDisplayName === this.pageDisplayName) return
      if (this.pageDisplayName.length > 50) {
        this.displayNameError = this.$t('editor.setPageDisplayNameError')
        return
      }
      this.loading = true
      let payload = {
        sitePath: this.sitePath,
        pages: {
          [this.relativePath]: {
            displayName: this.pageDisplayName,
            layout: this.settedPageLayoutId || this.defaultLayoutId
          }
        }
      }
      await this.userSaveSiteLayoutConfig(payload).catch(e => console.error(e))
      this.displayNameError = ''
      this.loading = false
    },
    async selectPageLayout() {
      if (this.settedPageLayoutId == this.selectedLayoutId) return

      this.loading = true
      let payload = {
        sitePath: this.sitePath,
        pages: {
          [this.relativePath]: {
            layout: this.selectedLayoutId
          }
        }
      }
      await this.userSaveSiteLayoutConfig(payload).catch(e => console.error(e))
      this.loading = false
    },
    openWebsiteSettingDialog() {
      this.isWebsiteSettingShow = true
    },
    closeWebsiteSettingDialog() {
      this.isWebsiteSettingShow = false
    }
  },
  components: {
    WebsiteSettingDialog
  }
}
</script>

<style lang="scss">
.page-setting {
  padding: 20px;
  &-item {
    margin-bottom: 40px;
    position: relative;
  }
  &-label {
    font-size: 14px;
    color: #535353;
    margin-bottom: 10px;
    display: inline-block;
  }
}
.page-setting-top {
  position: relative;
  .top-path {
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 42px;
    padding-right: 30px;
  }
  i {
    position: absolute;
    right: 0px;
    top: -2px;
    font-size: 22px;
    cursor: pointer;
  }
}
.page-setting-select {
  text-align: center;
  .el-select {
    width: 100%;
  }
}
.layoutManagerBtnWrap {
  width: 270px;
  margin: auto;
  .layoutManagerBtn {
    width: 100%;
    margin: 0 auto;
    border-radius: 32px;
  }
}
.page-setting-selected-style {
  margin: 20px auto;
  width: 270px;
  height: 150px;
  // border: 5px solid #1989FA;
  .el-header,
  .el-footer,
  .el-aside,
  .el-main {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-header,
  .el-footer {
    background: #b3c0d1 !important;
  }
  .el-aside {
    max-width: 50px !important;
    background: #d3dce6 !important;
  }
  .el-main {
    background: #e4eef3;
  }
  .maxwidth-template {
    .el-main {
      margin: 0 !important;
      border-left: 40px solid white;
      border-right: 40px solid white;
    }
  }
  .fullscreen-template {
    &-max-width {
      border: 40px solid #fff;
      border-width: 0 40px;
    }
  }
  .content-max-width-template {
    border: 40px solid #fff;
    border-width: 0 40px;
  }
}
</style>

