<template>
  <el-dialog v-loading='loading' v-if='show' :title="title" class="new-website-dialog" :visible.sync="show" width="760px" :before-close="handleClose">
    <div class="full-height firs-step" v-if="stepIndex===0">
      <el-row class="full-height">
        <el-col :span="3" class="full-height">
          <el-menu class="full-height" :default-active="''+selectedCategoryIndex" @select='setSelectedCategoryIndex'>
            <el-menu-item v-for='(category, index) in categories' :key='category.name' :index='"" + index' v-if="(category.classify !== 'course')">
              {{ category.name }}
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21" class="new-website-templates">
          <el-col :span="10" :offset='index%2 !== 0 ? 2 : 0' v-for='(template, index) in selectedCategory.templates' v-bind:class="{ active: selectedTemplateIndex === index }" class='new-website-template' :key='template.name'>
            <el-card :body-style="{padding: '0px'}" shadow="never">
              <div class="template-img" @click='setSelectedTemplateIndex(index)'>
                <img :src="template.logoUrl">
                <span class="template-info">{{ template.name }}</span>
              </div>
              <div class="bottom">
                <a class="el-button el-button--text" :href="template.previewUrl" target="_blank">
                  <i class="iconfont icon-chakanyanjingshishifenxi"></i> 预 览
                </a>
              </div>
            </el-card>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div v-if="stepIndex===1">
      <el-form class="website-name" :model="websiteNameForm" :rules="websiteNameFormRules" ref="websiteNameForm">
        <el-form-item prop="value">
          <el-input placeholder="例如：mysite123" v-model="websiteNameForm.value">
            <template slot="prepend">http(s)://keepwork.com/{{ username }}/</template>
          </el-input>
        </el-form-item>
      </el-form>
      <p class="info">
        可使用小写字母、数字（例如：mysite123）<br/> 设定后不可修改
        <br/> VIP可在网站设置中设置cname转发
      </p>
    </div>
    <div v-if="stepIndex===2" class="success-info">
      <i class="el-icon-success"></i>
      <h1>
        恭喜您，网站创建成功
      </h1>
      <p>网址：
        <a :href="newSiteUrl + '/index'" target="_blank">{{newSiteUrl}}</a>
        <br/> 您还可以在 网站设置 页面设置网站名称
        <br/>
        开启VIP ，额外支持私有权限以及权限管理等特权
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <span v-if="stepIndex===0">
        <el-button type="primary" @click="handleNextStep">下一步</el-button>
      </span>
      <span v-if="stepIndex===1">
        <el-button @click="handlePrevStep">上一步</el-button>
        <el-button type="primary" @click="handleSubmit" :disabled='isNameIllegal'>创 建</el-button>
      </span>
      <span v-if="stepIndex===2">
        <el-button type="primary" @click="handleEdit">开始编辑</el-button>
      </span>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'NewWebsiteDialog',
  props: {
    show: Boolean
  },
  data() {
    let websiteNameValidator = (rule, value, callback) => {
      let trimmedValue = value.trim()
      if (!trimmedValue) {
        this.isNameIllegal = true
        return callback(new Error('不能为空'))
      }
      if (!/^[A-Za-z0-9_]+$/.test(trimmedValue)) {
        this.isNameIllegal = true
        return callback(new Error('网站名只能由字母，数字和下划线组成'))
      }
      if (this.userPersonalWebsiteNames.indexOf(trimmedValue) > -1) {
        this.isNameIllegal = true
        return callback(new Error('同名网站已经存在'))
      }
      this.isNameIllegal = false
      callback()
    }

    return {
      loading: true,
      stepIndex: 0,
      steps: [
        {
          title: '选择网站模板'
        },
        {
          title: '设定网站的访问地址'
        },
        {
          title: ''
        }
      ],
      selectedCategoryIndex: 0,
      selectedTemplateIndex: 0,
      websiteNameForm: {
        value: ''
      },
      websiteNameFormRules: {
        value: {
          validator: websiteNameValidator
        }
      },
      isNameIllegal: true,
      locationOrigin: window.location.origin
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      userWebTemplateConfig: 'user/webTemplateConfig',
      userPersonalWebsiteNames: 'user/personalWebsiteNames'
    }),
    categories() {
      return this.userWebTemplateConfig
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
    websiteSetting() {
      // to check the data structure, see doc/data_examples/webTemplateConfig.json
      let { name: categoryName, classify: type } = this.selectedCategory
      let { name: templateName, logoUrl } = this.selectedTemplate
      return {
        categoryName,
        type,
        templateName,
        logoUrl,
        styleName: '默认样式' // seems useless
      }
    },
    newSiteUrl() {
      return `${this.locationOrigin}/${this.username}/${
        this.websiteNameForm.value
      }`
    }
  },
  async mounted() {
    await this.userGetWebTemplateConfig()
    await this.userGetAllWebsite({ ignoreCache: false })
    this.loading = false
  },
  methods: {
    ...mapActions({
      userCreateWebsite: 'user/createWebsite',
      userGetWebTemplateConfig: 'user/getWebTemplateConfig',
      userGetAllWebsite: 'user/getAllWebsite'
    }),
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
      let path = `${this.username}/${this.websiteNameForm.value}/index`
      this.$router.push('/' + path)
      this.resetAndClose()
    },
    resetAndClose() {
      this.$emit('close')
      this.stepIndex = 0
      this.websiteNameForm.value = ''
      this.resetSelectedCategoryIndex()
    },
    async handleSubmit() {
      let valid = await this.$refs.websiteNameForm.validate()
      if (!valid) return
      await this.createWebsite()
      this.handleNextStep()
    },
    async createWebsite() {
      this.loading = true
      let name = this.websiteNameForm.value
      let websiteSetting = this.websiteSetting
      await this.userCreateWebsite({ name, websiteSetting })
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

.new-website-dialog {
  .full-height {
    height: 100%;
  }
  .firs-step {
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
      display: none;
      background: rgba(26, 52, 71, 0.8);
    }
  }
  .active .el-card {
    border: 3px solid #409eff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .el-input-group__prepend {
    padding: 0 5px 0 0;
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: #606266;
  }
  .el-input-group--prepend .el-input__inner{
    border-radius: 4px;
  }
  .el-input-group {
    width: 500px;
    font-size: 16px;
  }
  .website-name {
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
