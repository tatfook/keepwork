<template>
  <div class="project-detail-page">
    <project-header class="project-detail-page-header" :projectDetail="pblProjectDetail" v-if="!isFirstGettingData"></project-header>
    <router-view v-if="!isFirstGettingData" :pblProjectDetail='pblProjectDetail'></router-view>
  </div>
</template>
<script>
import ProjectHeader from './common/ProjectHeader'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProjectDetailPage',
  async created() {
    this.initProjectDetail()
  },
  computed: {
    ...mapGetters({
      projectDetail: 'pbl/projectDetail'
    }),
    pblProjectDetail() {
      return this.projectDetail({ projectId: this.projectId })
    },
    projectId() {
      return _.get(this.$route, 'params.id')
    },
    editingProjectId() {
      return _.get(this.pblProjectDetail, 'id')
    }
  },
  data() {
    return {
      isLoading: true,
      isFirstGettingData: true
    }
  },
  methods: {
    ...mapActions({
      pblGetProjectDetail: 'pbl/getProjectDetail',
      getUserDetailByUserId: 'user/getUserDetailByUserId',
      getFavoriteState: 'pbl/getFavoriteState',
      getStarState: 'pbl/getStarState'
    }),
    async initProjectDetail() {
      this.isFirstGettingData = true
      this.isLoading = true
      await this.pblGetProjectDetail({ projectId: this.projectId })
      await this.initProjectHeaderDetail()
      this.isFirstGettingData = false
      this.isLoading = false
    },
    async initProjectHeaderDetail() {
      this.editingUserId = _.get(this.pblProjectDetail, 'userId')
      let userId = this.editingUserId
      let objectId = this.editingProjectId
      let objectType = 5
      await Promise.all([
        this.getUserDetailByUserId({ userId }),
        this.getFavoriteState({ objectId, objectType }),
        this.getStarState({ projectId: objectId })
      ])
    }
  },
  components: {
    ProjectHeader
  },
  watch: {
    $route: function(val) {
      this.initProjectDetail()
    }
  }
}
</script>
