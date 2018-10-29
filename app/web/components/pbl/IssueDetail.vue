<template>
  <el-dialog v-if="show" :visible.sync="show" :before-close="handleClose" class="issue-detail-dialog">
    <h4 slot="title" class="issue-detail-title">一个新项目/白板/问题详情</h4>
    <div class="issue-detail-header">
      <div class="issue-title">{{issue.title}} #{{issue.id}}</div>
      <div class="issue-edit"><i class="iconfont icon-edit-square"></i>编辑</div>
    </div>
    <div class="issue-detail-intro">
      <span class="created-time">{{relativeTime(issue.createdAt)}}</span>
      <span class="created-by">由<span class="name">果果</span>创建</span>
      <span class="created-tag">
        <span class="tag">需求</span>
        <span class="tag">开发</span>
        <span class="tag">设计</span>
        <span class="tag">流程</span>
      </span>
    </div>
    <div class="issue-detail-status">
      <div class="issue-detail-status-left">状态：<span class="rank"><i class="iconfont icon-warning-circle-fill"></i><span class="rank-tip">进行 (99)</span></span></div>
      <div class="issue-detail-status-right">
        负责人
        <img class="player-portrait" src="https://git-stage.keepwork.com/gitlab_www_keepgo1230/keepworkdatasource/raw/master/keepgo1230_images/img_1530177473927.png" alt="">
        <img class="player-portrait" src="https://git-stage.keepwork.com/gitlab_www_keepgo1230/keepworkdatasource/raw/master/keepgo1230_images/img_1530177473927.png" alt="">
        <img class="player-portrait" src="http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg" alt="">
        <img class="player-portrait" src="http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg" alt="">
        <img class="player-portrait" src="http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg" alt="">
      </div>
    </div>
    <div class="issue-detail-idea">
      <div class="issue-detail-idea-box">
        <div class="issue-detail-idea-box-portrait">
          <img src="http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg" alt="">
        </div>
        <div class="issue-detail-idea-box-content">
          <div class="username-created-time">
            <span class="username">告诉果果</span>
            <span class="time">2018-9-12</span>
          </div>
          <div class="idea-area">
            <div class="arrows"></div>
            <div class="text"><textarea name="" id="idea" placeholder="说点什么呢......"></textarea></div>
          </div>
        </div>
      </div>
      <div class="issue-detail-idea-box">
        <div class="issue-detail-idea-box-portrait">
          <img src="http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg" alt="">
        </div>
        <div class="issue-detail-idea-box-content">
          <div class="username-created-time">
            <span class="username">告诉果果</span>
            <span class="time">2018-9-12</span>
          </div>
          <div class="idea-area">
            <div class="arrows"></div>
            <div class="text"><textarea name="" id="idea" placeholder="说点什么呢......"></textarea></div>
          </div>
        </div>
      </div>
    </div>
    <div class="issue-detail-my-idea">
      <div class="issue-detail-my-idea-portrait">
        <img src="http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg" alt="">
      </div>
      <div class="issue-detail-my-idea-content">
        <div class="username">asjdflasd</div>
        <div class="idea-area">
          <div class="arrows"></div>
          <div class="text">
            <textarea name="myIdea" id="idea" placeholder="说点什么呢......"></textarea>
          </div>
        </div>
        <div class="finish">
          <el-button size="medium">关闭问题</el-button>
          <el-button type="primary" size="medium">评论</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'

export default {
  name: 'IssueDetail',
  props: {
    show: Boolean,
    issue: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
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
        font-size: 20px;
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
      .created-tag {
        .tag {
          background: #eee;
          color: #909399;
          display: inline-block;
          padding: 2px 4px;
          border-radius: 2px;
          margin-right: 5px;
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
          &-tip {
            cursor: pointer;
            &:hover {
              color: #409eff;
            }
          }
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
            margin-bottom: 10px;
            .username {
              font-size: 14px;
            }
            .time {
              font-size: 12px;
              color: #909399;
              padding-left: 15px;
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
              textarea {
                border: none;
                background: #f9f9f9;
                resize: none;
                width: 100%;
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
            background: #f9f9f9;
            resize: none;
            width: 100%;
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
</style>

