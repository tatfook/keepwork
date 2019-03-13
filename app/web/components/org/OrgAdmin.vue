<template>
  <div class="org-admin">
    <org-header></org-header>
    OrgAdmin
    <router-view></router-view>
  </div>
</template>
<script>
import OrgHeader from './common/OrgHeader'
export default {
  name: 'OrgAdmin',
  components: {
    OrgHeader
  }
}
</script>
