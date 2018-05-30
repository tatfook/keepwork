<template>
  <div v-loading='loading' @click.stop="handleDialogClick">
    <el-row class="website-setting-layout">
      <el-col :span="6" class="website-setting-layouts">
        <header>
          <h1>{{$t('editor.layoutPlan')}}</h1>
        </header>
        <main>
          <el-button class="add-layout-btn" icon="el-icon-plus" type="text" @click.stop="addLayout">{{$t('editor.addLayout')}}</el-button>
          <div class="website-setting-layout-list">
            <div
              v-for='(layout) in siteLayoutsMap'
              :key='layout.id'
              class="website-setting-layout-item" 
              :class="{
                active: selectedLayoutId==layout.id,
                is_default: unsavedDefaultLayoutId==layout.id
              }"
              @click.stop="selectLayout(layout)"
              :ref="'layout' + layout.id"
            >
              <div v-if="selectedLayoutNameEdittable && selectedLayoutId==layout.id" class="input-state">
                <el-form class="website-setting-name" :model="layoutForm" :rules="layoutFormRules" ref="layoutNameForm">
                  <el-form-item prop="name">
                    <el-input placeholder="name" size="small" v-model="layoutForm.name"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div v-else class="display-state">
                <label>
                  {{ layout.name }}
                </label>
                <span class="display-state-btns">
                  <el-button
                    class="default-btn"
                    :class="{is_default: unsavedDefaultLayoutId==layout.id}"
                    size="mini" type="text"
                    @click.stop="setDefault(layout)"
                    icon="iconfont icon-default"
                    :title="$t('editor.default')">
                  </el-button>
                  <el-button
                    size="mini" type="text"
                    @click.stop="editLayout(layout)"
                    icon="iconfont icon-edit-"
                    :title="$t('editor.rename')">
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click.stop="removeLayout(layout)"
                    icon="iconfont icon-delete"
                    :title="$t('editor.delete')">
                  </el-button>
                </span>
              </div>
            </div>
          </div>
        </main>
      </el-col>
      <el-col :span="7" class="website-setting-styles">
        <header>
          <h1>{{$t('editor.layoutStyle')}}</h1>
        </header>
        <main>
          <div class="website-setting-styles-main">
            <div
              v-for='(styleComponent, name) in stylesList'
              :key='name'
              class="website-setting-style-item"
              :class="{active: selectedLayoutStyleName==name}"
              @click.stop="selectStyle(name)"
              >
              <component :is='styleComponent'>
                <div slot='header'>{{$t('editor.header')}}</div>
                <div slot='footer'>{{$t('editor.footer')}}</div>
                <div slot='sidebar'>{{$t('editor.aside')}}</div>
                {{$t('editor.main')}}
              </component>
            </div>
          </div>
        </main>
      </el-col>
      <el-col :span="8" class="website-setting-layoutconfig">
        <header>
          <h1>{{$t('editor.layoutParameters')}}</h1>
        </header>
        <main>
          <el-form class="website-setting-config" :model="layoutForm" :rules="layoutFormRules" ref="layoutConfigForm">
            <el-form-item prop="header">
              <label>{{$t('editor.header')}}</label>
              <el-select size="small" v-model="layoutForm.header" filterable :placeholder="this.$t('editor.select')">
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
              <label>{{$t('editor.aside')}}</label>
              <el-select size="small" v-model="layoutForm.sidebar" filterable :placeholder="this.$t('editor.select')">
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
              <label>{{$t('editor.footer')}}</label>
              <el-select size="small" v-model="layoutForm.footer" filterable :placeholder="this.$t('editor.select')">
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
              <label>{{$t('editor.match')}}</label>
              <el-input size="small" :placeholder="this.$t('editor.match')" type="textarea" v-model="layoutForm.match">
              </el-input>
              <el-button icon="el-icon-plus" style="visibility:hidden; cursor:default;"></el-button>
            </el-form-item>
          </el-form>
        </main>
      </el-col>
      <el-col :span="3" class="website-setting-btns">
        <el-button type="primary" @click="handleSave">{{$t('editor.save')}}</el-button>
        <el-button @click="handleClose">{{$t('editor.cancel')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { suffixFileExtension } from '@/lib/utils/gitlab'
import LayoutHelper from '@/lib/mod/layout'
import stylesList from '@/components/adi/layout/templates'

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
      newLayoutIndex: 0,
      loading: true,
      selectedLayoutId: NaN,
      selectedLayoutNameEdittable: false,
      updatedLayoutsMap: {}, // this is for modify the unsaved layoutConfig data
      stylesList,
      layoutForm: {
        defaultLayoutId: NaN,
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
      userSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      gitlabChildNamesByPath: 'gitlab/childNamesByPath'
    }),
    userSiteLayoutConfigClone() {
      let userSiteLayoutConfig = this.userSiteLayoutConfigBySitePath(this.sitePath)
      return _.cloneDeep(userSiteLayoutConfig)
    },
    userSiteLayoutsMapClone() {
      return _.keyBy(_.get(this.userSiteLayoutConfigClone, ['layoutConfig', 'layouts'], []), 'id')
    },
    userSiteDefaultLayoutId() {
      return _.get(this.userSiteLayoutConfigClone, ['layoutConfig', 'defaultLayoutId'], NaN)
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
    defaultLayout() {
      return _.values(this.siteLayoutsMap).filter(i => i.id === this.userSiteDefaultLayoutId)[0]
    },
    unsavedDefaultLayoutId() {
      const defaultLayoutIdIsLegal = id => {
        // lodash keys return a string array
        return _.keys(this.siteLayoutsMap).indexOf(id+'') > -1
      }
      let firstLayoutId = _.get(this.firstLayout, 'id', NaN)
      let idCandidates = [
        this.layoutForm.defaultLayoutId,
        this.userSiteDefaultLayoutId,
        firstLayoutId
      ]
      for (let i in idCandidates) {
        if (defaultLayoutIdIsLegal(idCandidates[i])) {
          return idCandidates[i]
        }
      }
      return this.userSiteDefaultLayoutId
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
    // this.selectFirstLayout()
    this.selectDefaultLayout()
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
      userSaveSiteLayoutConfig: 'user/saveSiteLayoutConfig',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      gitlabCreateFile: 'gitlab/createFile'
    }),
    addLayout() {
      let newLayout = LayoutHelper.newLayout(++this.newLayoutIndex)
      Vue.set(this.updatedLayoutsMap, newLayout.id, newLayout)
      this.editLayout(newLayout)
    },
    removeLayout(layout) {
      if (this.siteLayoutsLength <= 1) {
        return this.$message({
          message: this.$t('editor.keepOneLayout'),
          type: 'warning',
          center:true
        })
        // return alert('Keep one layout at least!')
      }
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
    selectDefaultLayout() {
      this.defaultLayout ? this.selectLayout(this.defaultLayout) : this.selectFirstLayout()
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
    setDefault(layout) {
      this.layoutForm.defaultLayoutId = layout.id
    },
    disalbeSelectedLayoutNameEdittable() {
      this.selectedLayoutNameEdittable = false
    },
    async enableSelectedLayoutNameEdittable() {
      this.selectedLayoutNameEdittable = true

      // try auto focus
      await this.$nextTick()
      try {
        let layoutItemDOM = this.$refs[`layout${this.selectedLayoutId}`]
        layoutItemDOM = _.isArray(layoutItemDOM) ? layoutItemDOM[0] : layoutItemDOM
        layoutItemDOM.querySelector('input').focus()
      } catch (e) {}
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

      let what = this.$t(`editor.${contentKey}`)
      let { value: newFileName } = await this.$prompt(
        `${what} ${self.$t('editor.nameSingle')}`,
        `${self.$t('editor.create')} ${self.$t(`editor.${contentKey}`)}`,
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
      await this.userSaveSiteLayoutConfig({
        sitePath: this.sitePath,
        layoutConfig: {
          layouts: this.allUnsavedLayouts,
          defaultLayoutId: this.unsavedDefaultLayoutId
        }
      }).catch(e => {
        console.error(e)
        this.loading = false
      })
      this.loading = false
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    },
    handleDialogClick() {
      this.disalbeSelectedLayoutNameEdittable()
    }
  }
}
</script>

<style lang='scss'>
.website-setting {
  $column-height: 650px;

  &-layout {
    cursor: default;
    min-height: $column-height;
    min-width: 1000px;
  }
  &-layout-list {
    margin-top: 15px;
  }
  &-layout-item {
    height: 32px;
    margin-bottom: 10px;
    cursor: pointer;
    border: 1px solid #BCBCBC;
    border-radius: 4px;
    &.active {
      border: 1px solid #1890FF;
    }
    .input-state, .display-state {
      height: 100%;
    }
    .input-state {
      [class*="el-form"] {
        height: 100%;
        line-height: initial;
      }
      input {
        border: 0;
        padding-left: 10px;
        font-size: 14px;
      }
    }
    .display-state {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      label {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .display-state-btns {
      flex: 0 0 60px;
      .el-button {
        margin: 0 !important;
      }
      .iconfont {
        color: #515151;
        width: 20px;
        height: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        &:hover {
          background: #ECEDF0;
        }
      }
      .default-btn {
        &.is_default {
          .iconfont {
            color: red;
          }
        }
      }
    }
  }
  &-layouts, &-styles, &-layoutconfig, &-btns {
    padding: 20px;
    height: $column-height;
    h1 {
      padding-left: 0;
    }
  }
  &-layouts {
    .add-layout-btn {
      margin-top: 20px;
      display: flex;
      align-items: center;
      color: black;
      .el-icon-plus {
        width: 20px;
        height: 20px;
        border: 1px solid black;
        border-radius: 4px;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: black;
      }
    }
  }
  &-styles, &-layoutconfig {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    display: flex;
    flex-direction: column;
    > header {
      padding: 0 20px 0;
    }
    > main {
      padding: 0 20px 0;
      flex: 1;
      position: relative;
      &::before {
        content: '';
        height: 100%;
        display: block;
        width: 1px;
        background: #cdd4dc;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  &-layoutconfig {
    .el-textarea, textarea {
      min-height: 70px !important;
    }
  }
  &-styles {
    &-main {
      max-height: 570px;
      overflow-y: auto;
      overflow-x: hidden;
    }
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
  &-style-item {
    height: 120px;
    margin-bottom: 10px;
    border: 5px solid #E4EEF3;
    background: #E4EEF3;
    &.active {
      border: 5px solid #1989FA;
    }
  }
  &-layoutconfig {
    .el-form-item__content {
      display: flex;
      align-items: center;
      label {
        flex: 0 0 60px;
        text-align: right;
        padding-right:6px;
      }
      button {
        margin-left: 6px;
        flex: 0 0 26px;
      }
    }
    button {
      border-radius: 50%;
      width: 26px;
      height: 26px;
      padding: 0;
      border: 0;
      &:hover, &:focus {
        background: #C0C4CC;
        color: black;
      }
    }
  }
  &-btns {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border-left: 15px solid #cdd4dc;
    button {
      width: 100%;
      margin: 15px 0 0 !important;
    }
  }
}
</style>
