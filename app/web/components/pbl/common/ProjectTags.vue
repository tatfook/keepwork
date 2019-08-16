<template>
  <div class="project-tags">
    <el-card class="project-tags-card" shadow="never" v-loading='isLoading'>
      <div slot="header" class="clearfix">
        <span class="project-tags-card-label">{{$t("project.projectTags")}}</span>
        <el-button v-if="isLoginUserEditable" class="project-tags-card-button" type="text" @click="toggleIsTagEditing">
          <i class="el-icon-edit-outline" v-show="!isTagEditing"></i>
          <span v-show="isTagEditing"><i class="iconfont icon-save3"></i>{{$t("common.Save")}}</span>
        </el-button>
      </div>
      <div v-show="tempTags.length <= 0 && !isTagEditing">{{$t("project.noTags")}}</div>
      <el-tag v-show="tempTags.length > 0 || isTagEditing" :closable="isTagEditing" size="small" :key="tag" v-for="tag in tempTags" :disable-transitions="false" @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input class="project-tags-new-input" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-show="isTagEditing" v-else class="project-tags-new-button" size="small" @click="showInput">+ {{$t("project.newTag")}}</el-button>
    </el-card>
  </div>
</template>
<script>
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ProjectTags',
  props: {
    originProjectDetail: {
      type: Object,
      required: true
    },
    projectId: {
      required: true
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.copiedProjectDetail = _.cloneDeep(this.originProjectDetail)
    let tags = this.copiedProjectDetail.tags
    tags = _.trim(tags, '|')
    this.tempTags = _.filter(tags.split('|'), obj => obj) || []
  },
  data() {
    return {
      tempTags: [],
      inputVisible: false,
      inputValue: '',
      isTagEditing: false,
      isLoading: false,
      copiedProjectDetail: {}
    }
  },
  computed: {
    ...mapGetters({
      isRealNamed: 'user/isRealNamed',
    }),
    isModified() {
      return this.formatTagsToBackEndStyle !== this.originTagsToBackageEndStyl
    },
    formatTagsToBackEndStyle() {
      return '|' + _.join(this.tempTags, '|') + '|'
    },
    originTagsToBackageEndStyl() {
      return this.copiedProjectDetail.tags
    },
    updatingProjectData() {
      return _.merge(this.originProjectDetail, {
        tags: this.formatTagsToBackEndStyle
      })
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName',
      pblUpdateProject: 'pbl/updateProject'
    }),
    handleClose(tag) {
      this.tempTags.splice(this.tempTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm() {
      this.inputValue = _.trim(this.inputValue, ' ')
      let inputValue = this.inputValue
      if (inputValue.indexOf('|') !== -1) {
        this.$message({
          showClose: true,
          message: '标签里不能包含|',
          type: 'error'
        })
        return
      }
      this.isLoading = true
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: inputValue
      }).catch()
      this.isLoading = false
      if (sensitiveResult && sensitiveResult.length > 0) {
        this.inputValue = _.get(sensitiveResult, '[0].word', this.inputValue)
        return
      }
      let nowTagInTagsIndex = _.findIndex(
        this.tempTags,
        tag => tag === inputValue
      )
      if (nowTagInTagsIndex !== -1) {
        this.$message({
          showClose: true,
          message: '该标签已存在',
          type: 'error'
        })
        return
      }
      inputValue && this.tempTags.push(inputValue)
      this.inputVisible = false
      this.inputValue = ''
    },
    async toggleIsTagEditing() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      if (this.isTagEditing) {
        if (!this.isModified) {
          this.isTagEditing = !this.isTagEditing
          return
        }
        this.isLoading = true
        await this.pblUpdateProject({
          projectId: this.projectId,
          updatingProjectData: this.updatingProjectData
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: this.$t('project.labelUpdated')
            })
            this.isTagEditing = !this.isTagEditing
            this.isLoading = false
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '标签更新失败,请重试'
            })
            this.isLoading = false
            console.error(error)
          })
      } else {
        this.isTagEditing = !this.isTagEditing
      }
    }
  }
}
</script>

<style lang="scss">
.project-tags {
  &-card {
    &-label {
      font-weight: bold;
    }
    &-button {
      float: right;
      padding: 3px 0;
      color: #909399;
    }
    .el-tag {
      background-color: #eee;
      color: #909399;
      border: none;
      margin-bottom: 16px;
    }
    .el-tag--small .el-icon-close {
      width: 10px;
      right: -3px;
      color: #f56c6c;
    }
    .el-input--small .el-input__inner {
      height: 24px;
      line-height: 24px;
      padding: 0 8px;
    }
  }
  &-new-input {
    width: 54px;
    margin-left: 10px;
    vertical-align: bottom;
    height: 24px;
    line-height: 24px;
    margin-bottom: 16px;
  }
  &-new-button {
    margin-left: 10px;
    height: 24px;
    line-height: 22px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>

