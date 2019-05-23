<template>
  <div class="game-entry">
    <el-dropdown class="game-entry-dropdown" placement="bottom-start" @visible-change='handleVisibleChange' @command='toJoin'>
      <div class="el-dropdown-link">
        {{$t('common.contestEntry')}}<i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu v-loading='isLoading' slot="dropdown">
        <el-dropdown-item v-show="filteredDuplicateGames.length > 0" v-for='(game, index) in filteredDuplicateGames' :key='index' :command='projectJoinedGames && projectJoinedGames.name === game ? undefined : game'>
          {{game}}<span v-if="projectJoinedGames && projectJoinedGames.name === game" class="game-entry-joined">已参赛</span>
        </el-dropdown-item>
        <el-dropdown-item class="game-entry-empty" v-show="filteredDuplicateGames.length == 0">{{$t('project.noGames')}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog class="game-entry-submit" :visible.sync="isSubmitWorkVisible" v-if="isSubmitWorkVisible" width="614px" :before-close="closeSubmitDialog">
      <submit-work :selectedGameAndProject='selectedGameAndProject' @close='closeSubmitDialog' @submitSuccess="handleSubmitSuccess"></submit-work>
    </el-dialog>
    <el-dialog class="game-entry-hint-dialog" :visible.sync="isHintVisible" width="375px" center :before-close="closeHintDialog">
      <p class="game-entry-hint-dialog-text">请完善个人信息</p>
      <p class="game-entry-hint-dialog-text">包括姓名、手机号、出生年月、邮箱、QQ</p>
      <a href="/u/p/userData" target="_blank" class="game-entry-hint-dialog-btn">现在就去</a>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import SubmitWork from '@/components/common/SubmitWork'
export default {
  name: 'GameEntry',
  props: {
    projectId: {
      required: true
    }
  },
  data() {
    return {
      isSubmitWorkVisible: false,
      isHintVisible: false,
      isLoading: false,
      selectedGameAndProject: undefined
    }
  },
  computed: {
    ...mapGetters({
      loginUserDetail: 'user/profile',
      pblGamesList: 'pbl/gamesList',
      pblProjectJoinedGames: 'pbl/projectJoinedGames'
    }),
    projectJoinedGames() {
      return this.pblProjectJoinedGames({ projectId: this.projectId })
    },
    inProgressGames() {
      return _.filter(this.pblGamesList.rows, game => {
        let startTime = new Date(game.startDate).getTime()
        let endTime = new Date(game.endDate).getTime()
        let nowTime = new Date().getTime()
        return nowTime >= startTime && nowTime <= endTime
      })
    },
    filteredDuplicateGames() {
      let groupedGames = _.groupBy(this.inProgressGames, game => game.name)
      return _.keys(groupedGames)
    },
    isUserinfoSatisfied() {
      return (
        this.loginUserDetail.info &&
        this.loginUserDetail.info.name &&
        this.loginUserDetail.realname &&
        this.loginUserDetail.info.birthdate &&
        this.loginUserDetail.email &&
        this.loginUserDetail.info.qq
      )
    }
  },
  methods: {
    ...mapActions({
      pblGetGamesList: 'pbl/getGamesList',
      pblGetProjectGames: 'pbl/getProjectGames'
    }),
    async handleVisibleChange(isVisible) {
      if (isVisible) {
        this.isLoading = true
        await this.pblGetGamesList().catch()
        await this.pblGetProjectGames({ projectId: this.projectId }).catch()
        this.isLoading = false
      }
    },
    setSelectedGame(gameName) {
      this.selectedGameAndProject = {
        game: _.find(this.inProgressGames, { name: gameName }),
        projectId: this.projectId
      }
      return true
    },
    checkUserInfoMeetDemmand() {},
    showJoinComp() {
      this.isSubmitWorkVisible = true
    },
    toJoin(gameName) {
      if (!this.isUserinfoSatisfied) {
        this.isHintVisible = true
        return
      }
      gameName && this.setSelectedGame(gameName) && this.showJoinComp()
    },
    handleSubmitSuccess() {
      this.$message({
        message: '参赛成功！',
        type: 'success'
      })
      this.closeSubmitDialog()
    },
    closeHintDialog() {
      this.isHintVisible = false
    },
    closeSubmitDialog() {
      this.isSubmitWorkVisible = false
    }
  },
  components: {
    SubmitWork
  }
}
</script>
<style lang="scss">
.game-entry {
  &-dropdown {
    .el-dropdown-link {
      height: 38px;
      line-height: 38px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 0 12px;
      color: #606266;
      cursor: pointer;
    }
    .el-icon-caret-bottom {
      color: #909399;
    }
  }
  &-joined {
    color: #2397f3;
    margin-left: 4px;
  }
  &-empty {
    color: #c0c4cc;
  }
  &-submit {
    .el-dialog__body {
      padding: 10px 80px;
    }
  }
  &-hint-dialog {
    &-text {
      text-align: center;
      color: #333;
      font-size: 16px;
    }
    &-btn {
      width: 90%;
      margin: 40px auto;
      display: block;
      width: 285px;
      height: 44px;
      line-height: 44px;
      color: #fff;
      text-align: center;
      background: #409eff;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
    }
  }
}
</style>
