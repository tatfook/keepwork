<template>
  <div class='page-setting' v-loading='loading'>
    <div class="page-setting-top">
      <h1>{{ barePath }}</h1>
      <i class="el-icon-close" @click="changeView('FileManager')"></i>
    </div>
    <div class="page-setting-select">
      <el-select size="small" v-model="selectedLayoutId" filterable :placeholder="this.$t('editor.select')" @change="selectPageLayout">
        <el-option
          v-for="(layout) in userSiteLayoutsMap"
          :key="layout.id"
          :label="layout.name"
          :value="layout.id">
        </el-option>
      </el-select>
    </div>    
    <div class='page-setting-selected-style'>
      <component :is='selectedStyleComponent'>
        <div slot='header'>header</div>
        <div slot='footer'>footer</div>
        <div slot='sidebar'>aside</div>
        main
      </component>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import stylesList from '@/components/adi/layout/templates'
import { getPageInfoByPath } from '@/lib/utils/gitlab'

export default {
  name: 'PageSetting',
  props: {
    pagePath: String,
  },
  data() {
    return {
      loading: true,
      selectedLayoutId: ''
    }
  },
  async activated() {
    await Promise.all([
      this.gitlabGetRepositoryTree({path: this.sitePath}),
      this.userGetSiteLayoutConfig({path: this.sitePath})
    ]).catch(e => {
      console.error(e)
    })
    this.selectedLayoutId = this.settedPageLayoutId || ''
    this.loading = false
  },
  computed: {
    ...mapGetters({
      userSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      userGetSettedPageLayoutByPath: 'user/getSettedPageLayoutByPath'
    }),
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
    userSiteLayoutConfig() {
      return this.userSiteLayoutConfigBySitePath(this.sitePath)
    },
    userSiteLayoutsMap() {
      return _.keyBy(_.filter(_.get(this.userSiteLayoutConfig, ['layoutConfig', 'layouts'], []), o => !o.deleted), 'id')
    },
    settedPageLayout() {
      return this.userGetSettedPageLayoutByPath(this.pagePath)
    },
    settedPageLayoutId() {
      return _.get(this.settedPageLayout, 'id', '')
    },
    selectedLayout() {
      return this.userSiteLayoutsMap[this.selectedLayoutId]
    },
    selectedStyleComponent() {
      return stylesList[_.get(this.selectedLayout, 'styleName', 'basic')]
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
    }
  }
}
</script>

<style lang="scss">
.page-setting{
  padding:0 30px;
}
.page-setting-top{
  position: relative;
  i{
    position: absolute;
    right: 0;
    top: 2px;
    font-size: 22px;
    cursor: pointer;
  }
}
.page-setting-select{
  text-align: center;
  .el-select{
    width: 270px;
  }
}
.page-setting-selected-style {
  margin: 20px auto;
  width: 260px;
  height: 150px;
  border: 5px solid #1989FA;
  .el-header, .el-footer, .el-aside, .el-main {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-header, .el-footer {
    background: #B3C0D1 !important;
  }
  .el-aside {
    max-width: 50px !important;
    background: #D3DCE6 !important;
  }
  .el-main {
    background: #E4EEF3;
  }
  .maxwidth-template {
    .el-main {
      margin: 0 !important;
      border-left: 40px solid white;
      border-right: 40px solid white;
    }
  }
}
</style>

