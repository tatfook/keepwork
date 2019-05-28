<template>
  <div class="expiration">
    <el-dialog class="expiration-dialog" title="" :visible.sync="isExpirationVisible" center :before-close="handleClose">
      <div class="expiration-dialog-body">
        <h3 class="expiration-dialog-body-title">尊敬的用户</h3>
        <p class="expiration-dialog-body-service">您的服务合约<span class="expiration-dialog-body-service-date">{{isExporationHint}}</span>。</p>
        <p class="expiration-dialog-body-tip">{{currentOrgHaveExpired ?'部分功能已停止使用' : '请及时延期，以免影响您的使用'}}</p>
        <p class="expiration-dialog-body-contact">如需咨询，请联系 support@paraengine.com</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确定</el-button>
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
      return this.currentOrgHaveExpired ? '已到期' : `将${this.endDate}到期`
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

