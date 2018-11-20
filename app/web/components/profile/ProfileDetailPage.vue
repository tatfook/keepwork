<template>
  <div class="profile-detail-page">
    <profile-header :nowUsername='nowUsername'></profile-header>
    <router-view></router-view>
  </div>
</template>

<script>
import ProfileHeader from './common/ProfileHeader'
export default {
  name: 'ProfileDetailPage',
  computed: {
    nowUsername() {
      return 'kaitlyn'
    }
  },
  components: {
    ProfileHeader
  }
}
</script>
