<template>
  <div
    class="project-mod-container"
    v-if="!isLoading"
  >
    <template v-if="isProjectExist">
      <template v-if="isLoginUserVisible">
        <project-tags
          v-if="isProjectExist && projectTagsShow"
          :originProjectDetail="pblProjectDetail"
          :projectId="projectId"
          :isLoginUserEditable='loginUserIsProjectOwner'
        ></project-tags>
        <project-basic-info
          v-if="isProjectExist"
          class="project-index-basic"
          :originProjectDetail='pblProjectDetail'
          :projectOwnerUsername='editingProjectUsername'
          :projectApplyState='projectApplyState'
          :projectId='projectId'
          :isProjectStopRecruit='isProjectStopRecruit'
          :isLoginUserEditable='loginUserIsProjectOwner'
        ></project-basic-info>
        <project-joined-members-list
          v-if="isProjectExist && projectMembersShow"
          class="project-index-sidebar-item"
          type='card'
          :projectId='projectId'
          :projectOwnerPortrait='projectOwnerPortrait'
          :projectDetail='pblProjectDetail'
          :originProjectUsername='editingProjectUsername'
        ></project-joined-members-list>
      </template>
      <template v-else>
        <div class="project-mod-tips">
          <h2>{{$t('card.projectForbidden')}}</h2>
        </div>
      </template>
    </template>
    <template v-else-if="projectIdIsEmpty">
      <div class="project-mod-tips">
        <h2>{{$t('card.project')}}</h2>
        {{$t('card.projectInputId')}}
      </div>
    </template>
    <template v-else-if="!isProjectExist && !projectIdIsEmpty">
      <div class="project-mod-tips">
        <h2>{{$t('card.projectNotFound')}}</h2>
      </div>
    </template>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import compBaseMixin from '../comp.base.mixin'
import ProjectTags from './ProjectTags'
import ProjectBasicInfo from './ProjectBasicInfo'
import ProjectJoinedMembersList from './ProjectJoinedMembersList'
import _ from 'lodash'

export default {
  name: 'AdiProject',
  mixins: [compBaseMixin],
  components: {
    ProjectTags,
    ProjectBasicInfo,
    ProjectJoinedMembersList
  },
  async mounted() {
    if (this.projectId) {
      return await this.initProjectDetail()
    }
    this.isProjectExist = false
  },
  data() {
    return {
      isProjectExist: false,
      isLoading: false
    }
  },
  watch: {
    async projectId(value) {
      if (value) {
        return await this.initProjectDetail()
      }
      this.isProjectExist = false
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
      return this.projectDetail({ projectId: this.projectId })
    },
    _projectId() {
      return this.properties.projectId ? this.properties.projectId : this.options.projectId
    },
    projectId() {
      return this._projectId ? _.toNumber(this._projectId) : null
    },
    projectTagsShow() {
      return this.properties.projectTagsShow ? this.properties.projectTagsShow : this.options.projectTagsShow
    },
    projectMembersShow() {
      return this.properties.projectMembersShow ? this.properties.projectMembersShow : this.options.projectMembersShow
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
      return this.getDetailByUserId({ userId })
    },
    editingProjectUsername() {
      return _.get(this.editingProjectUser, 'username', '')
    },
    projectOwnerPortrait() {
      return _.get(this.editingProjectUser, 'portrait')
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
  .project-mod {
    &-tips {
      text-align: center;
      background: #f6f7f9;
      padding: 20px;
    }
  }
}
</style>

