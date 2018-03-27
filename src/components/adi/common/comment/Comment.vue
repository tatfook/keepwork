<template>
  <div class='comp-comment'>

    <div ng-hide="params.multiText_desc.is_mod_hide">
      <h3>我要评论</h3>
      <div class="comments-box">
        <div class="comment-item clearfix" ng-repeat="comment in commentObj.commentList">
          <img>
          <div class="text">
            <h4>未知用户</h4>
            <p class="info">comment.updateTime</p>
            <p>comment.content</p>
          </div>
          <a class="delete-btn">删除</a>
          <a class="delete-btn">删除</a>
        </div>
      </div>
      <div class="comment-input">
        <textarea rows="3" ng-model="comment.content"></textarea>
        <el-button>提交</el-button>
      </div>
    </div>
    <!-- <div class="text-center shutup-comment" ng-hide="!params.multiText_desc.is_mod_hide">
      评论功能已关闭
    </div> -->

  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiComment',
  mixins: [compBaseMixin]
}
</script>

<style lang="scss" scoped>
.comp-comment {
  padding: 0;

  .info {
    font-size: 12px;
    color: #999;
    margin-bottom: 5px;
  }

  .comment-item {
    margin: 15px 0;
    position: relative;
  }

  .comment-item > img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    float: left;
  }

  .comment-item .text {
    padding-left: 90px;
    position: relative;
    min-height: 80px;
    padding-right: 30px;
  }

  .comment-input {
    display: flex;
    align-items: flex-end;
  }

  .comment-input textarea {
    margin-right: 15px;
    resize: none;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  h4 {
    margin: 0;
  }

  .delete-btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .no_comment {
    padding: 30px;
    color: #999;
  }

  .shutup-comment {
    border: 1px solid #999999;
    padding: 60px;
  }
}
</style>