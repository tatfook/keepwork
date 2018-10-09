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
      pblGetProjectDetail: 'pbl/getProjectDetail'
    }),
    async initProjectDetail() {
      this.isFirstGettingData = true
      this.isLoading = true
      await this.pblGetProjectDetail({ projectId: this.projectId })
      this.isFirstGettingData = false
      this.isLoading = false
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
