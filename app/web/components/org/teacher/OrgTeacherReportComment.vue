<template>
  <div class="teacher-report-comment">
    <div class="teacher-report-comment-header">
      <span>
        {{reportName}}
        <i class="el-icon-arrow-right"></i>
        <template v-if="isEditMod">
          点评内容
        </template>
        <template v-else>
          点评学生
        </template>
        <template v-if="isEditMod">
          <i class="el-icon-arrow-right"></i>
          编辑
        </template>
      </span>
      <span>
        <el-button @click="handleCancel" size="small">取消</el-button>
        <el-button @click="handleSaveComment" size="small">保存</el-button>
        <el-button v-if="!isEditMod" size="small" type="primary">下一个</el-button>
      </span>
    </div>

    <div class="teacher-report-comment-main">
      <div class="teacher-report-comment-main-student-info">
        <span>学生:</span>
        <img class="student-portrait" :src="portrait | miniPic">
        <span class="student-name">{{realname}} </span>
      </div>
      <div class="teacher-report-comment-main-overall-evaluation">
        <span class="evaluation-name">总体评价:</span>
        <el-rate class="evaluation-rate" v-model="star"></el-rate>
      </div>
      <div class="teacher-report-comment-main-ability">
        <div class="teacher-report-comment-main-ability-col border-right">
          <div v-for="item in abilityListLeft" :key="item.key" class="ability-row">
            <span class="ability-row-name">{{item.name}}</span>
            <el-rate class="ability-row-rate" v-model="item.value"></el-rate>
          </div>
        </div>
        <div class="teacher-report-comment-main-ability-col">
          <div v-for="item in abilityListRight" :key="item.key" class="ability-row">
            <span class="ability-row-name">{{item.name}}</span>
            <el-rate class="ability-row-rate" v-model="item.value"></el-rate>
          </div>
        </div>
      </div>
      <div class="teacher-report-comment-main-input">
        <div class="comment-title">
          请评价:
        </div>
        <el-form class="comment-form" ref="form" :model="form" :rules="rules">
          <el-form-item prop="comment">
            <el-input v-model.trim="form.comment" placeholder="请输入..." type="textarea" :rows="4" maxlength="256" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="teacher-report-comment-main-append">
        <div class="teacher-report-comment-main-append-tips">
          <span class="grey-font">(可选)</span>
          图片/视频:
        </div>
        <div class="teacher-report-comment-main-append-preview">
          <attachment-type v-for="(item, index) in attachmentList" :data="item" :index="index" :key="index" @remove="handleRemoveAttachment"></attachment-type>
          <div class="teacher-report-comment-main-append-upload" @click="handleShowSkydriver">
            <i class="el-icon-circle-plus upload-icon"></i>
            <span class="upload-text">添加文件</span>
          </div>
        </div>
      </div>
    </div>
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow="true" :isNoMediaFileShow="false" :isMultipleSelectMode="true" :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>

<script>
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import AttachmentType from './AttachmentType'
import { keepwork } from '@/api'
import { mapActions } from 'vuex'
export default {
  name: 'OrgTeacherReportComment',
  components: {
    SkyDriveManagerDialog,
    AttachmentType
  },
  filters: {
    miniPic(url) {
      if (/#/.test(url)) {
        return `${url.replace(/#.+/, '')}?imageView2/2/w/400`
      }
      return `${url}&imageView2/2/w/400`
    }
  },
  props: {
    isEditMod: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  async created() {
    if (this.isEditMod) {
      return this.initFormData()
    }
    const { portrait } = await keepwork.evaluationReports.getStudentInfo({
      studentId: this.studentId
    })
    this.portrait = portrait
  },
  data() {
    return {
      loading: false,
      defaultVideoLogo: require('@/assets/img/video_cover.jpg'),
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      portrait: '',
      editRealname: '',
      isMediaSkyDriveDialogShow: false,
      star: 0,
      attachmentList: [],
      form: {
        comment: ''
      },
      abilityListLeft: [
        {
          key: 'spatial',
          name: '空间思维能力',
          value: 0
        },
        {
          key: 'creative',
          name: '创新思维能力',
          value: 0
        },
        {
          key: 'compute',
          name: '计算思维能力',
          value: 0
        }
      ],
      abilityListRight: [
        {
          key: 'collaborative',
          name: '协作沟通能力',
          value: 0
        },
        {
          key: 'logical',
          name: '逻辑思考能力',
          value: 0
        },
        {
          key: 'coordinate',
          name: '统筹思考能力',
          value: 0
        }
      ],
      rules: {
        comment: [
          {
            required: true,
            message: '请输入评价',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    isHasAppendInfo() {
      return this.appendInfo.url
    },
    validType() {
      return ['images', 'videos']
    },
    reportName() {
      return _.get(this.$route, 'query.reportName', '')
    },
    reportId() {
      return _.get(this.$route, 'query.reportId', '')
    },
    realname() {
      return this.editRealname || _.get(this.$route, 'query.realname', '')
    },
    studentId() {
      return _.get(this.$route, 'query.studentId', '')
    },
    params() {
      const params = {
        studentId: this.studentId,
        reportId: this.reportId,
        star: this.star,
        comment: this.form.comment,
        mediaUrl: this.attachmentList
      }
      this.abilityListLeft.forEach(item => (params[item.key] = item.value))
      this.abilityListRight.forEach(item => (params[item.key] = item.value))
      return params
    }
  },
  methods: {
    ...mapActions({
      commentEvaluationReport: 'org/teacher/commentEvaluationReport'
    }),
    initFormData() {
      const {
        portrait,
        realname,
        comment,
        star,
        mediaUrl,
        spatial,
        creative,
        compute,
        collaborative,
        logical,
        coordinate
      } = this.formData
      this.editRealname = realname
      this.portrait = portrait || this.defaultPortrait
      this.form.comment = comment
      this.star = star
      this.attachmentList = mediaUrl
      const abilityDict = {
        spatial,
        creative,
        compute,
        collaborative,
        logical,
        coordinate
      }
      this.abilityListLeft.forEach(item => (item.value = abilityDict[item.key]))
      this.abilityListRight.forEach(
        item => (item.value = abilityDict[item.key])
      )
    },
    async validateRate() {
      return new Promise((resolve, reject) => {
        if (!this.star) {
          return reject('缺少评分')
        }
        if (this.abilityListRight.some(item => item.value === 0)) {
          return reject('缺少评分')
        }
        if (this.abilityListLeft.some(item => item.value === 0)) {
          return reject('缺少评分')
        }
        return resolve()
      })
    },
    async validdateAndCreateCommnet() {
      await this.validateRate()
      await new Promise(async (resolve, reject) => {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loading = true
            await this.commentEvaluationReport(this.params)
              .then(res => resolve())
              .catch(error => reject(error))
          }
        })
      })
    },
    async handleSaveComment() {
      try {
        await this.validdateAndCreateCommnet()
        this.$message.success('点评成功')
        this.$router.back(-1)
      } catch (error) {
        const errMsg = _.isString(error)
          ? error
          : _.get(error, 'response.data.message', '点评失败')
        this.$message.error(_.toString(errMsg))
      } finally {
        this.loading = false
      }
    },
    handleCancel() {
      this.$router.back(-1)
    },
    handleShowSkydriver() {
      this.isMediaSkyDriveDialogShow = true
    },
    closeSkyDriveManagerDialog(fileList) {
      console.log(fileList)
      this.isMediaSkyDriveDialogShow = false
      this.attachmentList = [...this.attachmentList, ...fileList]
    },
    handleRemoveAttachment(removeIndex) {
      this.attachmentList = this.attachmentList.filter(
        (item, index) => index !== removeIndex
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-report-comment {
  background: #fff;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 24px;
    height: 57px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }

  &-main {
    padding: 24px;
    &-student-info {
      display: flex;
      align-items: center;
      .student-portrait {
        width: 42px;
        height: 42px;
        object-fit: cover;
        border-radius: 50%;
        margin-left: 14px;
        margin-right: 14px;
      }
      .student-name {
        font-size: 14px;
        color: #666;
      }
    }
    &-overall-evaluation {
      margin-top: 30px;
      .evaluation-name {
        color: #333;
        margin-right: 20px;
      }
      .evaluation-rate {
        display: inline-block;
        /deep/.el-rate__icon {
          font-size: 34px;
        }
      }
    }
    &-ability {
      margin-top: 30px;
      display: flex;
      &-col {
        min-width: 260px;
        &.border-right {
          border-right: 1px solid #e8e8e8;
          margin-right: 50px;
        }

        .ability-row {
          margin-bottom: 8px;
          &-name {
            font-size: 14px;
            color: #666;
            margin-right: 10px;
          }
          &-rate {
            display: inline-block;
          }
        }
      }
    }

    &-input {
      margin-top: 30px;
      .comment-ttile {
        color: #333;
      }
      .comment-form {
        margin-top: 17px;
      }
    }

    &-append {
      margin-top: 30px;
      &-tips {
        color: #333;
        .grey-font {
          color: #999;
          font-size: 14px;
        }
      }
      &-upload {
        width: 140px;
        height: 140px;
        background: #eeeded;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .upload-icon {
          color: #409eff;
          font-size: 30px;
        }
        .upload-text {
          font-size: 14px;
          color: #909399;
          margin-top: 6px;
        }
      }
      &-preview {
        padding-top: 15px;
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
</style>