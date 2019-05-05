<template>
  <el-dialog v-loading='loading' v-if='show' :title="title" class="new-webpage-dialog" :visible.sync="show" width="760px" :before-close="handleClose">
    <div class="full-height first-step" v-if="stepIndex===0">
      <el-row class="full-height">
        <el-col :span="3" class="full-height">
          <el-menu class="full-height" :default-active="''+selectedCategoryIndex" @select='setSelectedCategoryIndex'>
            <el-menu-item v-for='(category, index) in categories' :key='category.name' :index='"" + index'>
              {{ $t(`templates.pageMenu${category.name}`) }}
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21" class="new-webpage-templates">
          <el-col :span="10" :offset='index%2 !== 0 ? 2 : 0' v-for='(template, index) in selectedCategory.templates' :class="{ active: selectedTemplateIndex === index }" class='new-webpage-template' :key='template.name'>
            <el-card :body-style="{padding: '0px'}" shadow="never">
              <div class="template-img" @click='setSelectedTemplateIndex(index)'>
                <img :src="template.logoUrl">
                <span class="template-info">{{ $t(`templates.pageTemplate${template.name}`) }}</span>
              </div>
            </el-card>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div v-if="stepIndex===1">
      <el-form class="webpage-name" :model="webpageNameForm" :rules="webpageNameFormRules" ref="webpageNameForm" @submit.native.prevent>
        <el-form-item prop="value">
          {{ locationOrigin }}/{{ folderPath }}/<el-input :placeholder="forExample.forExample" v-model.trim="webpageNameForm.value" @keyup.enter.native="handleSubmit">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="stepIndex===2" class="success-info">
      <i class="el-icon-success"></i>
      <h1>
        {{$t('editor.webPageCreatedSuccessfully')}}
      </h1>
      <p>{{$t('editor.URL')}}
        <a :href="newPageFullUrl" target="_blank">{{newPageFullUrl}}</a>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <span v-if="stepIndex===0">
        <el-button type="primary" @click="handleNextStep">{{$t('editor.theNextStep')}}</el-button>
      </span>
      <span v-if="stepIndex===1">
        <el-button @click="handlePrevStep">{{$t('editor.previous')}}</el-button>
        <el-button type="primary" @click="handleSubmit" :disabled='isNameIllegal'>{{$t('editor.create')}}</el-button>
      </span>
      <span v-if="stepIndex===2">
        <el-button type="primary" @click="handleEdit">{{$t('editor.startEditing')}}</el-button>
      </span>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { suffixFileExtension, gitFilenameValidator } from '@/lib/utils/gitlab'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION

export default {
  name: 'NewWebPageDialog',
  props: {
    show: Boolean,
    sitePath: String,
    folderPath: String
  },
  data() {
    let webpageNameValidator = async (rule, str, callback) => {
      await this.gitlabGetRepositoryTree({ path: this.sitePath })
      let childNames = this.gitlabChildNamesByPath(this.folderPath)
      let value = (str || '').trim()
      if (!value) {
        this.isNameIllegal = true
        return callback(new Error(this.$t('editor.required')))
      }

      if (!gitFilenameValidator(value)) {
        this.isNameIllegal = true
        return callback(new Error(this.$t('editor.nameRule')))
      }

      if (childNames.indexOf(value) > -1) {
        this.isNameIllegal = true
        return callback(new Error(this.$t('editor.nameExist')))
      }

      this.isNameIllegal = false
      callback()
    }

    return {
      IS_GLOBAL_VERSION,
      loading: true,
      stepIndex: 0,
      steps: [
        {
          title: this.$t('editor.selectPageTemplate')
        },
        {
          title: this.$t('editor.setPageAccessAddress')
        },
        {
          title: ''
        }
      ],
      selectedCategoryIndex: 0,
      selectedTemplateIndex: 0,
      webpageNameForm: {
        value: ''
      },
      webpageNameFormRules: {
        value: {
          validator: webpageNameValidator
        }
      },
      isNameIllegal: true,
      locationOrigin: window.location.origin,
      forExample: {
        forExample: this.$t('editor.forPageExample')
      }
    }
  },
  computed: {
    ...mapGetters({
      gitlabChildNamesByPath: 'gitlab/childNamesByPath',
      userWebPageTemplateConfig: 'user/webPageTemplateConfig',
      userPersonalWebsiteNames: 'user/personalWebsiteNames'
    }),
    categories() {
      return this.userWebPageTemplateConfig
    },
    selectedCategory() {
      return _.get(this.categories, [this.selectedCategoryIndex], {})
    },
    selectedTemplate() {
      return _.get(
        this.selectedCategory,
        ['templates', this.selectedTemplateIndex],
        {}
      )
    },
    currentStep() {
      return this.steps[this.stepIndex]
    },
    title() {
      return this.currentStep.title
    },
    newFilePath() {
      let newFileName = this.webpageNameForm.value
      newFileName = suffixFileExtension(newFileName, 'md')
      return `${this.folderPath}/${newFileName}`
    },
    newPageUrl() {
      return `${this.folderPath}/${this.webpageNameForm.value}`
    },
    newPageFullUrl() {
      return `${this.locationOrigin}/${this.newPageUrl}`
    }
  },
  async mounted() {
    await this.userGetWebPageTemplateConfig()
    this.loading = false
    this.keyupSubmit()
  },
  methods: {
    ...mapActions({
      addNewWebPage: 'user/addNewWebPage',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      userGetWebPageTemplateConfig: 'user/getWebPageTemplateConfig'
    }),
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode
        if (_key === 13) {
          if (this.stepIndex === 0) {
            this.handleNextStep()
          }
          if (this.stepIndex === 1) {
            this.handleSubmit()
          }
          if (this.stepIndex === 2) {
            this.handleEdit()
          }
        }
      }
    },
    setSelectedCategoryIndex(index) {
      this.selectedCategoryIndex = index
      this.resetSelectedTemplateIndex()
    },
    setSelectedTemplateIndex(index) {
      this.selectedTemplateIndex = index
    },
    resetSelectedCategoryIndex() {
      this.setSelectedCategoryIndex(0)
    },
    resetSelectedTemplateIndex() {
      this.setSelectedTemplateIndex(0)
    },
    handleNextStep() {
      let currentStepIndex = this.stepIndex
      let nextStepIndex = currentStepIndex + 1
      let maxStepIndex = this.steps.length - 1
      this.stepIndex = Math.min(nextStepIndex, maxStepIndex)
    },
    handlePrevStep() {
      let currentStepIndex = this.stepIndex
      let nextStepIndex = currentStepIndex - 1
      let minStepIndex = 0
      this.stepIndex = Math.max(nextStepIndex, minStepIndex)
    },
    handleClose() {
      this.resetAndClose()
    },
    handleEdit() {
      this.$router.push('/' + this.newPageUrl)
      let url = this.$router.resolve({ path: this.$route.path }).href
      history.replaceState('', '', url)
      this.resetAndClose()
    },
    resetAndClose() {
      this.$emit('close')
      this.stepIndex = 0
      this.webpageNameForm.value = ''
      this.resetSelectedCategoryIndex()
    },
    async handleSubmit() {
      let valid = await this.$refs.webpageNameForm.validate()
      if (!valid) return
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: this.webpageNameForm.value
      }).catch()
      if (sensitiveResult && sensitiveResult.length > 0) {
        this.webpageNameForm.value = _.get(
          sensitiveResult,
          '[0].word',
          this.webpageNameForm.value
        )
        return
      }
      await this.createNewPage()
      this.handleNextStep()
    },
    async createNewPage() {
      this.loading = true
      await this.addNewWebPage({
        path: this.newFilePath,
        template: this.selectedTemplate
      })
      this.loading = false
    }
  }
}
</script>

<style lang='scss'>
.new-website {
  &-category {
    &.active {
      background: blue;
    }
  }
  &-template {
    padding-left: 20px;
    .template-img:hover .template-info {
      display: inline-block;
    }
  }
}

.new-webpage-dialog {
  .new-webpage-template{
    padding-left: 20px;
  }
  .full-height {
    height: 100%;
  }
  .first-step {
    height: 445px;
    overflow: auto;
  }
  .el-menu-item {
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px;
  }
  .el-card {
    border: 3px solid transparent;
    box-shadow: none;
    margin-bottom: 15px;
    .template-img {
      width: 100%;
      height: 160px;
      position: relative;
      text-align: center;
      cursor: pointer;
    }
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    .bottom {
      text-align: right;
    }
    .bottom a {
      text-decoration: none;
      border-radius: none;
      border: none;
      padding: 12px 20px;
      color: #303133;
    }
    .bottom a:hover {
      color: #409eff;
    }
    .bottom .iconfont {
      vertical-align: middle;
    }
    .template-info {
      line-height: 160px;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      font-size: 20px;
      color: #fff;
      display: inline-block;
      background: rgba(26, 52, 71, 0.8);
    }
  }
  .active .el-card {
    border: 3px solid #409eff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .el-input-group {
    font-size: 16px;
  }
  .el-form-item__content {
    word-break: break-all;
    white-space: normal;
  }
  .el-input {
    display: inline;
    margin-left: 6px;
  }
  .el-input__inner {
    width: 320px;
  }
  .webpage-name {
    .el-form-item__error {
      top: 12px;
      left: 515px;
    }
  }
  .info {
    font-size: 12px;
    color: #909399;
  }
}

.success-info {
  position: relative;
  padding: 0 100px;

  a {
    color: #409eff;
    text-decoration: none;
  }
  p {
    margin-top: 25px;
    color: #999;
  }

  .el-icon-success {
    font-size: 70px;
    color: #52c41a;
    position: absolute;
    left: 10px;
    top: -25px;
  }
}
</style>
