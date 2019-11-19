<template>
  <div class="account-tab">
    <user-portrait class="account-tab-avatar" :user="userProfile"></user-portrait>
    <div class="account-tab-username">{{ username }}</div>
    <el-button :class="['account-tab-button', {'selected': isMyAccountTab }]" @click="switchTab('MyAccount')">{{$t('account.myAccount')}}</el-button>
    <el-button :class="['account-tab-button', {'selected': isTransactionDetail }]" @click="switchTab('TransactionDetail')">{{$t('account.transactions')}}</el-button>
    <el-button :class="['account-tab-button', {'selected': isDiscountCoupon }]" @click="switchTab('DiscountCoupon')">{{$t('account.coupons')}}</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserPortrait from '@/components/common/UserPortrait'
export default {
  name: 'AccountTab',
  data() {
    return {
      currentTab: 'MyAccount'
    }
  },
  watch: {
    $route(to) {
      this.initTabSelected()
    }
  },
  mounted() {
    this.initTabSelected()
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    }),
    isMyAccountTab() {
      return this.currentTab === 'MyAccount'
    },
    isTransactionDetail() {
      return this.currentTab === 'TransactionDetail'
    },
    isDiscountCoupon() {
      return this.currentTab === 'DiscountCoupon'
    },
    username() {
      return this.userProfile.username
    }
  },
  methods: {
    switchTab(name) {
      this.$router.push({ name })
    },
    initTabSelected() {
      this.currentTab = this.$route.name
    }
  },
  components: {
    UserPortrait
  }
}
</script>

<style lang="scss">
.account-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  &-avatar {
    margin-top: 27px;
  }
  &-username {
    color: #333333;
    font-size: 16px;
    margin-top: 23px;
    margin-bottom: 13px;
  }
  &-button {
    margin-top: 20px;
    width: 100%;
    max-width: 220px;
    height: 38px;
    margin-left: 0 !important;
    &.selected {
      background: #2397f3;
      color: #fff;
      border: none;
    }
    &:last-child {
      margin-bottom: 77px;
    }
  }
}
</style>

