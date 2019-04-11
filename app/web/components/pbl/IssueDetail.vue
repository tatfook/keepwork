<template>
  <el-dialog :visible.sync="show" :before-close="handleClose" class="issue-detail-dialog">
    <h4 slot="title" class="issue-detail-title">{{projectDetail.name}}/{{$t('project.board')}}/{{$t('project.issueDetail')}}</h4>
    <div v-loading="updateLoading">
      <div class="issue-detail-header">
        <div class="issue-title">
          <div v-if="currIssue.titleIsEdit" class="issue-title-edit-box">
            <input class="issue-title-edit-box-input" type="text" v-model="currIssue.title">
            <el-button class="issue-title-button" size="mini" type="primary" @click="updateTitle">{{$t('common.Sure')}}</el-button>
            <el-button class="issue-title-button" size="mini" @click="cancelUpdateTitle">{{$t('common.Cancel')}}</el-button>
          </div>
          <div v-else class="issue-title-title-box">
            <span class="issue-title-text" :title="currIssue.title">{{currIssue.title}} #{{currIssue.no}}</span>
            <span class="issue-title-edit" @click="editIssueTitle"><i class="iconfont icon-edit-square"></i>{{$t('project.editIssueTitle')}}</span>
          </div>
        </div>
      </div>
      <div class="issue-detail-intro">
        <span class="created-time">{{relativeTime(currIssue.createdAt)}}</span>
        <span class="created-by">{{$t('project.createBy')}}<span class="name">{{issue.user.nickname}}</span>{{$t('project.created')}}</span>
        <span class="issue-detail-intro-tag">
          <el-tag :key="tag" v-for="tag in dynamicTags" :closable="isEditTags" :disable-transitions="false" @close="handleCloseTag(tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-show="isEditTags" v-else class="button-new-tag" size="small" @click="showInput">+ {{$t('project.newTag')}}</el-button>
          <el-button v-if="isEditTags" size="mini" type="primary" @click="updateTag">{{$t('common.Sure')}}</el-button>
          <span v-else class="edit-tag" @click="updateTag"><i class="iconfont icon-edit-square"></i>{{$t('project.changeLabel')}}</span>
        </span>
      </div>
      <div class="issue-detail-status">
        <div class="issue-detail-status-left">{{$t('project.status')}}：<span class="rank"><i :class="['iconfont',issue.state == 0 ? 'icon-warning-circle-fill':'icon-check-circle-fill']"></i><span class="rank-tip">{{issue.state == 0 ? $t('project.inProgressStatus') : $t('project.finishStatus')}}</span></span></div>
        <div class="issue-detail-status-right">
          <div class="principal" :class="{'principal-en': isEn}">{{$t('project.issueAsignees')}}:</div>
          <div class="member-portrait">
            <img class="player-portrait" v-for="player in assignedMembers" :key="player.id" :src="player.portrait || default_portrait" alt="" :title="player.username">
            <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
              <span class="el-dropdown-link">
                <span class="assigns-btn"></span>
              </span>
              <el-dropdown-menu slot="dropdown" class="new-issue-assign">
                <el-dropdown-item v-if="memberList_2.length == 0">{{$t('project.noOtherMembers')}}</el-dropdown-item>
                <el-dropdown-item v-for="member in memberList_2" :key="member.id" :command="member.userId"><i :class="['icofont',{'el-icon-check': member.haveAssigned}]"></i><img class="member-portrait" :src="member.portrait || default_portrait" alt="">{{member.nickname || member.username}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="issue-detail-idea">

        <div class="issue-detail-idea-box">
          <div class="issue-detail-idea-box-portrait">
            <img :src="issue.user.portrait || default_portrait" alt="">
          </div>
          <div class="issue-detail-idea-box-content">
            <div class="username-created-time">
              <div class="username-created-time-left">
                <span class="username">{{issue.user.username}}</span>
                <span class="time">{{relativeTime(issue.createdAt)}}</span>
              </div>
              <div class="username-created-time-right" v-if="currIssue.userId == userId">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="iconfont icon-ellipsis"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="operate-comment">
                    <el-dropdown-item><span class="action" @click="handleIssueDesc(1)">{{$t('editor.edit')}}</span></el-dropdown-item>
                    <!-- <el-dropdown-item><span class="action" @click="handleIssueDesc(2)">删除</span></el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="idea-area">
              <div class="arrows"></div>
              <div v-if="currIssue.descEdit" class="text">
                <textarea name="" rows="8" :placeholder='$t("project.leaveAComment")' v-model.trim="currIssue.content"></textarea>
                <div class="text-button">
                  <el-button size="mini" type="primary" @click="submitModifiedIssueDesc">{{$t('common.Sure')}}</el-button>
                  <el-button size="mini" @click="cancelModifiedIssueDesc">{{$t('common.Cancel')}}</el-button>
                </div>
              </div>
              <div v-else class="text">{{currIssue.content}}</div>
            </div>
          </div>
        </div>

        <div class="issue-detail-idea-box" v-for="(comment,index) in comments" :key="index">
          <div class="issue-detail-idea-box-portrait">
            <img :src="comment.extra.portrait || default_portrait" alt="">
          </div>
          <div class="issue-detail-idea-box-content">
            <div class="username-created-time">
              <div class="username-created-time-left">
                <span class="username">{{comment.extra.username}}</span>
                <span class="time">{{relativeTime(comment.createdAt)}}</span>
              </div>
              <div class="username-created-time-right" v-if="comment.userId == userId && !isProhibitEdit">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="iconfont icon-ellipsis"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="operate-comment">
                    <el-dropdown-item><span class="action" @click="handleComment(comment,1,index)">{{$t('editor.edit')}}</span></el-dropdown-item>
                    <el-dropdown-item><span class="action" @click="handleComment(comment,2,index)">{{$t('common.remove')}}</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="idea-area">
              <div class="arrows"></div>
              <div v-if="comment.isEdit" class="text">
                <textarea name="" :ref="`edit${index}`" rows="8" :placeholder='$t("project.leaveAComment")' v-model.trim="comment.content"></textarea>
                <div class="text-button">
                  <el-button size="mini" type="primary" @click="submitModifiedComment(comment,index)">{{$t('project.updateComment')}}</el-button>
                  <el-button size="mini" @click="cancelModifiedComment(comment,index)">{{$t('common.Cancel')}}</el-button>
                </div>
              </div>
              <div v-else class="text">{{comment.content}}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isLogined && !isProhibitEdit" class="issue-detail-my-idea">
        <div class="issue-detail-my-idea-portrait">
          <img :src="userProfile.portrait || default_portrait" alt="">
        </div>
        <div class="issue-detail-my-idea-content">
          <div class="username">{{username}}</div>
          <div class="idea-area">
            <div class="arrows"></div>
            <div class="text">
              <textarea name="myIdea" rows="8" :placeholder='$t("project.leaveAComment") + $t("project.recommentMaxLength")' v-model.trim="myComment"></textarea>
            </div>
          </div>
          <div class="finish">
            <el-button size="medium" @click="closeIssue">{{currIssue.state == 0 ? $t('project.closeIssue') : $t('project.reopenIssue')}}</el-button>
            <el-button type="primary" size="medium" @click="createComment" :disabled="!myComment" :loading="createCommentLoading">{{$t('project.comment')}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import default_portrait from '@/assets/img/default_portrait.png'
import { mapActions, mapGetters } from 'vuex'
import { keepwork } from '@/api'
import Vue from 'vue'
import _ from 'lodash'

export default {
  name: 'IssueDetail',
  props: {
    show: Boolean,
    projectDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    issue: {
      type: Object,
      default() {
        return {}
      }
    },
    currPage: {
      type: Number,
      default: 1
    },
    isProhibitEdit: {
      type: Boolean,
      default: false
    },
    searchKeyWord: String,
    state: null
  },
  data() {
    return {
      default_portrait,
      isEditTags: false,
      issueData: {},
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      currIssue: {},
      comments: [],
      myComment: '',
      isEdit: false,
      assignedMembers: [],
      updateLoading: false,
      createCommentLoading: false
    }
  },
  async mounted() {
    this.updateLoading = true
    await Promise.all([
      this.getIssueData(),
      this.getCommentsList(),
      this.getProjectMember({
        objectId: this.projectDetail.id,
        objectType: 5
      })
    ]).catch(err => console.error(err))
    this.updateLoading = false
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      userId: 'user/userId',
      userProfile: 'user/profile',
      pblProjectMemberList: 'pbl/projectMemberList',
      isLogined: 'user/isLogined'
    }),
    isEn() {
      return locale === 'en-US'
    },
    memberList() {
      return this.pblProjectMemberList({ projectId: this.projectDetail.id })
    },
    memberList_2() {
      let memberArr1 = _.concat(this.memberList)
      let memberArr2 = _.forEach(memberArr1, member => {
        Object.assign(member, { haveAssigned: this.isAssigned(member) })
      })
      return memberArr2
    },
    assignMembersId() {
      let arrId = []
      _.map(this.assignedMembers, ({ userId }) => {
        arrId.push(userId)
      })
      return arrId.join('|')
    },
    currIssueId() {
      return _.get(this.issue, 'id', '')
    }
  },
  methods: {
    ...mapActions({
      getProjectIssues: 'pbl/getProjectIssues',
      getProjectMember: 'pbl/getProjectMember',
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    async getIssueData() {
      await keepwork.issues
        .getSingleIssue({ issueId: this.issue.id })
        .then(res => {
          this.issueData = Object.assign(res, {
            titleIsEdit: false,
            descEdit: false,
            tagEdit: false
          })
          this.currIssue = _.clone(this.issueData)
          this.dynamicTags = this.currIssue.tags.split('|').filter(x => x)
          this.assignedMembers = _.clone(this.currIssue.assigns)
        })
        .catch(err => console.error(err))
    },
    editIssueTitle() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      if (this.isProhibitEdit) {
        return this.prohibitEditWarning()
      }
      Vue.set(this.currIssue, 'titleIsEdit', true)
    },
    async updateIssueItem(item) {
      this.updateLoading = true
      this.$nextTick(async () => {
        await keepwork.issues
          .updateIssue({
            objectId: this.issue.id,
            params: item
          })
          .catch(err => console.error(err))
        let payload = {
          objectId: this.projectDetail.id,
          objectType: 5,
          'x-per-page': 25,
          'x-page': this.currPage,
          'x-order': 'createdAt-desc',
          state: this.state
        }
        if (this.searchKeyWord) payload['text-like'] = `%${this.searchKeyWord}%`
        if (this.state === null) {
          let { state, ..._payload } = payload
          await this.getProjectIssues(_payload)
        } else {
          await this.getProjectIssues(payload)
        }
        await this.getIssueData()
        this.updateLoading = false
      })
    },
    async updateTitle() {
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: this.currIssue.title
      }).catch()
      if (sensitiveResult && sensitiveResult.length > 0) {
        this.currIssue.title = _.get(sensitiveResult, '[0].word', this.currIssue.title)
        this.cretateIssueLoading = false
        return
      }
      await this.updateIssueItem({ title: this.currIssue.title })
      this.getIssueData()
    },
    async updateTag() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      if (this.isProhibitEdit) {
        return this.prohibitEditWarning()
      }
      let tags = this.dynamicTags.join('|')
      if (tags != this.currIssue.tags) {
        await this.updateIssueItem({ tags })
        await this.getIssueData()
        this.currIssue = _.clone(this.issueData)
        this.dynamicTags = this.currIssue.tags.split('|').filter( x => x)
      } else {
        this.cancelUpdateTag()
      }
      this.isEditTags = !this.isEditTags
    },
    handleIssueDesc(command) {
      if (command == 1) {
        this.currIssue.descEdit = true
      } else {
        this.$message.error('第一条评论是问题的描述，不能删除')
      }
    },
    async submitModifiedIssueDesc() {
      await this.updateIssueItem({ content: this.currIssue.content })
      this.getIssueData()
    },
    cancelModifiedIssueDesc() {
      this.currIssue = _.clone(this.issueData)
    },
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
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: inputValue
      }).catch()
      this.isTagLoading = false
      if (sensitiveResult && sensitiveResult.length > 0) {
        this.inputValue = _.get(sensitiveResult, '[0].word', inputValue)
        return
      }
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    cancelUpdateTitle() {
      this.currIssue = _.clone(this.issueData)
    },
    cancelUpdateTag() {
      this.currIssue = _.clone(this.issueData)
      this.dynamicTags = this.currIssue.tags.split('|').filter(x => x)
    },
    handleClose() {
      this.$emit('close')
    },
    issueTagArr(issue) {
      if(_.get(issue, 'tags', '')){
        return _.get(issue, 'tags', '').split('|')
      }
    },
    async getCommentsList() {
      await keepwork.comments
        .getComments({ objectType: 4, objectId: this.issue.id })
        .then(comments => {
          let commentsArr = _.get(comments, 'rows', [])
          let arr = _.map(commentsArr, item => ({ ...item, isEdit: false }))
          arr.sort(this.sortByCreatedAt)
          this.comments = arr
        })
        .catch(err => console.error(err))
    },
    async createComment() {
      this.createCommentLoading = true
      if (!this.myComment) {
        this.createCommentLoading = false
        return
      }
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: this.myComment
      }).catch()
      if (sensitiveResult && sensitiveResult.length > 0) {
        this.myComment = _.get(sensitiveResult, '[0].word', this.myComment)
        this.createCommentLoading = false
        return
      }
      await keepwork.comments
        .createComment({
          objectType: 4,
          objectId: _.toString(this.issue.id),
          content: this.myComment
        })
        .then(res => {
          this.createCommentLoading = false
          this.myComment = ''
          this.getCommentsList()
        })
        .catch(err => {
          this.$message.error('评论失败')
          this.createCommentLoading = false
        })
    },
    async handleComment(comment, action, index) {
      if (action == 1) {
        Vue.set(comment, 'isEdit', true)
        Vue.set(this.comments, index, comment)
        this.$nextTick(() => {
          let dom = this.$refs[`edit${index}`]
          dom[0].focus()
        })
      } else {
        await keepwork.comments.deleteComment({ commentId: comment.id })
        this.getCommentsList()
      }
    },
    sortByCreatedAt(obj1, obj2) {
      return obj1.createdAt <= obj2.createdAt ? -1 : 1
    },
    async submitModifiedComment(comment, index) {
      let copyComment = Object.assign({}, comment)
      if (!copyComment.content) {
        await this.handleComment(comment, 2, index)
        return
      }
      await keepwork.comments.updateComment({
        commentId: copyComment.id,
        content: copyComment.content
      })
      this.getCommentsList()
    },
    cancelModifiedComment(comment, index) {
      Vue.set(comment, 'isEdit', false)
      Vue.set(this.comments, index, comment)
      this.getCommentsList()
    },
    async closeIssue() {
      if (this.currIssue.state == 0) {
        await this.updateIssueItem({ state: 1 })
        this.handleClose()
      } else {
        await this.updateIssueItem({ state: 0 })
        this.handleClose()
      }
    },
    isAssigned(member) {
      let temp = false
      _.forEach(this.assignedMembers, assign => {
        if (member.userId == assign.userId) {
          temp = true
        }
      })
      return temp
    },
    async handleCommand(userId) {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      if (this.isProhibitEdit) {
        return this.prohibitEditWarning()
      }
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
      await this.updateIssueItem({ assigns: this.assignMembersId })
      this.getIssueData()
    },
    relativeTime(time) {
      const offset = moment().utcOffset()
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(time)
        .utcOffset(offset)
        .fromNow()
    },
    prohibitEditWarning() {
      this.$message({
        type: 'warning',
        message: '你没有编辑权限'
      })
    }
  }
}
</script>
<style lang="scss">
.issue-detail-dialog {
  .el-dialog {
    max-width: 900px;
    .el-dialog__header {
      padding: 0;
      margin: 0;
      .el-dialog__headerbtn {
        top: 10px;
      }
    }
    .el-dialog__body {
      padding: 6px 0;
    }
  }
  .issue-detail-title {
    font-size: 12px;
    background: #f4f5f5;
    margin: 0;
    padding-left: 16px;
    line-height: 40px;
    color: #909399;
    border-bottom: 1px solid #e8e8e8;
  }
  .issue-detail {
    &-header {
      line-height: 50px;
      padding: 0 20px;
      .issue-title {
        &-edit-box {
          display: flex;
          align-items: center;
          height: 56px;
          margin-right: 10px;
          &-input {
            width: 80%;
          }
        }
        &-title-box {
          font-size: 20px;
          height: 56px;
        }
        &-text {
          display: inline-block;
          max-width: 80%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &-edit {
          font-size: 12px;
          cursor: pointer;
          color: #409eff;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &-button {
          padding: 4px 10px;
          margin-left: 10px;
        }
      }
    }
    &-intro {
      font-size: 12px;
      padding: 0 20px;
      .created-time {
        color: #909399;
        margin-right: 8px;
      }
      .created-by {
        color: #909399;
        margin-right: 20px;
        .name {
          color: #409eff;
        }
      }
      &-tag {
        .el-tag {
          height: 22px;
          line-height: 20px;
          margin-bottom: 4px;
          background-color: #eee;
          color: #909399;
          border: none;
        }
        .el-tag + .el-tag {
          margin-left: 4px;
        }
        .button-new-tag {
          padding: 4px 8px;
        }
        .input-new-tag {
          margin-bottom: 4px;
          display: inline-block;
          width: 60px;
          height: 20px;
          padding: 0;
          .el-input__inner {
            height: 24px;
            line-height: 24px;
            padding: 0 8px;
          }
        }
        .el-button {
          padding: 4px 10px;
        }
      }
      .edit-tag {
        color: #409eff;
        cursor: pointer;
      }
    }
    &-status {
      display: flex;
      padding: 20px;
      border-bottom: 1px solid #e8e8e8;
      &-left {
        flex: 1;
        height: 40px;
        line-height: 40px;
        .rank {
          margin-left: 14px;
          display: inline-flex;
          align-items: center;
          .icon-check-circle-fill {
            color: #62e08f;
            font-size: 20px;
            margin-right: 4px;
          }
          .icon-warning-circle-fill {
            color: #f3b623;
            font-size: 20px;
            margin-right: 4px;
          }
        }
      }
      &-right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        .principal {
          width: 50px;
          height: 40px;
          line-height: 40px;
          padding-right: 12px;
          display: inline-block;
        }
        .principal-en{
          width: 80px;
        }
        .member-portrait {
          flex: 1;
          .player-portrait {
            width: 24px;
            height: 24px;
            object-fit: cover;
            border: 1px solid #eee;
            border-radius: 50%;
            margin-right: 5px;
          }
          .assigns-btn {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 1px solid #e8e8e8;
            display: inline-block;
            position: relative;
            margin-top: 8px;
            &::after {
              content: "";
              height: 16px;
              width: 1px;
              background: #6e6d6d;
              position: absolute;
              left: 12px;
              top: 5px;
            }
            &::before {
              content: "";
              height: 1px;
              width: 16px;
              background: #6e6d6d;
              position: absolute;
              left: 5px;
              top: 12px;
            }
          }
        }
      }
    }
    &-idea {
      padding: 12px 20px;
      &-box {
        display: flex;
        margin: 10px 0 18px;
        &-portrait {
          width: 60px;
          img {
            width: 48px;
            height: 48px;
            border-radius: 100%;
          }
        }
        &-content {
          flex: 1;
          margin-right: 90px;
          .username-created-time {
            display: flex;
            margin-bottom: 10px;
            &-left {
              flex: 1;
              .username {
                font-size: 14px;
              }
              .time {
                font-size: 12px;
                color: #909399;
                padding-left: 15px;
              }
            }
            &-right {
              width: 34px;
              text-align: right;
              cursor: pointer;
            }
          }
          .idea-area {
            background: #f9f9f9;
            border: 1px solid #e8e8e8;
            border-radius: 2px;
            padding: 4px 12px;
            position: relative;
            .arrows {
              width: 15px;
              height: 15px;
              border-left: 1px solid #e8e8e8;
              border-bottom: 1px solid #e8e8e8;
              transform: rotate(45deg);
              position: absolute;
              background: #f9f9f9;
              left: -9px;
              top: 9px;
            }
            .text {
              word-break: break-all;
              word-wrap: break-word;
              margin: 12px 0;
              textarea {
                border: none;
                resize: none;
                width: 100%;
                padding: 10px 2px;
              }
              &-button {
                padding-top: 20px;
                display: flex;
                justify-content: flex-end;
              }
            }
          }
        }
      }
    }
    &-my-idea {
      padding: 12px 20px;
      border-top: 1px solid #e8e8e8;
      display: flex;
      &-portrait {
        width: 60px;
        img {
          width: 48px;
          height: 48px;
          border-radius: 100%;
          object-fit: cover;
        }
      }
      &-content {
        flex: 1;
        margin-right: 90px;
        .username {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .idea-area {
          background: #f9f9f9;
          border: 1px solid #e8e8e8;
          border-radius: 2px;
          padding: 18px;
          position: relative;
          .arrows {
            width: 15px;
            height: 15px;
            border-left: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            transform: rotate(45deg);
            position: absolute;
            background: #f9f9f9;
            left: -9px;
            top: 9px;
          }
          textarea {
            border: none;
            resize: none;
            width: 100%;
            padding: 10px 2px;
          }
        }
        .finish {
          margin: 20px 0;
          text-align: right;
        }
      }
    }
  }
}
.operate-comment {
  .el-dropdown-menu__item {
    padding: 0;
    .action {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 108px;
      text-align: center;
    }
  }
}
.new-issue-assign {
  .member-portrait {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
  }
}
@media screen and (max-width: 768px) {
  .issue-detail-dialog {
    .el-dialog {
      width: 94%;
    }
    .issue-detail {
      &-status {
        display: block;
        &-right {
          display: block;
        }
      }
      &-idea {
        &-box {
          &-content {
            margin-right: 10px;
          }
        }
      }
      &-my-idea {
        &-content {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

