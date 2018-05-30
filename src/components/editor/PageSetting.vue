<template>
  <div class='page-setting' v-loading='loading'>
    <h1>{{ barePath }}</h1>
    <el-select size="small" v-model="selectedLayoutId" filterable :placeholder="this.$t('editor.select')" @change="selectPageLayout">
      <el-option
        v-for="(layout) in userSiteLayoutsMap"
        :key="layout.id"
        :label="layout.name"
        :value="layout.id">
      </el-option>
    </el-select>
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
  async mounted() {
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
      return this.pageInfo.barePath
    },
    relativePath() {
      return this.pageInfo.relativePath
    },
    userSiteLayoutConfig() {
      return this.userSiteLayoutConfigBySitePath(this.sitePath)
    },
    userSiteLayoutsMap() {
      return _.filter(_.get(this.userSiteLayoutConfig, ['layoutConfig', 'layouts'], []), o => !o.deleted)
    },
    settedPageLayout() {
      return this.userGetSettedPageLayoutByPath(this.pagePath)
    },
    settedPageLayoutId() {
      return _.get(this.settedPageLayout, 'id', NaN)
    },
    selectedLayout() {
      return this.userSiteLayoutsMap[this.selectedLayoutId || this.selectedLayoutId]
    },
    selectedStyleComponent() {
      return stylesList[_.get(this.selectedLayout, 'styleName', 'basic')]
    }
  },
  methods: {
    ...mapActions({
      userGetSiteLayoutConfig: 'user/getSiteLayoutConfig',
      userSaveSiteLayoutConfig: 'user/saveSiteLayoutConfig',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree'
    }),
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

