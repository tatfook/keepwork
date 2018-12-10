<template>
  <div class="project-mod-container">
    <template v-if="isProjectExist">
      <!-- <project-tags></project-tags> -->
      <!-- <project-basic-info></project-basic-info> -->
      <!-- <project-joined-members-list></project-joined-members-list> -->
    </template>
    <div
      class="project-detail-page-not-found"
      v-else
    >
      <img
        src='@/assets/img/404.png'
        alt=""
      >
      <p class="project-detail-page-not-found-info">404</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import compBaseMixin from '../comp.base.mixin'
import ProjectTags from '@/components/pbl/common/ProjectTags'
import ProjectBasicInfo from '@/components/pbl/common/ProjectBasicInfo'
import ProjectJoinedMembersList from '@/components/pbl/common/ProjectJoinedMembersList'

export default {
  name: 'ProjectMod',
  mixins: [compBaseMixin],
  components: {
    ProjectTags,
    ProjectBasicInfo,
    ProjectJoinedMembersList
  },
  mounted() {

  },
  data() {
    return {
      isProjectExist: true,
    }
  },
  watch: {
    projectId(value) {
      console.warn('projectId: ', value)
    }
  },
  computed: {
    pblProjectDetail() {
      // return this.projectDetail({ projectId: this.projectId })
    },
    projectId() {
      return this.properties.projectId ? this.properties.projectId : this.options.projectId
    }
  },
  methods: {
    ...mapActions({
      pblGetApplyState: 'pbl/getApplyState',
      pblGetProjectDetail: 'pbl/getProjectDetail',
      getUserDetailByUserId: 'user/getUserDetailByUserId',
      getFavoriteState: 'pbl/getFavoriteState',
      getStarState: 'pbl/getStarState',
    }),
    initProjectDetail() {

    }
  }
}
</script>

<style lang="scss">
.proejct-mod-container {
  max-width: 1200px;
}
</style>

