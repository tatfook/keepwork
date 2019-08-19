<template>
  <div class="project-detail-page">
    <div v-if="isProjectExist && isLoginUserVisible">
      <project-header class="project-detail-page-header" :projectDetail="pblProjectDetail" :editingUserId='editingUserId' :editingProjectUsername='editingProjectUsername' v-if="!isFirstGettingData" :isLoginUserEditable='loginUserIsProjectOwner' :isProhibitView="isProhibitView"></project-header>
      <router-view v-if="!isFirstGettingData" :pblProjectDetail='pblProjectDetail' :projectId='projectId' :originProjectUsername='editingProjectUsername' :projectOwnerPortrait='projectOwnerPortrait' :isLoginUserEditable='loginUserIsProjectOwner' :projectApplyState='projectApplyState' :isLoginUsercommentable='isLoginUsercommentable' :isCommentClosed='isCommentClosed' :isProjectStopRecruit='isProjectStopRecruit' :isProhibitView="isProhibitView" :isProhibitEdit="isProhibitEdit"></router-view>
    </div>
    <div class="project-detail-page-not-found" v-if="!isProjectExist || !isLoginUserVisible">
      <img src='@/assets/img/404.png' alt="">
      <p class="project-detail-page-not-found-info">404</p>
    </div>
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
      pblProjectApplyState: 'pbl/projectApplyState',
      loginUserId: 'user/userId',
      isLogined: 'user/isLogined',
      projectDetail: 'pbl/projectDetail',
      getDetailByUserId: 'user/getDetailByUserId',
      loginUsername: 'user/username',
      projectMemberList: 'pbl/projectMemberList'
    }),
    pblProjectDetail() {
      return this.projectDetail({ projectId: this.projectId })
    },
    projectId() {
      return _.toNumber(_.get(this.$route, 'params.id'))
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
      return _.get(this.editingProjectUser, 'username')
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
  data() {
    return {
      isLoading: true,
      editingUserId: undefined,
      isFirstGettingData: true,
      isProjectExist: true
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
    async initProjectDetail() {
      this.isFirstGettingData = true
      this.isLoading = true
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
        })
      }
      this.isFirstGettingData = false
      this.isLoading = false
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
      const [userInfo] = await Promise.all(
        _.map(promiseArray, promiseItem => {
          return promiseItem
          .catch(error => {
            return error
          })
        })
      )
      if (!userInfo.isRealname) {
        this.$router.push({ name: 'NotVerifiedPage'})
      }
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
<style lang="scss">
.project-detail-page {
  background-color: #f5f5f5;
  &-not-found {
    text-align: center;
    padding-top: 40px;
    font-size: 28px;
    font-weight: bold;
  }
}
</style>
