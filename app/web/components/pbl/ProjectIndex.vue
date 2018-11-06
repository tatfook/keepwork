<template>
  <div class="project-index">
    <div class="container">
      <div class="project-index-sidebar">
        <project-intro class="project-index-sidebar-item" :originProjectDetail='pblProjectDetail' :projectId='projectId' :isLoginUserEditable='isLoginUserEditable'></project-intro>
        <project-tags class="project-index-sidebar-item" :originProjectDetail='pblProjectDetail' :projectId='projectId' :isLoginUserEditable='isLoginUserEditable'></project-tags>
        <project-joined-members-list class="project-index-sidebar-item" type='card' :projectId='projectId' :projectOwnerPortrait='projectOwnerPortrait' :originProjectUsername='originProjectUsername'></project-joined-members-list>
        <project-boards v-if="!isProhibitView" :projectId='projectId' :projectDetail='pblProjectDetail' :isProhibitView="isProhibitView" :isProhibitEdit="isProhibitEdit"></project-boards>
      </div>
      <div class="project-index-main">
        <project-basic-info class="project-index-basic" :originProjectDetail='pblProjectDetail' :projectOwnerUsername='originProjectUsername' :projectApplyState='projectApplyState' :projectId='projectId' :isProjectStopRecruit='isProjectStopRecruit' :isLoginUserEditable='isLoginUserEditable'></project-basic-info>
        <project-comments v-if='!isCommentClosed' class="project-index-comments" :projectId='projectId' :isLoginUsercommentable='isLoginUsercommentable'></project-comments>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectIntro from './common/ProjectIntro'
import ProjectTags from './common/ProjectTags'
import ProjectJoinedMembersList from './common/ProjectJoinedMembersList'
import ProjectBasicInfo from './common/ProjectBasicInfo'
import ProjectComments from './common/ProjectComments'
import ProjectBoards from './common/ProjectBoards'
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
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    },
    isLoginUsercommentable: {
      type: Boolean,
      default: true
    },
    isCommentClosed: {
      type: Boolean,
      default: false
    },
    isProjectStopRecruit: {
      type: Boolean,
      default: false
    },
    isProhibitView: {
      type: Boolean,
      default: false
    },
    isProhibitEdit: {
      type: Boolean,
      default: false
    },
    projectApplyState: Number
  },
  computed: {
    originProjectName() {
      return _.get(this.pblProjectDetail, 'name')
    }
  },
  components: {
    ProjectIntro,
    ProjectTags,
    ProjectJoinedMembersList,
    ProjectBasicInfo,
    ProjectComments,
    ProjectBoards
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

