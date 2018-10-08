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
        <el-button>评论</el-button>
      </div>
    </div>
    <div class="project-comments-list">
      <div class="project-comments-item">
        <img class="project-comments-profile" src="http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1518086126317.png" alt="">
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
    &-count {
      font-size: 12px;
      font-weight: normal;
      color: #909399;
    }
  }
}
</style>
