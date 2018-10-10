<template>
  <div class="project-index">
    <div class="container">
      <div class="project-index-sidebar">
        <project-website class="project-index-sidebar-item" :originProjectName='originProjectName' :originProjectUsername='originProjectUsername'></project-website>
        <project-tags class="project-index-sidebar-item" :originProjectDetail='pblProjectDetail' :projectId='projectId'></project-tags>
        <project-joined-members-list class="project-index-sidebar-item" type='card' :projectId='projectId' :projectOwnerPortrait='projectOwnerPortrait'></project-joined-members-list>
      </div>
      <div class="project-index-main">
        <project-basic-info class="project-index-basic" :originProjectDetail='pblProjectDetail' :projectOwnerUsername='originProjectUsername'></project-basic-info>
        <project-comments class="project-index-comments" :projectId='projectId'></project-comments>
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
  props: {
    pblProjectDetail: {
      type: Object,
      required: true
    },
    originProjectUsername: {
      type: String,
      required: true
    },
    projectOwnerPortrait: String,
    projectId: {
      type: Number,
      required: true
    }
  },
  computed: {
    originProjectName() {
      return _.get(this.pblProjectDetail, 'name')
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
    min-width: 0;
  }
  & > .container {
    display: flex;
  }
  &-basic {
    margin-bottom: 24px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }
  &-comments {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }
}
</style>

