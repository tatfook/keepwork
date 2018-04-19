<template>
  <div class='comp-vip-read'>
    <div v-if="editMode" class="vip-more-permission">
      <p class="switch-notice">
        本网页内容，仅限VIP用户浏览全部 <br />
        <span v-if="!properties.switch.value">（关闭）</span>
        <span v-if="properties.switch.value">（开启）</span>
      </p>
    </div>

    <div v-if="!editMode">
      <div v-if="isLogined() && !isVip && properties.value" class="vip-more-permission">
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
    {{init()}}
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters } from 'vuex'
import _ from 'lodash'

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
    }),
    init() {
      if (this.properties.switch.value) {
        setTimeout(() => {
          let modContainer = document.querySelector('[mod-container]')

          if (modContainer) {
            let vipReadEle
            let deleteEleKey

            _.forEach(modContainer.childNodes, (element, key) => {
              if (element.getAttribute('data-mod') == 'ModVipRead') {
                vipReadEle = element
                deleteEleKey = key
              }
            })

            modContainer.childNodes[deleteEleKey].remove()
            modContainer.insertBefore(vipReadEle, modContainer.childNodes[0])

            modContainer.style.maxHeight = '300px'
            modContainer.style.overflow = 'hidden'
          }
        }, 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-vip-read {
  a {
    text-decoration: none;
    color: unset;
  }

  .vip-more-permission {
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