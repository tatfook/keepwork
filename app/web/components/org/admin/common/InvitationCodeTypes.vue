<template>
  <div class="invitation-code-types">
    <div class="item">
      <div class="label">类型</div>
      <div class="content">
        <div class="content-item type-item" :class="{'active': isFormalTypeActive, 'is-disabled': !Boolean(formalValidValue)}" @click="setActiveTypeKey('formal')">正式
          <img v-if="!isFormalTypeActive" src="@/assets/org/formal.png" alt="">
          <img v-else src="@/assets/org/formal_active.png" alt="">
        </div>
        <div v-if="isTryShow" class="content-item type-item" :class="{'active': !isFormalTypeActive}" @click="setActiveTypeKey('try')">试听
          <img v-if="isFormalTypeActive" src="@/assets/org/try.png" alt="">
          <img v-else src="@/assets/org/try_active.png" alt="">
        </div>
      </div>
    </div>
    <div class="item">
      <div class="label">使用期限
        <el-popover placement="top-start" width="200" trigger="hover">
          使用期限是指，使用邀请码之日起，计算使用期限，逾期则账户过期，无法继续使用。
          <i slot="reference" class="iconfont icon-help"></i>
        </el-popover>
      </div>
      <div class="content">
        <div class="content-item period-item" :class="{'active': period.value == activeTypeValue, 'is-disabled': period.isDisabled}" v-for="period in activeTypePeriods" :key="period.value" @click="setActiveTypeValue(period)">
          <p>{{period.text}}</p>
          <p v-if="isFormalTypeActive" v-loading="isLoading">剩余{{period.remainder}}个</p>
        </div>
      </div>
    </div>
    <invitation-code-warning :type="warningType" :isDialogVisible="isWarningVisible" @close="closeWarningDialog" />
  </div>
</template>
<script>
import InvitationCodeWarning from './InvitationCodeWarning'
import { mapGetters, mapActions } from 'vuex'
import { getIsFormalTypeByValue } from '@/lib/utils/org'
export default {
  name: 'InvitationCodeTypes',
  props: {
    isTryShow: {
      type: Boolean,
      default: true,
    },
  },
  async mounted() {
    this.isLoading = true
    try {
      await this.getOrgCodesStatus()
    } catch (error) {
      console.log(error)
    }
    this.initActiveType()
    this.isLoading = false
  },
  data() {
    return {
      isLoading: false,
      activeType: {},
      codeTypes: {
        formal: {
          text: '正式',
          periods: [
            {
              value: 5,
              text: '3个月',
            },
            {
              value: 6,
              text: '半年',
            },
            {
              value: 7,
              text: '1年（送3个月）',
            },
          ],
        },
        try: {
          text: '试听',
          periods: [
            {
              value: 1,
              text: '1个月',
            },
            {
              value: 2,
              text: '2个月',
            },
          ],
        },
      },
      warningType: 'disable',
      isWarningVisible: false,
    }
  },
  computed: {
    ...mapGetters({
      codeUsedStatus: 'org/codeUsedStatus',
    }),
    formalValidValue() {
      const remainder = _.get(this.codeUsedStatus, 'remainder')
      if (!remainder) return undefined
      const formalKeys = [5, 6, 7]
      let index = 0
      for (index; index < formalKeys.length; index++) {
        const key = `type${formalKeys[index]}`
        if (remainder[key] > 0) {
          this.setActiveType('formal', formalKeys[index])
          break
        }
      }
      return formalKeys[index] || undefined
    },
    activeTypeKey() {
      return this.activeType.key
    },
    activeTypeValue() {
      return this.activeType.value
    },
    activeTypeRemainder() {
      return _.find(this.activeTypePeriods, period => period.value == this.activeTypeValue).remainder
    },
    isFormalTypeActive() {
      return this.activeTypeKey == 'formal'
    },
    activeTypePeriods() {
      const activePeriods = _.get(this.codeTypes, `${this.activeTypeKey}.periods`)
      return _.map(activePeriods, period => {
        const key = `type${period.value}`
        const remainder = _.get(this.codeUsedStatus, `remainder.${key}`, 0)
        return {
          ...period,
          remainder,
          isDisabled: getIsFormalTypeByValue(period.value) ? remainder <= 0 : false,
        }
      })
    },
  },
  methods: {
    ...mapActions({
      getOrgCodesStatus: 'org/getOrgCodesStatus',
    }),
    setActiveTypeKey(key) {
      if (key == 'formal' && !Boolean(this.formalValidValue)) {
        this.warningType = 'disable'
        this.isWarningVisible = true
        return
      }
      this.setActiveType(key, key == 'formal' ? this.formalValidValue : 1)
    },
    setActiveTypeValue(period) {
      if (period.isDisabled) return
      this.activeType = {
        ...this.activeType,
        value: period.value,
        remainder: period.remainder,
      }
    },
    setActiveType(key, value) {
      this.activeType = { key, value }
    },
    initActiveType() {
      !this.isTryShow || this.formalValidValue
        ? this.setActiveType('formal', this.formalValidValue)
        : this.setActiveType('try', 1)
    },
    closeWarningDialog() {
      this.isWarningVisible = false
    },
  },
  components: {
    InvitationCodeWarning,
  },
}
</script>
<style lang="scss" scoped>
.invitation-code-types {
  font-size: 14px;
  .item {
    margin-bottom: 28px;
  }
  .label {
    width: 120px;
    display: inline-block;
    color: #595959;
    text-align: right;
    padding: 16px 16px 20px 0;
    box-sizing: border-box;
    position: relative;
  }
  .icon-help {
    position: absolute;
    right: 36px;
    bottom: 0;
    color: #2397f3;
    cursor: pointer;
  }
  .content {
    display: inline-block;
    vertical-align: top;
    &-item {
      display: inline-block;
      position: relative;
      width: 136px;
      height: 72px;
      line-height: 72px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      margin-right: 24px;
      color: #262626;
      box-sizing: border-box;
      overflow: hidden;
      cursor: pointer;
      & > img {
        position: absolute;
        right: 0;
        bottom: 0;
      }
      &.is-disabled {
        cursor: not-allowed;
      }
    }
  }
  .type-item {
    font-size: 18px;
    padding-left: 22px;
    &.active {
      border: 2px solid #1385ff;
      background-color: #eff6fd;
      &::before {
        font-family: element-icons !important;
        content: '\E6DA';
        position: absolute;
        right: -6px;
        top: -6px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #1385ff;
        color: #fff;
        z-index: 1;
        line-height: 32px;
        padding-left: 3px;
        box-sizing: border-box;
      }
    }
  }
  .period-item {
    text-align: center;
    background-color: #d9d9d9;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    float: left;
    & > p {
      margin: 0;
      line-height: 1.5;
    }
    &.active {
      color: #fff;
      background-color: #67c23a;
    }
    &.is-disabled {
      opacity: 0.5;
    }
  }
}
</style>
