<template>
  <div class='comp-comment'>

    <div ng-hide="params.multiText_desc.is_mod_hide">
      <h3>我要评论</h3>
      <div class="comments-box">
        <!-- <div class="comment-item clearfix" ng-repeat="comment in commentObj.commentList">
          <img ng-src="{{comment.userInfo.portrait ||  imgsPath + 'default_portrait.png'}}">
          <div class="text">
            <h4>{{comment.userInfo.username || "未知用户"}}</h4>
            <p class="info">{{dateToStandard(comment.updateTime)}}</p>
            <p>{{comment.content}}</p>
          </div>
          <a class="delete-btn" ng-show="user._id == comment.userId" ng-click="deleteComment(comment)">删除</a>
          <a class="delete-btn" ng-show="{{editorMode}}" ng-click="deleteComment(comment)">删除</a>
        </div> -->
      </div>
      <div class="comment-input">
        <textarea rows="3" ng-model="comment.content"></textarea>
        <button class="btn btn-default" ng-click="submitComment()">提交</button>
      </div>
    </div>
    <div class="text-center shutup-comment" ng-hide="!params.multiText_desc.is_mod_hide">
      评论功能已关闭
    </div>

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
.comp-label {
  a {
    text-decoration: none;
  }
}
</style>