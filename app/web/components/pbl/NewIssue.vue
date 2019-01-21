<template>
  <el-dialog v-if="show" :visible.sync="show" :before-close="handleClose" class="new-issue">
    <div class="new-issue-title">{{$t('project.createNewIssueTitle')}}</div>
    <div class="new-issue-sketch">
      <div class="new-issue-sketch-item">
        <div class="new-issue-sketch-label" :class="{'new-issue-sketch-label-en': isEn}">{{$t("project.title")}}</div>
        <div class="new-issue-sketch-content">
          <el-input size="medium" v-model="issueTitle" :placeholder='$t("project.pleaseInputTitle")'></el-input>
        </div>
      </div>
      <div class="new-issue-sketch-item">
        <div class="new-issue-sketch-label" :class="{'new-issue-sketch-label-en': isEn}">{{$t('project.labels')}}</div>
        <div class="new-issue-sketch-content" v-loading='isTagLoading'>
          <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleCloseTag(tag)">{{tag}}</el-tag>
          <el-input class="new-issue-sketch-new-input" v-if="inputVisible" :maxlength="tagMaxLength" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
          <el-button v-else size="small" @click="showInput">+ {{$t('project.newLabel')}}</el-button>
        </div>
      </div>
      <div class="new-issue-sketch-item">
        <div class="new-issue-sketch-label" :class="{'new-issue-sketch-label-en': isEn}">{{$t('project.asignees')}}</div>
        <div class="new-issue-sketch-content new-issue-sketch-asignee">
          <img v-for="(member,index) in assignedMembers" :key="index" class="new-issue-sketch-asignee-portrait" :src="member.portrait || default_portrait" alt="">
          <el-dropdown @command="handleCommand" trigger="click" placement="bottom-start">
            <span class="el-icon-plus"></span>
            <el-dropdown-menu slot="dropdown" class="new-issue-sketch-asignee-dropdown">
              <el-dropdown-item v-if="memberList.length == 0">{{$t('project.noOtherMembers')}}</el-dropdown-item>
              <el-dropdown-item v-for="member in memberList" :key="member.id" :command="member.userId">
                <i :class="['icofont',{'el-icon-check': isAssigned(member)}]"></i>
                <img class="new-issue-sketch-asignee-dropdown-portrait" :src="member.portrait || default_portrait" alt="">
                {{member.nickname || member.username}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="new-issue-sketch-item">
        <div class="new-issue-sketch-label" :class="{'new-issue-sketch-label-en': isEn}">{{$t('project.write')}}</div>
        <div class="new-issue-sketch-content">
          <el-input type="textarea" :rows="4" v-model="descriptionText" :placeholder="$t('project.writeAComment')" resize="none"></el-input>
        </div>
      </div>
    </div>
    <el-button class="new-issue-finish" size="medium" :loading="cretateIssueLoading" type="primary" @click="finishedCreateIssue" :disabled="!issueTitle || !descriptionText">{{$t('project.submitIssue')}}</el-button>
  </el-dialog>
</template>
<script>
import { locale } from '@/lib/utils/i18n'
import { keepwork } from '@/api'
import _ from 'lodash'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapActions, mapGetters } from 'vuex'
import default_portrait from '@/assets/img/default_portrait.png'
import Vue from 'vue'

export default {
  name: 'NewIssue',
  props: {
    show: Boolean,
    projectId: {
      required: true
    }
  },
  data() {
    return {
      tagMaxLength: 40,
      issueTitle: '',
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      descriptionText: '',
      default_portrait: default_portrait,
      assignedMembers: [],
      cretateIssueLoading: false,
      isTagLoading: false
    }
  },
  async mounted() {
    await this.getProjectMember({
      objectId: this.projectId,
      objectType: 5
    })
  },
  computed: {
    ...mapGetters({
      pblProjectMemberList: 'pbl/projectMemberList'
    }),
    isEn() {
      return locale === 'en-US'
    },
    memberList() {
      return this.pblProjectMemberList({ projectId: this.projectId })
    },
    assignMembersId() {
      let arrId = []
      _.map(this.assignedMembers, ({ userId }) => {
        arrId.push(userId)
      })
      return arrId.join('|')
    }
  },
  methods: {
    ...mapActions({
      getProjectIssues: 'pbl/getProjectIssues',
      getProjectMember: 'pbl/getProjectMember'
    }),
    handleCloseTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm() {
      let inputValue = this.inputValue
      let isExistTagIndex = _.findIndex(
        this.dynamicTags,
        tag => tag === inputValue
      )
      if (isExistTagIndex !== -1) {
        this.$message({
          showClose: true,
          message: '该标签已存在',
          type: 'error'
        })
        return
      }
      this.isTagLoading = true
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: inputValue
      }).catch()
      this.isTagLoading = false
      if (sensitiveResult && sensitiveResult.length > 0) {
        return
      }
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClose() {
      this.$emit('close')
    },
    handleCommand(userId) {
      _.forEach(this.memberList, member => {
        if (member.userId === userId) {
          if (this.assignedMembers.length == 0) {
            return this.assignedMembers.push(member)
          }
          let i
          for (i = 0; i < this.assignedMembers.length; ++i) {
            if (this.assignedMembers[i].userId === userId) {
              break
            }
          }
          if (i === this.assignedMembers.length) {
            return this.assignedMembers.push(member)
          }
          this.assignedMembers.splice(i, 1)
        }
      })
    },
    async finishedCreateIssue() {
      this.cretateIssueLoading = true
      this.$nextTick(async () => {
        let sensitiveResult = await checkSensitiveWords({
          checkedWords: [this.issueTitle, this.descriptionText]
        }).catch()
        if (sensitiveResult && sensitiveResult.length > 0) {
          this.cretateIssueLoading = false
          return
        }
        let payload = {
          objectType: 5,
          objectId: this.projectId,
          title: this.issueTitle,
          content: this.descriptionText,
          tags: this.dynamicTags.join('|'),
          assigns: this.assignMembersId
        }
        await keepwork.issues
          .createIssue(payload)
          .then(res => {
            this.getProjectIssues({
              objectId: this.projectId,
              objectType: 5,
              'x-per-page': 25,
              'x-page': 1,
              'x-order': 'createdAt-desc'
            })
            this.handleClose()
            this.cretateIssueLoading = false
          })
          .catch(err => console.error(err))
      })
    },
    isAssigned(member) {
      return this.assignedMembers.indexOf(member) !== -1 ? true : false
    }
  }
}
</script>
<style lang="scss">
.new-issue {
  .el-dialog {
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 6px 20px;
  }
  &-title {
    line-height: 60px;
    font-size: 16px;
    color: #303133;
    padding-left: 4px;
    font-weight: bold;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 12px;
  }
  &-sketch {
    padding-left: 6px;
    &-item {
      display: flex;
      line-height: 60px;
      max-width: 600px;
    }
    &-label {
      width: 52px;
      font-size: 14px;
      color: #909399;
      &-en {
        width: 80px;
      }
    }
    &-content {
      flex: 1;
      .el-tag + .el-tag {
        margin-left: 10px;
      }
      .player {
        line-height: 38px;
        margin-bottom: 8px;
      }
    }
    &-asignee {
      line-height: 38px;
      margin-bottom: 8px;
      &-portrait {
        vertical-align: middle;
        width: 36px;
        height: 36px;
        margin: 8px 6px 0 0;
        border-radius: 50%;
        border: 1px solid #e8e8e8;
      }
      &-dropdown {
        &-portrait {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
        }
        .el-dropdown-menu__item {
          display: flex;
          align-items: center;
          position: relative;
        }
        .el-icon-check {
          position: absolute;
          left: 4px;
        }
      }
      .el-icon-plus {
        top: 8px;
        position: relative;
        display: inline-block;
        width: 36px;
        height: 36px;
        color: #6e6d6d;
        border: 1px solid #e8e8e8;
        text-align: center;
        border-radius: 50%;
        line-height: 36px;
        font-size: 24px;
        cursor: pointer;
      }
    }
    &-new-input {
      margin-bottom: 4px;
      display: inline-block;
      width: 60px;
      height: 20px;
      padding: 0;
      .el-input__inner {
        padding: 0 8px;
      }
    }
  }
  &-finish {
    margin: 24px 58px;
  }
}
@media screen and (max-width: 768px) {
  .new-issue {
    .el-dialog {
      width: 90%;
    }
  }
}
</style>

