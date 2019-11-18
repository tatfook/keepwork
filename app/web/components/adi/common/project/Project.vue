<template>
  <div class="project-mod-container">
    <template>
      <template v-if="isLoginUserVisible && isMiniStyle">
        <project-mini :originProjectDetail='pblProjectDetail' :projectOwnerUsername='editingProjectUsername' :projectId="projectId"></project-mini>
      </template>
      <template v-else-if="isLoginUserVisible">
        <project-tags v-if="projectTagsShow" :originProjectDetail="pblProjectDetail" :projectId="projectId" :isLoginUserEditable='loginUserIsProjectOwner'></project-tags>
        <project-basic-info class="project-index-basic" :originProjectDetail='pblProjectDetail' :projectOwnerUsername='editingProjectUsername' :projectApplyState='projectApplyState' :projectId='projectId' :isProjectStopRecruit='isProjectStopRecruit' :isLoginUserEditable='loginUserIsProjectOwner'></project-basic-info>
        <project-joined-members-list v-if="projectMembersShow" class="project-index-sidebar-item" type='card' :projectId='projectId' :originProjectUser='editingProjectUser' :projectDetail='pblProjectDetail' :originProjectUsername='editingProjectUsername'></project-joined-members-list>
      </template>
      <template v-else>
        <div class="project-mod-tips">
          <h2>{{$t('card.projectForbidden')}}</h2>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import compBaseMixin from '../comp.base.mixin'
import ProjectTags from './ProjectTags'
import ProjectBasicInfo from './ProjectBasicInfo'
import ProjectJoinedMembersList from './ProjectJoinedMembersList'
import ProjectMini from './ProjectMini'
import _ from 'lodash'

export default {
  name: 'AdiProject',
  mixins: [compBaseMixin],
  components: {
    ProjectMini,
    ProjectTags,
    ProjectBasicInfo,
    ProjectJoinedMembersList
  },
  async mounted() {
    await this.initProjectDetail()
  },
  data() {
    return {
      isProjectExist: true,
      isLoading: false
    }
  },
  watch: {
    async projectId(value) {
      if (value) {
        await this.initProjectDetail()
      } else {
        this.refreshProjectData()
      }
    }
  },
  computed: {
    ...mapGetters({
      projectDetail: 'pbl/projectDetail',
      getDetailByUserId: 'user/getDetailByUserId',
      pblProjectApplyState: 'pbl/projectApplyState',
      loginUserId: 'user/userId',
      isLogined: 'user/isLogined',
      loginUsername: 'user/username',
      projectMemberList: 'pbl/projectMemberList'
    }),
    pblProjectDetail() {
      return this.projectDetail({ projectId: this.projectId }) || {}
    },
    styleID() {
      return (
        _.get(this.options, 'styleID', '') ||
        _.get(this.rootMod, 'data.styleID', 0)
      )
    },
    isMiniStyle() {
      return this.styleID === 1
    },
    _projectId() {
      return this.properties.projectId
        ? this.properties.projectId
        : this.options.projectId
    },
    projectId() {
      return this._projectId ? _.toNumber(this._projectId) : 0
    },
    projectTagsShow() {
      return this.properties.projectTagsShow
        ? this.properties.projectTagsShow
        : this.options.projectTagsShow
    },
    projectMembersShow() {
      return this.properties.projectMembersShow
        ? this.properties.projectMembersShow
        : this.options.projectMembersShow
    },
    projectIdIsEmpty() {
      return _.isEmpty(this._projectId)
    },
    projectApplyState() {
      return this.pblProjectApplyState({
        projectId: this.projectId,
        userId: this.loginUserId
      })
    },
    isLoginUserBeProjectMember() {
      return this.loginUserIsProjectOwner || this.projectApplyState === 1
    },
    projectPrivilege() {
      return _.get(this.pblProjectDetail, 'privilege')
    },
    isProjectPrivate() {
      return _.get(this.pblProjectDetail, 'visibility') === 1
    },
    isLoginUserVisible() {
      return !this.isProjectPrivate || this.isLoginUserBeProjectMember
    },
    isCommentForMember() {
      return (this.projectPrivilege & 8) > 0
    },
    isLoginUsercommentable() {
      return !this.isCommentForMember || this.isLoginUserBeProjectMember
    },
    isCommentClosed() {
      return (this.projectPrivilege & 16) > 0
    },
    isBoardViewForMember() {
      return (this.projectPrivilege & 64) > 0
    },
    isBoardEditForMember() {
      return (this.projectPrivilege & 256) > 0
    },
    isProjectStopRecruit() {
      return (this.projectPrivilege & 2) > 0
    },
    editingProjectUser() {
      let userId = this.editingUserId
      return this.projectId ? this.getDetailByUserId({ userId }) : {}
    },
    editingProjectUsername() {
      return _.get(this.editingProjectUser, 'username', '')
    },
    loginUserIsProjectOwner() {
      return this.loginUsername === this.editingProjectUsername
    },
    projectMembers() {
      return this.projectMemberList({ projectId: this.projectId })
    },
    projectMembers() {
      return this.projectMemberList({ projectId: this.projectId })
    },
    isProhibitView() {
      return this.isBoardViewForMember && !this.isLoginUserBeProjectMember
    },
    isProhibitEdit() {
      return this.isBoardEditForMember && !this.isLoginUserBeProjectMember
    }
  },
  methods: {
    ...mapActions({
      pblGetApplyState: 'pbl/getApplyState',
      pblGetProjectDetail: 'pbl/getProjectDetail',
      getUserDetailByUserId: 'user/getUserDetailByUserId',
      getFavoriteState: 'pbl/getFavoriteState',
      getStarState: 'pbl/getStarState'
    }),
    async refreshProjectData() {
      this.isLoading = true
      this.$nextTick(() => (this.isLoading = false))
    },
    async initProjectHeaderDetail() {
      this.editingUserId = _.get(this.pblProjectDetail, 'userId')
      let userId = this.editingUserId
      let objectId = this.projectId
      let objectType = 5
      let promiseArray = [
        this.getUserDetailByUserId({ userId }),
        this.getFavoriteState({ objectId, objectType }),
        this.getStarState({ projectId: objectId })
      ]
      await Promise.all(
        _.map(promiseArray, promiseItem => {
          return promiseItem.catch(error => {
            return error
          })
        })
      ).catch(e => console.error(e))
    },
    async initProjectDetail() {
      if (!this.projectId) return
      this.isLoading = true
      this.isProjectExist = true
      await this.pblGetProjectDetail({ projectId: this.projectId }).catch(
        error => {
          let statusCode = _.get(error, 'response.status', 404)
          if (statusCode === 404) {
            this.isProjectExist = false
          }
        }
      )
      await this.initProjectHeaderDetail()
      if (this.isLogined) {
        await this.pblGetApplyState({
          objectId: this.projectId,
          objectType: 5,
          applyType: 0,
          applyId: this.loginUserId
        }).catch(e => console.error(e))
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss">
.project-mod-container {
  max-width: 1080px;
  margin: 0 auto;
  .project-mod {
    &-tips {
      text-align: center;
      background: #f6f7f9;
      padding: 20px;
    }
  }
}
</style>

