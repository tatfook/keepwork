<template>
  <div class="expiration">
    <el-dialog class="expiration-dialog" title="" :visible.sync="isExpirationVisible" center :before-close="handleClose">
      <div class="expiration-dialog-body">
        <h3 class="expiration-dialog-body-title">{{$t('org.dearUser')}}</h3>
        <p class="expiration-dialog-body-service">{{$t('org.serviceContract')}}<span class="expiration-dialog-body-service-date">{{isExporationHint}}</span>。</p>
        <p class="expiration-dialog-body-tip">{{currentOrgHaveExpired ? `${$t('org.functionsHaveBeenDiscontinued')}` : `${$t('org.timelyDelay')}`}}</p>
        <p class="expiration-dialog-body-contact">{{$t('org.contactUs')}} support@paraengine.com</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">{{$t('common.Sure')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { locale } from '@/lib/utils/i18n'

export default {
  name: 'ExpirationDialog',
  props: {
    isExpirationVisible: Boolean
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      currentOrgToExpire: 'org/currentOrgToExpire',
      currentOrgHaveExpired: 'org/currentOrgHaveExpired'
    }),
    isEn() {
      return locale === 'en-US'
    },
    endDate() {
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(this.currentOrg.endDate).format('LL')
    },
    isExporationHint() {
      return this.currentOrgHaveExpired
        ? this.$t('org.haveExpired')
        : this.isEn
        ? ` expires on ${this.endDate} `
        : `将${this.endDate}到期`
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.expiration {
  &-dialog {
    /deep/ .el-dialog {
      max-width: 415px;
    }
    &-body {
      text-align: center;
      &-title {
        color: #303133;
        font-size: 16px;
      }
      &-service {
        color: #303133;
        font-size: 16px;
        &-date {
          color: #f56c6c;
        }
      }
      &-tip {
        color: #303133;
        font-size: 16px;
      }
      &-contact {
        color: #2397f3;
        font-size: 14px;
      }
    }
  }
}
</style>

