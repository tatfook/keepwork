<template>
  <el-dialog v-if="show" :visible.sync="show" :before-close="handleClose" class="issue-detail-dialog">
    <h4 slot="title" class="issue-detail-title">{{projectDetail.name}}/白板/问题详情</h4>
    <div class="issue-detail-header">
      <div class="issue-title">
        <div v-if="currIssue.titleIsEdit" class="issue-title-edit-box">
          <input class="issue-title-edit-box-input" type="text" v-model="currIssue.title">
          <el-button class="issue-title-button" size="mini" type="primary" @click="updateTitle">确定</el-button>
          <el-button class="issue-title-button" size="mini" @click="cancelUpdateTitle">取消</el-button>
        </div>
        <div v-else class="issue-title-title-box">
          {{currIssue.title}} #{{currIssue.id}}
          <span class="issue-title-edit" @click="editIssueTitle"><i class="iconfont icon-edit-square"></i>修改</span>
        </div>
      </div>
    </div>
    <div class="issue-detail-intro">
      <span class="created-time">{{relativeTime(currIssue.createdAt)}}</span>
      <span class="created-by">由<span class="name">{{issue.user.nickname}}</span>创建</span>
      <span v-if="currIssue.tagEdit" class="issue-detail-intro-tag">
        <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleCloseTag(tag)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        <el-button size="mini" type="primary" @click="updateTag">确定</el-button>
        <el-button size="mini" @click="cancelUpdateTag">取消</el-button>
      </span>
      <span v-else class="created-tag">
        <span class="tag" v-for="(tag,i) in issueTagArr(currIssue)" :key="i">{{tag}}</span>
        <span class="edit-tag" @click="alterTag"><i class="iconfont icon-edit-square"></i>修改标签</span>
      </span>
    </div>
    <div class="issue-detail-status">
      <div class="issue-detail-status-left">状态：<span class="rank"><i :class="['iconfont',issue.state == 0 ? 'icon-warning-circle-fill':'icon-check-circle-fill']"></i><span class="rank-tip">{{issue.state == 0 ? '进行中' : '已完成'}}</span></span></div>
      <div class="issue-detail-status-right">
        负责人
        <img class="player-portrait" v-for="player in assignedMembers" :key="player.id" :src="player.portrait || default_portrait" alt="">
        <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
          <span class="el-dropdown-link">
            <span class="assigns-btn"></span>
          </span>
          <el-dropdown-menu slot="dropdown" class="new-issue-assign">
            <el-dropdown-item v-for="member in memberList_2" :key="member.id" :command="member.userId"><i :class="['icofont',{'el-icon-check': member.haveAssigned}]"></i><img class="member-portrait" :src="member.portrait || default_portrait" alt="">{{member.nickname || member.username}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="issue-detail-idea">
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
            <div class="username-created-time-right" v-if="comment.extra.username == username">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  · · ·
                </span>
                <el-dropdown-menu slot="dropdown" class="operate-comment">
                  <el-dropdown-item><span class="action" @click="handleComment(comment,1,index)">编辑</span></el-dropdown-item>
                  <el-dropdown-item><span class="action" @click="handleComment(comment,2,index)">删除</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="idea-area">
            <div class="arrows"></div>
            <div v-if="comment.isEdit" class="text">
              <textarea name="" :ref="`edit${index}`" rows="8" placeholder="说点什么呢......" v-model="comment.content"></textarea>
              <div class="text-button">
                <el-button size="mini" type="primary" @click="submitModifiedComment(comment,index)">更新评论</el-button>
                <el-button size="mini" @click="cancelModifiedComment(comment,index)">取消</el-button>
              </div>
            </div>
            <div v-else class="text">{{comment.content}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="issue-detail-my-idea">
      <div class="issue-detail-my-idea-portrait">
        <img :src="userProfile.portrait || default_portrait" alt="">
      </div>
      <div class="issue-detail-my-idea-content">
        <div class="username">{{username}}</div>
        <div class="idea-area">
          <div class="arrows"></div>
          <div class="text">
            <textarea name="myIdea" rows="8" placeholder="说点什么呢......" v-model="myComment"></textarea>
          </div>
        </div>
        <div class="finish">
          <el-button size="medium" @click="closeIssue">关闭问题</el-button>
          <el-button type="primary" size="medium" @click="createComment">评论</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
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
    }
  },
  data() {
    return {
      default_portrait,
      issueData: {},
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      currIssue: {},
      comments: [],
      myComment: '',
      isEdit: false,
      assignedMembers: []
    }
  },
  async mounted() {
    await Promise.all([
      this.getIssueData(),
      this.getCommentsList(),
      this.getProjectMember({
        objectId: this.projectDetail.id,
        objectType: 5
      })
    ]).catch(err => console.error(err))
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      userProfile: 'user/profile',
      pblProjectMemberList: 'pbl/projectMemberList'
    }),
    memberList() {
      return this.pblProjectMemberList({ projectId: this.projectDetail.id })
    },
    memberList_2() {
      let memberArr1 = _.concat(this.memberList)
      let memberArr2 = _.forEach(memberArr1, member => {
        Object.assign(member, { haveAssigned: this.isAssigned(member) })
      })
      console.log('memberArr2', memberArr2)
      return memberArr2
    },
    assignMembersId() {
      let arrId = []
      _.map(this.assignedMembers, ({userId}) => {
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
      getProjectMember: 'pbl/getProjectMember'
    }),
    async getIssueData() {
      await keepwork.issues
        .getSingleIssue({ issueId: this.currIssueId })
        .then(issue => {
          console.log('currissue', issue)
          this.issueData = Object.assign(issue, {
            titleIsEdit: false,
            tagEdit: false
          })
          this.currIssue = _.clone(this.issueData)
          this.dynamicTags = this.currIssue.tags.split('|')
          this.assignedMembers = _.clone(this.currIssue.assigns)
        })
        .catch(err => console.error(err))
    },
    editIssueTitle() {
      Vue.set(this.currIssue, 'titleIsEdit', true)
    },
    alterTag() {
      Vue.set(this.currIssue, 'tagEdit', true)
    },
    async updateIssueItem(item) {
      await keepwork.issues
        .updateIssue({
          objectId: this.issue.id,
          params: item
        })
        .catch(err => console.error(err))
      await this.getProjectIssues({
        objectId: this.projectDetail.id,
        objectType: 5
      })
    },
    async updateTitle() {
      await this.updateIssueItem({ title: this.currIssue.title })
      this.getIssueData()
    },
    async updateTag() {
      let tags = this.dynamicTags.join('|')
      if (tags != this.currIssue.tags) {
        console.log('1212', tags)
        console.log('3434', this.currIssue.tags)
        await this.updateIssueItem({ tags })
        await this.getIssueData()
        this.currIssue = _.clone(this.issueData)
        this.dynamicTags = this.currIssue.tags.split('|')
      } else {
        console.log('tag没有改变')
        this.cancelUpdateTag()
      }
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

    handleInputConfirm() {
      let inputValue = this.inputValue
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
      this.dynamicTags = this.currIssue.tags.split('|')
    },
    handleClose() {
      this.$emit('close')
    },
    issueTagArr(issue) {
      return _.get(issue, 'tags', '').split('|')
    },
    async getCommentsList() {
      await keepwork.comments
        .getComments({ objectType: 4, objectId: this.issue.id })
        .then(comments => {
          let commentsArr = _.get(comments, 'rows', [])
          let arr = _.map(commentsArr, item => ({ ...item, isEdit: false }))
          arr.sort(this.sortByUpdateAt)
          this.comments = arr
        })
        .catch(err => console.error(err))
    },
    async createComment() {
      await keepwork.comments.createComment({
        objectType: 4,
        objectId: this.issue.id,
        content: this.myComment
      })
      this.myComment = ''
      this.getCommentsList()
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
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    async submitModifiedComment(comment) {
      let copyComment = Object.assign({}, comment)
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
      await this.updateIssueItem({ state: 1 })
      this.handleClose()
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
      await this.updateIssueItem({assigns: this.assignMembersId})
      this.getIssueData()
    },
    relativeTime(time) {
      // console.log('time',moment(time).format('MMMM Do YYYY, h:mm:ss a'))
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(time, 'YYYYMMDDHH').fromNow()
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
      display: flex;
      line-height: 50px;
      padding: 0 20px;
      .issue-title {
        flex: 1;
        &-edit-box {
          display: flex;
          align-items: center;
          height: 56px;
          margin-right: 10px;
        }
        &-title-box {
          font-size: 20px;
          height: 56px;
        }
        &-edit {
          font-size: 12px;
          cursor: pointer;
          color: #409eff;
          padding-left: 8px;
        }
        &-button {
          padding: 4px 10px;
          margin-left: 10px;
        }
      }
      .issue-edit {
        width: 60px;
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
        }
        .el-tag + .el-tag {
          margin-left: 4px;
        }
        .button-new-tag {
          padding: 4px 8px;
        }
        .input-new-tag {
          margin-bottom: 4px;
        }
        .el-button {
          padding: 4px 10px;
        }
      }
      .created-tag {
        .tag {
          background: #eee;
          color: #909399;
          display: inline-block;
          padding: 2px 4px;
          border-radius: 2px;
          margin: 0 5px 4px 0;
        }
        .edit-tag {
          color: #409eff;
          cursor: pointer;
        }
      }
    }
    &-status {
      display: flex;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e8e8e8;
      &-left {
        flex: 1;
        display: flex;
        align-items: center;
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
          // &-tip {
          //   cursor: pointer;
          //   &:hover {
          //     color: #409eff;
          //   }
          // }
        }
      }
      &-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
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
            content: '';
            height: 16px;
            width: 1px;
            background: #6e6d6d;
            position: absolute;
            left: 12px;
            top: 5px;
          }
          &::before {
            content: '';
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
              width: 30px;
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
  .action {
    padding: 0 20px;
  }
}
</style>

