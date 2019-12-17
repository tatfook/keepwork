<template>
  <div :class="['print-invitation-code-content', {'print-invitation-code-content-hidden': isPrintContentHidden}]">
    <div class="print-invitation-code-content-header">
      <img v-if="orgLogo" class="print-invitation-code-content-header-brand" :src="orgLogo" alt="KeepWork">
      <span class="print-invitation-code-content-header-name">{{currentOrg.name}}</span>
    </div>
    <div class="print-invitation-code-content-content">
      <div class="print-invitation-code-content-row" v-for="(item,index) in printData" :key="index">
        <div class="print-invitation-code-content-content-box" v-for="(i) in item" :key="i.key">
          <div class="print-invitation-code-content-content-box-badge">使用期限：{{durationFilter(i.type)}}</div>
          <div class="print-invitation-code-content-content-box-org-name">
            {{currentOrg.name}}
          </div>
          <div class="print-invitation-code-content-content-box-username">
            {{i.realname || i.name || ''}}
          </div>
          <div class="print-invitation-code-content-content-box-top">
            <p class="print-invitation-code-content-content-box-top-key">邀请码：{{i.key}}</p>
            <img class="print-invitation-code-content-content-box-top-left" src="@/assets/org/invite_code.png" alt="">
            <img class="print-invitation-code-content-content-box-top-center" src="@/assets/org/stripe.png" alt="">
            <img class="print-invitation-code-content-content-box-top-right" src="@/assets/org/shining.png" alt="">
          </div>
          <div class="print-invitation-code-content-content-box-guide">
            <p class="print-invitation-code-content-content-box-guide-step"><span class="print-invitation-code-content-content-box-guide-step-num">1</span>
              打开帕拉卡（Paracraft）（下载地址：paracraft.keepwork.com） </p>
            <p class="print-invitation-code-content-content-box-guide-step"><span class="print-invitation-code-content-content-box-guide-step-num">2</span>注册账号，并登录帕拉卡（Paracraft）</p>
            <p class="print-invitation-code-content-content-box-guide-step"><span class="print-invitation-code-content-content-box-guide-step-num">3</span>进入“我的学校”，输入上方邀请码</p>
            <img class="print-invitation-code-content-content-box-guide-img" src="@/assets/org/para-icon.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTypeText } from '@/lib/utils/org'
export default {
  name: 'PrintInvitationCodeContent',
  props: {
    isPrintContentHidden: Boolean,
    printData: Array,
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
    }),
    orgLogo() {
      return _.get(this.currentOrg, 'logo')
    },
  },
  methods: {
    durationFilter(type) {
      return getTypeText(type)
    },
  },
}
</script>
<style lang="scss" scoped>
.print-invitation-code-content {
  max-width: 660px;
  margin: 0 auto;
  &-hidden {
    display: none;
  }
  &-header {
    max-width: 660px;
    margin: 0 auto;
    display: flex;
    &-brand {
      width: 128px;
      height: 46px;
      border: solid 1px #c5c5c5;
      object-fit: cover;
    }
    &-name {
      display: inline-block;
      line-height: 46px;
      font-size: 14px;
      font-weight: bold;
      padding-left: 16px;
      color: #333;
    }
  }
  &-content {
    max-width: 660px;
    margin: 12px auto 0;
    &-row {
      page-break-inside: avoid;
    }
    &-box {
      border: 1px dashed #999;
      box-sizing: border-box;
      display: inline-block;
      width: 50%;
      padding: 24px 8px 0 16px;
      position: relative;
      &-badge {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 12px;
        color: #fff;
        background-color: #0592fe;
        padding: 4px 8px;
      }
      &-org-name {
        font-weight: bold;
        font-size: 14px;
      }
      &-username {
        font-size: 12px;
        margin-top: 4px;
      }
      &-top {
        min-height: 56px;
        position: relative;
        margin-top: 12px;
        &-key {
          line-height: 52px;
          margin: 0;
          text-align: center;
          font-size: 13px;
          padding-top: 6px;
          font-weight: bold;
          z-index: 999;
          position: relative;
        }
        &-left {
          position: absolute;
          left: 0;
          top: 2px;
          z-index: 10;
        }
        &-center {
          position: absolute;
          top: 15px;
          left: 30px;
          z-index: 0;
          height: 30px;
          widows: 90%;
        }
        &-right {
          position: absolute;
          right: 0;
          top: 2px;
          z-index: 10;
        }
      }
      &-guide {
        padding: 2px 0 18px 2px;
        position: relative;
        &-img {
          position: absolute;
          bottom: 1px;
          right: 0;
          z-index: 0;
        }
        &-step {
          z-index: 99;
          position: relative;
          border-left: solid 3px #54a9ff;
          padding: 0 0 12px 14px;
          font-size: 12px;
          color: #000;
          margin: 0;
          font-weight: bold;
          &:nth-last-of-type(1) {
            padding-bottom: 0;
          }
          &-num {
            width: 16px;
            height: 16px;
            background-color: #54a8ff;
            border: solid 2px #3677b9;
            color: #fff;
            border-radius: 50%;
            display: inline-block;
            text-align: center;
            line-height: 16px;
            position: absolute;
            left: -10px;
            top: 0px;
          }
        }
      }
    }
  }
}
</style>
