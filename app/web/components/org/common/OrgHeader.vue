<template>
  <div class="org-header">
    <el-menu class="org-header-menu" mode="horizontal">
      <el-menu-item index='1' v-if="orgLogo">
        <img class="org-header-brand" :src="orgLogo" alt="KeepWork">
      </el-menu-item>
      <el-menu-item class="org-header-name" index='2'>
        {{currentOrg.name}}
      </el-menu-item>
      <el-menu-item v-if="isLogin" index='3' class="pull-right" @click="logout">
        {{$t('org.logout')}}
      </el-menu-item>
      <el-menu-item v-if="!isLogin" index='3-1' class="pull-right" @click="toLoginPage">
        登录
      </el-menu-item>
      <el-menu-item index='4' class="pull-right">
        <a class="org-header-more-learn" href="/s" target="_blank">{{$t('org.moreStudy')}}</a>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrgHeader',
  computed: {
    ...mapGetters({
      getToken: 'org/getToken',
      currentOrg: 'org/currentOrg'
    }),
    orgLogo() {
      return _.get(this.currentOrg, 'logo')
    },
    isLogin() {
      return Boolean(this.getToken())
    }
  },
  methods: {
    ...mapActions({
      userLogout: 'user/logout'
    }),
    async logout() {
      this.$confirm(this.$t('org.logoutTips'), this.$t('org.logoutHint'), {
        confirmButtonText: this.$t('common.Sure'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })
        .then(() => {
          this.userLogout().catch()
        })
        .catch(err => console.error(err))
    },
    toLoginPage() {
      this.$router.push({
        name: 'OrgLogin'
      })
    }
  }
}
</script>
<style lang="scss">
.org-header {
  border-bottom: solid 1px #e6e6e6;
  background-color: #fff;
  &-name {
    font-weight: bold;
  }
  &-menu {
    padding: 12px 0;
    max-width: 1200px;
    margin: 0 auto;
    &.el-menu--horizontal {
      border-bottom: none;
    }
    & > .el-menu-item {
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      color: #333;
      &.pull-right {
        float: right;
        font-size: 14px;
      }
      & a {
        text-decoration: none;
        color: #409efe;
        &:hover {
          color: #409efe;
        }
      }
    }
  }
  &-brand {
    height: 48px;
    width: 150px;
    object-fit: contain;
  }
}
</style>
<style lang="scss" scoped>
@media print {
  .org-header {
    & .pull-right {
      display: none;
    }
  }
}
</style>
