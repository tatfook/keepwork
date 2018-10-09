<template>
  <div class="project-comments">
    <div class="project-comments-header">
      评论<span class="project-comments-header-count">(已有304条评论)</span>
    </div>
    <div class="project-comments-sends">
      <div class="project-comments-sends-profile-input">
        <img class="project-comments-profile" src="http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1518086126317.png" alt="">
        <el-input placeholder="发表你的看法吧..."></el-input>
      </div>
      <div class="project-comments-sends-operations">
        <el-button type="primary" size="medium">评论</el-button>
      </div>
    </div>
    <div class="project-comments-list">
      <div class="project-comments-item">
        <img class="project-comments-profile project-comments-item-profile" src="http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1518086126317.png" alt="">
        <div class="project-comments-item-detail">
          <p class="project-comments-item-username-time">kaitlyn
            <span class="project-comments-item-time">今天16:53</span>
          </p>
          <p class="project-comments-item-comment">
            挺棒的，呵呵
          </p>
        </div>
      </div>
    </div>
    <div class="project-comments-more">下滑加载更多</div>
  </div>
</template>
<script>
export default {
  name: 'ProjectComments'
}
</script>
<style lang="scss">
.project-comments {
  background-color: #fff;
  &-profile {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  &-header {
    font-size: 16px;
    color: #303133;
    font-weight: bold;
    height: 56px;
    line-height: 56px;
    padding: 0 16px;
    &-count {
      font-size: 12px;
      font-weight: normal;
      color: #909399;
      margin-left: 8px;
    }
  }
  &-sends {
    padding: 24px 16px 24px 24px;
    border: 1px solid #e8e8e8;
    border-width: 1px 0;
    &-profile-input {
      padding-left: 64px;
      position: relative;
      img {
        position: absolute;
        left: 0;
      }
    }
    &-operations {
      text-align: right;
      padding-top: 16px;
    }
  }
  &-item {
    p {
      margin: 0;
    }
    display: flex;
    align-items: center;
    padding: 8px 24px;
    &-profile {
      margin-right: 16px;
      padding: 16px 0;
    }
    &-username-time {
      font-size: 14px;
      color: #303133;
      margin-bottom: 8px;
    }
    &-time {
      font-size: 12px;
      color: #909399;
      margin-left: 10px;
    }
    &-comment {
      font-size: 13px;
      color: #606266;
    }
  }
  &-more {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    color: #909399;
    text-align: center;
    border-top: 1px solid #e8e8e8;
  }
}
</style>
