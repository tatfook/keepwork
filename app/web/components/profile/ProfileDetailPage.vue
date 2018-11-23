<template>
  <div class="profile-detail-page" v-loading='isLoading'>
    <profile-header v-if="isFinishFirstInit" :nowUsername='nowUsername'></profile-header>
    <router-view v-if="isFinishFirstInit" :nowUserDetail='nowUserDetail'></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProfileHeader from './common/ProfileHeader'
export default {
  name: 'ProfileDetailPage',
  async mounted() {
    await this.init()
    this.isFinishFirstInit = true
  },
  data() {
    return {
      isLoading: false,
      isFinishFirstInit: false
    }
  },
  computed: {
    ...mapGetters({
      userGetDetailWithRankByUserId: 'user/getDetailWithRankByUserId'
    }),
    nowUserId() {
      return this.$route.params.id
    },
    nowUserDetail() {
      return this.userGetDetailWithRankByUserId({ userId: this.nowUserId })
    },
    nowUsername() {
      return _.get(this.nowUserDetail, 'username')
    }
  },
  methods: {
    ...mapActions({
      getUserDetailWithRankByUserId: 'user/getUserDetailWithRankByUserId'
    }),
    async init() {
      this.isLoading = true
      this.nowUserId &&
        (await this.getUserDetailWithRankByUserId({ userId: this.nowUserId }))
      this.isLoading = false
    }
  },
  watch: {
    route() {
      this.init()
    }
  },
  components: {
    ProfileHeader
  }
}
</script>
<style lang="scss">
.profile-detail-page {
  background-color: #f5f5f5;
}
</style>
