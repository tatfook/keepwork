<template>
  <div class="project-index">
    <div class="container">
      <div class="project-index-sidebar">
        <project-website class="project-index-sidebar-item"></project-website>
        <project-tags class="project-index-sidebar-item"></project-tags>
        <project-joined-members-list class="project-index-sidebar-item" type='card' :projectId='projectId'></project-joined-members-list>
      </div>
      <div class="project-index-main">
        <project-basic-info></project-basic-info>
        <project-comments></project-comments>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectWebsite from './common/ProjectWebsite'
import ProjectTags from './common/ProjectTags'
import ProjectJoinedMembersList from './common/ProjectJoinedMembersList'
import ProjectBasicInfo from './common/ProjectBasicInfo'
import ProjectComments from './common/ProjectComments'
export default {
  name: 'ProjectIndex',
  computed: {
    projectId() {
      return _.get(this.$route, 'params.id')
    }
  },
  components: {
    ProjectWebsite,
    ProjectTags,
    ProjectJoinedMembersList,
    ProjectBasicInfo,
    ProjectComments
  }
}
</script>
<style lang="scss">
.project-index {
  background-color: #f5f5f5;
  padding-top: 24px;
  &-sidebar {
    width: 276px;
    margin-right: 24px;
    &-item {
      margin-bottom: 24px;
    }
  }
  &-main {
    flex: 1;
  }
  & > .container {
    display: flex;
  }
}
</style>

