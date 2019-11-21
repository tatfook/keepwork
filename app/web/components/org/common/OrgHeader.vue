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
      <el-menu-item index='5' v-if="isLogin" class="pull-right user-message-menu-item right-icon-item">
        <message-box @toMessageCenter="toMessageCenter" @toMessageDetail="toMessageDetail"></message-box>
      </el-menu-item>
      <el-menu-item index='4' class="pull-right">
        <a class="org-header-more-learn" href="/s" target="_blank">{{$t('org.moreStudy')}}</a>
      </el-menu-item>
      <el-menu-item index='6' class="pull-right">
        <el-button @click="toTeachCenter" class="teach-center-button" type="primary">教学中心</el-button>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import MessageBox from '@/components/common/message/MessageBox'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'OrgHeader',
  components: {
    MessageBox
  },
  filters: {
    formatDate(date) {
      const _date = moment(date)
      return _date.isSame(moment(), 'day')
        ? _date.format('H:mm')
        : _date.format('MM/DD')
    }
  },
  data() {
    return {
      msgScroll: null,
      perPage: 10,
      loadingMore: false
    }
  },
  computed: {
    ...mapGetters({
      getToken: 'org/getToken',
      currentOrg: 'org/currentOrg'
    }),
    orgLogo() {
      return _.get(this.currentOrg, 'logo')
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    isLogin() {
      return Boolean(this.getToken())
    }
  },
  methods: {
    ...mapActions({
      userLogout: 'user/logout',
      isAdmin: 'org/isAdmin',
      isTeacher: 'org/isTeacher'
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
    },
    toMessageCenter() {
      this.$router.push({ name: 'orgMessage' })
    },
    toMessageDetail(message) {
      const { messageId } = message
      this.$router.push({
        name: 'orgMessage',
        query: { orgId: this.orgId, messageId }
      })
    },
    toTeachCenter() {
      if (this.isAdmin) {
        return this.$router.push({ name: 'OrgPackages' })
      }
      if (this.isTeacher) {
        return this.$router.push({ name: 'OrgTeacher' })
      }
      this.$router.push({ name: 'OrgStudent' })
    }
  }
}
</script>
<style lang="scss">
.org-header {
  border-bottom: solid 1px #e6e6e6;
  background-color: #fff;
  .user-message-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    line-height: 48px;
    .user-message-badge {
      line-height: 22px;
      .el-badge__content {
        height: 16px;
        line-height: 16px;
        padding: 0 4px;
        font-size: 12px;
      }
    }
    .user-message-icon {
      font-size: 30px;
    }
  }
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
  /deep/ .el-menu-item.is-active {
    color: #909399;
    border-bottom: none;
    border-bottom-color: #fff;
    &:hover {
      color: #909399;
    }
  }
  /deep/ .teach-center-button {
    padding: 5px 30px;
    background: #1385ff;
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
