<template>
  <div class='comp-vip-read'>
    <div v-if="editMode" class="vip-more-permission">
      <p class="switch-notice">
        {{$t(options.onlyVip)}} <br />
        <span v-if="!properties.switch.value">{{$t(options.off)}}</span>
        <span v-if="properties.switch.value">{{$t(options.on)}}</span>
      </p>
    </div>

    <div v-if="!editMode">
      <div v-if="isLogined && !isVip && properties.switch.value && !isMyPage" class="vip-more-permission">
        <p>
          <a href="/wiki/vip">
            <span class="fa fa-lock"></span>{{$t(options.becomeVip)}}</a>
        </p>
      </div>
      <div v-if="!isLogined" class="vip-more-permission">
        <p ng-show="!editorMode">
          <a href="http://keepwork.com/wiki/home">{{$t(options.login)}}</a>
        </p>
      </div>
      {{init()}}
    </div>
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
    ...mapGetters({
      isLogined: 'user/isLogined',
      vipInfo: 'user/vipInfo',
      username: 'user/username'
    }),
    isVip() {
      let endDate = new Date(this.vipInfo['endDate']).getTime()
      let now = Date.now()

      if (this.vipInfo['isValid'] && endDate >= now) {
        return true
      } else {
        return false
      }
    },
    isMyPage() {
      let pathUsername = window.location.pathname.split('/')[1]

      if(pathUsername && pathUsername == this.username) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    init() {
      if (this.properties.switch.value && !this.isMyPage) {
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
    margin-top: 0px;
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