<template>
  <div v-loading='loading'>
    <el-row>
      <el-col :span="6" class="website-setting-layouts">
        <el-button size="mini" type="text" @click.stop="addLayout">添加布局</el-button>
        <div
          v-for='(layout) in siteLayoutsMap'
          :key='layout.id'
          class="website-setting-layout-item" 
          :class="{active: selectedLayoutId==layout.id}"
          @click.stop="selectLayout(layout)"
        >
          <div v-if="selectedLayoutNameEdittable && selectedLayoutId==layout.id">
            <el-form class="website-setting-name" :model="layoutForm" :rules="layoutFormRules" ref="layoutNameForm">
              <el-form-item prop="name">
                <el-input placeholder="name" v-model="layoutForm.name"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            {{ layout.name }}
            <el-button size="mini" type="text" @click.stop="editLayout(layout)">编辑</el-button>
            <el-button size="mini" type="text" @click.stop="removeLayout(layout)">删除</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="website-setting-styles">
        <div
          v-for='(styleComponent, name) in stylesList'
          :key='name'
          class="website-setting-style-item"
          :class="{active: selectedLayoutStyleName==name}"
          @click.stop="selectStyle(name)"
          >
          {{ name }}
        </div>
      </el-col>
      <el-col :span="10" class="website-setting-layoutconfig">
        <el-form class="website-setting-config" :model="layoutForm" :rules="layoutFormRules" ref="layoutConfigForm">
          <el-form-item prop="header">
            header
            <el-select v-model="layoutForm.header" filterable placeholder="Select">
              <el-option
                v-for="fileName in getAvailableContentFileNames('header')"
                :key="fileName"
                :label="fileName"
                :value="fileName">
              </el-option>
            </el-select>
            <el-button icon="el-icon-plus" @click.stop="addLayoutContentFile('header')"></el-button>
          </el-form-item>
          <el-form-item prop="sidebar">
            sidebar
            <el-select v-model="layoutForm.sidebar" filterable placeholder="Select">
              <el-option
                v-for="fileName in getAvailableContentFileNames('sidebar')"
                :key="fileName"
                :label="fileName"
                :value="fileName">
              </el-option>
            </el-select>
            <el-button icon="el-icon-plus" @click.stop="addLayoutContentFile('sidebar')"></el-button>
          </el-form-item>
          <el-form-item prop="footer">
            footer
            <el-select v-model="layoutForm.footer" filterable placeholder="Select">
              <el-option
                v-for="fileName in getAvailableContentFileNames('footer')"
                :key="fileName"
                :label="fileName"
                :value="fileName">
              </el-option>
            </el-select>
            <el-button icon="el-icon-plus" @click.stop="addLayoutContentFile('footer')"></el-button>
          </el-form-item>
          <el-form-item prop="match">
            <el-input placeholder="match" v-model="layoutForm.match">
              <template slot="prepend">match</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span class="dialog-footer">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleClose">放弃</el-button>
    </span>
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { suffixFileExtension } from '@/lib/utils/gitlab'
import LayoutHelper from '@/lib/mod/layout'
import layoutTemplates from '@/components/adi/layout/templates'
const stylesList = layoutTemplates

export default {
  name: 'WebsiteSettingLayout',
  props: {
    sitePath: String,
  },
  data() {
    let nameValidator = (rule, value, callback) => {
      let trimmedValue = value.trim()
      if (!trimmedValue) {
        return callback(new Error('不能为空'))
      }
      return callback()
    }

    return {
      loading: true,
      selectedLayoutId: NaN,
      selectedLayoutNameEdittable: false,
      updatedLayoutsMap: {}, // this is for modify the unsaved layoutConfig data
      stylesList,
      layoutForm: {
        name: '',
        header: '',
        sidebar: '',
        footer: '',
        match: ''
      },
      layoutFormRules: {
        name: {
          validator: nameValidator
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      userSiteLayoutsBySitePath: 'user/siteLayoutsBySitePath',
      gitlabChildNamesByPath: 'gitlab/childNamesByPath'
    }),
    userSiteLayoutsMapClone() {
      let userSiteLayouts = this.userSiteLayoutsBySitePath(this.sitePath)
      return _.cloneDeep(_.keyBy(userSiteLayouts, 'id'))
    },
    allSiteLayoutsMap() {
      return _.merge({}, this.userSiteLayoutsMapClone, this.updatedLayoutsMap)
    },
    allUnsavedLayouts() {
      return _.values(_.pickBy(
        this.allSiteLayoutsMap,
        ({ id, deleted }) => this.userSiteLayoutsMapClone[id] || !deleted
      ))
    },
    siteLayoutsMap() {
      return _.pickBy(this.allSiteLayoutsMap, ({ deleted }) => !deleted)
    },
    firstLayout() {
      return _.values(this.siteLayoutsMap)[0]
    },
    siteLayoutsLength() {
      return _.values(this.siteLayoutsMap).length
    },
    selectedLayout() {
      return this.siteLayoutsMap[this.selectedLayoutId]
    },
    selectedUpdatedLayout() {
      return this.updatedLayoutsMap[this.selectedLayoutId] || {}
    },
    selectedLayoutStyleName() {
      return _.get(this.selectedLayout, 'styleName', '')
    },
    selectedLayoutForm() {
      let selectedLayout = this.selectedLayout
      return {
        name: _.get(selectedLayout, 'name', ''),
        header: _.get(selectedLayout, ['content', 'header'], '').replace(/\.md$/,''),
        sidebar: _.get(selectedLayout, ['content', 'sidebar'], '').replace(/\.md$/,''),
        footer: _.get(selectedLayout, ['content', 'footer'], '').replace(/\.md$/,''),
        match: _.get(selectedLayout, 'match', '')
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.gitlabGetRepositoryTree({path: this.sitePath}),
      this.userGetSiteLayoutConfig({path: this.sitePath})
    ]).catch(e => {
      console.error(e)
      this.loading = false
    })
    this.selectFirstLayout()
    this.loading = false
  },
  watch: {
    layoutForm: {
      handler(layoutForm) {
        this.updateSelectedLayout({
          name: layoutForm.name,
          match: layoutForm.match,
          content: {
            header: suffixFileExtension(layoutForm.header, 'md'),
            sidebar: suffixFileExtension(layoutForm.sidebar, 'md'),
            footer: suffixFileExtension(layoutForm.footer, 'md')
          }
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      userGetSiteLayoutConfig: 'user/getSiteLayoutConfig',
      userSaveSiteLayoutConfigLayouts: 'user/saveSiteLayoutConfigLayouts',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      gitlabCreateFile: 'gitlab/createFile'
    }),
    addLayout() {
      let newLayout = LayoutHelper.newLayout()
      Vue.set(this.updatedLayoutsMap, newLayout.id, newLayout)
      this.selectLayout(newLayout)
    },
    removeLayout(layout) {
      if (this.siteLayoutsLength <= 1) return alert('Keep one layout at least!')
      Vue.set(this.updatedLayoutsMap, layout.id, {
        ...this.updatedLayoutsMap[layout.id],
        deleted: true
      })
    },
    selectLayout(layout) {
      if (this.selectedLayoutId == layout.id) return
      this.selectedLayoutId = layout.id
      this.disalbeSelectedLayoutNameEdittable()
      this.resetLayoutForm()
    },
    selectFirstLayout() {
      this.firstLayout && this.selectLayout(this.firstLayout)
    },
    resetLayoutForm() {
      _.merge(this.layoutForm, this.selectedLayoutForm)
    },
    selectStyle(styleName) {
      this.updateSelectedLayout({styleName})
    },
    updateSelectedLayout(updatedInfo) {
      Vue.set(
        this.updatedLayoutsMap,
        this.selectedLayoutId,
        _.merge({}, this.selectedUpdatedLayout, updatedInfo)
      )
    },
    editLayout(layout) {
      this.selectLayout(layout)
      this.enableSelectedLayoutNameEdittable()
    },
    disalbeSelectedLayoutNameEdittable() {
      this.selectedLayoutNameEdittable = false
    },
    enableSelectedLayoutNameEdittable() {
      this.selectedLayoutNameEdittable = true
    },
    getAvailableContentFileNames(contentKey) {
      let contentFolderPath = LayoutHelper.layoutContentFolderPath(this.sitePath, contentKey)
      let childNames = this.gitlabChildNamesByPath(contentFolderPath)
      return childNames
    },
    async addLayoutContentFile(contentKey) {
      let newFileName = await this.newLayoutContentFileNamePrompt({contentKey})
      newFileName = suffixFileExtension(newFileName, 'md')
      let contentFolderPath = LayoutHelper.layoutContentFolderPath(this.sitePath, contentKey)
      let newFilePath = `${contentFolderPath}/${newFileName}`
      this.loading = true
      await this.gitlabCreateFile({ path: newFilePath }).then(
        async () => await this.gitlabGetRepositoryTree({ path: this.sitePath })
      ).catch(e => {
        console.error(e)
        this.loading = false
      })
      this.loading = false
    },
    async newLayoutContentFileNamePrompt({contentKey}) {
      let self = this
      let childNames = this.getAvailableContentFileNames(contentKey)

      let what = contentKey
      let { value: newFileName } = await this.$prompt(
        `${what} ${self.$t('editor.nameSingle')}`,
        `${self.$t('editor.create')} ${what}`,
        {
          cancelButtonText: self.$t('el.messagebox.cancel'),
          confirmButtonText: self.$t('el.messagebox.confirm'),
          inputValidator: str => {
            let value = (str || '').trim()
            if (!value) return `${what} ${self.$t('editor.emptyName')}`
            if (!/^[A-Za-z0-9_]+$/.test(value)) return `${what} ${self.$t('editor.nameRule')}`
            if (/^[_]/.test(value)) return `${what} ${self.$t('editor.nameUnderline')}`
            if (childNames.indexOf(value) > -1) return self.$t('editor.nameExist')
            return true
          }
        }
      )
      return newFileName && newFileName.trim()
    },
    async handleSave() {
      this.loading = true
      await this.userSaveSiteLayoutConfigLayouts({
        sitePath: this.sitePath,
        layouts: this.allUnsavedLayouts
      }).catch(e => {
        console.error(e)
        this.loading = false
      })
      this.loading = false
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang='scss'>
.website-setting {
  &-layout-item {
    &.active {
      box-shadow: 0 0 1px blue;
    }
  }
  &-style-item {
    &.active {
      box-shadow: 0 0 1px blue;
    }
  }
}
</style>
