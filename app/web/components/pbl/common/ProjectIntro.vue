<template>
  <div class="project-website">
    <el-card class="project-intro-card" shadow="never" v-loading='isLoading'>
      <div slot="header" class="clearfix">
        <span class="project-intro-card-label">项目网站</span>
        <el-button v-if="isLoginUserEditable" class="project-intro-card-button" type="text" @click="toggleIsIntroEditing">
          <i class="el-icon-edit-outline" v-show="!isIntroEditing"></i>
          <span v-show="isIntroEditing"><i class="iconfont icon-save3"></i>保存</span>
        </el-button>
      </div>
      <p v-show="!isIntroEditing" class="project-intro-info">{{tempIntro || "暂无简介"}}</p>
      <el-input v-show="isIntroEditing" type="textarea" resize='none' :rows="2" placeholder="请输入网站简介" v-model="tempIntro">
      </el-input>
    </el-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProjectIntro',
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
    let intro = _.get(this.copiedProjectDetail, 'extra.intro', '')
    this.tempIntro = intro
  },
  data() {
    return {
      isLoading: false,
      tempIntro: '',
      isIntroEditing: false
    }
  },
  computed: {
    origin() {
      return window.location.origin
    },
    originIntro() {
      return _.get(this.originProjectDetail, 'extra.intro', '')
    },
    isModified() {
      return this.originIntro !== this.tempIntro
    },
    mergedExtra() {
      let originExtra = this.originProjectDetail.extra
      let newExtra = {
        intro: this.tempIntro
      }
      return _.merge(originExtra, newExtra)
    },
    updatingProjectData() {
      return _.merge(this.copiedProjectDetail, {
        extra: this.mergedExtra
      })
    }
  },
  methods: {
    ...mapActions({
      pblUpdateProject: 'pbl/updateProject'
    }),
    async toggleIsIntroEditing() {
      if (this.isIntroEditing) {
        if (!this.isModified) {
          this.isIntroEditing = !this.isIntroEditing
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
              message: '简介更新成功'
            })
            this.isIntroEditing = !this.isIntroEditing
            this.isLoading = false
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '简介更新失败,请重试'
            })
            this.isLoading = false
            console.error(error)
          })
      } else {
        this.isIntroEditing = !this.isIntroEditing
      }
    }
  }
}
</script>
<style lang="scss">
.project-intro {
  &-card {
    &-label {
      font-weight: bold;
    }
    &-button {
      float: right;
      padding: 3px 0;
      color: #909399;
    }
    .el-card__body {
      padding: 24px 16px;
    }
  }
  &-title {
    margin: 0;
    font-size: 14px;
    color: #303133;
  }
  &-info {
    font-size: 12px;
    color: #909399;
    word-break: break-word;
    margin: 4px 0 0;
  }
}
</style>
