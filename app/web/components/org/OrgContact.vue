<template>
  <div class="org-contact">
    <org-header></org-header>
    <img src="@/assets/img/no_right_to_access.png" alt="">
    <h1>{{$t("org.doNotHaveAccessTo")}}</h1>
    <p class="org-contact-info">{{$t("org.pageOpenToUsers", {orgName})}}</p>
    <p class="org-contact-info org-contact-detail">{{orgName}} {{$t('org.tel')}}: <span class="org-contact-phone">{{orgPhone}}</span></p>
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
