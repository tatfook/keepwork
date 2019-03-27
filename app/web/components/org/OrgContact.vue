<template>
  <div class="org-contact">
    <org-header></org-header>
    <img src="@/assets/img/no_right_to_access.png" alt="">
    <h1>你没有访问该页面的权限哦！</h1>
    <p class="org-contact-info">该页面为{{orgName}}的用户提供服务。如果权限未开通，请联系你的管理员。</p>
    <p class="org-contact-info org-contact-detail">{{orgName}} 联系电话: <span class="org-contact-phone">{{orgPhone}}</span></p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OrgHeader from './common/OrgHeader'
export default {
  name: 'OrgContact',
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg'
    }),
    orgName() {
      return _.get(this.currentOrg, 'name')
    },
    orgPhone() {
      return _.get(this.currentOrg, 'cellphone')
    }
  },
  components: {
    OrgHeader
  }
}
</script>
<style lang="scss" scoped>
.org-contact {
  text-align: center;
  img {
    margin-top: 72px;
    max-width: 100%;
  }
  h1 {
    margin: 48px 0 24px;
    font-size: 32px;
    font-weight: bold;
    color: #303133;
  }
  &-info {
    font-size: 16px;
    margin-bottom: 32px;
    color: #909399;
  }
  &-detail {
    color: #309ef3;
  }
  &-phone {
    font-weight: bold;
  }
}
</style>
