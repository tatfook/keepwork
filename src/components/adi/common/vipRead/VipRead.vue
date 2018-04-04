<template>
  <div class='comp-vip-read'>
    <div v-if="editMode" class="vip-more-permission">
      <p class="switch-notice">
        <!-- <span class="fa fa-lock"></span> -->
        本网页内容，仅限VIP用户浏览全部 <br />
        <!-- <span ng-if="params.switch_vipread.is_mod_hide">（关闭）</span> -->
        <!-- <span ng-if="!params.switch_vipread.is_mod_hide">（开启）</span> -->
      </p>
    </div>

    <div v-if="!editMode">
      <div v-if="isLogined() && !isVip" class="vip-more-permission">
        <p>
          <a href="/wiki/vip">
            <span class="fa fa-lock"></span>成为VIP，才能查看更多</a>
        </p>
      </div>
      <div v-if="!isLogined()" class="vip-more-permission">
        <p ng-show="!editorMode">
          <a ng-click="goLoginModal()">登录后，才能查看更多</a>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'AdiVipRead',
  mixins: [compBaseMixin],
  computed: {
    isVip() {
      let vipInfo = this.vipInfo()

      let endDate = new Date(vipInfo['endDate']).getTime()
      let now = Date.now()

      if (vipInfo['isValid'] && endDate >= now) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapGetters({
      isLogined: 'user/isLogined',
      vipInfo: 'user/vipInfo'
    })
  }
}
</script>

<style lang="scss" scoped>
.comp-vip-read {
  .vip-more-permission {
    /* position: absolute;
        bottom: 0;
        left: 0;
        right: 0; */
    color: #3977ad;
    background-color: #fff;
    box-shadow: 1px -1px 10px #b5b5b5;
    height: 80px;
    text-align: center;
    font-size: 18px;
    line-height: 30px;
    padding-top: 25px;
    z-index: 1;
  }
  .vip-more-permission .switch-notice {
    font-size: 17px;
    margin-top: -15px;
  }
  .vip-more-permission .switch-notice span {
    font-size: 20px;
  }
  .vip-more-permission .fa-lock {
    border: 1px solid;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 16px;
    line-height: 23px;
    text-align: center;
  }
}
</style>