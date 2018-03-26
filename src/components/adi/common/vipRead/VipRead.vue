<template>
  <div class='comp-vip-read'>
    <div ng-show="isLogin">
      <div ng-show="!editorMode && !isVip && !params.switch_vipread.is_mod_hide" class="vip-more-permission">
        <p>
          <a href="/wiki/vip">
            <span class="fa fa-lock"></span>成为VIP，才能查看更多</a>
        </p>
      </div>
      <div ng-show="editorMode" class="vip-more-permission">
        <p class="switch-notice">
          <!-- <span class="fa fa-lock"></span> -->
          本网页内容，仅限VIP用户浏览全部 <br />
          <span ng-if="params.switch_vipread.is_mod_hide">（关闭）</span>
          <span ng-if="!params.switch_vipread.is_mod_hide">（开启）</span>
        </p>
      </div>
    </div>

    <div ng-show="!isLogin && !params.switch_vipread.is_mod_hide" class="vip-more-permission">
      <p ng-show="!editorMode">
        <a ng-click="goLoginModal()">登录后，才能查看更多</a>
      </p>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiVipRead',
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