<template>
  <div class="submit-work">
    <h4 class="submit-work-title">提交参赛作品</h4>
    <el-form ref="submitWorkForm" :model="submitWorkInfo" label-width="80px">
      <el-form-item label="作品主题">
        <el-radio-group v-model="submitWorkInfo.theme">
          <el-radio label="游戏"></el-radio>
          <el-radio label="动画"></el-radio>
          <el-radio label="解谜"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="作品名称">
        <el-input v-model="submitWorkInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="作品简介">
        <el-input type="textarea" v-model="submitWorkInfo.desc"></el-input>
      </el-form-item>
      <el-form-item label="作品封面">
        <div class="submit-work-cover">
          <div class="submit-work-cover-img">
            <img v-if="submitWorkInfo.cover" class="submit-work-cover-img-image" :src="submitWorkInfo.cover" alt="cover">
            <div class="submit-work-cover-img-no" @click="showMediaSkyDriveDialog">
              <div class="submit-work-cover-img-no-text">
                <p class="submit-work-cover-img-no-text-icon">+</p>
                <p class="submit-work-cover-img-no-text-hint">上传封面</p>
              </div>
            </div>
          </div>
          <div class="submit-work-cover-state">
            <p class="submit-work-cover-state-ratio">推荐比例 16:9</p>
            <p>支持JPG格式图片</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="项目ID">
        <el-select v-model="submitWorkInfo.workId">
          <el-option v-for="i in gamesProjectsId" :key="i.id" :label="i.name+ '  #' + i.id" :value="i.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="goSubmitWork">提交作品</el-button>
      </el-form-item>
    </el-form>
    <sky-drive-manager-dialog :mediaLibrary='true' :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'SubmitWork',
  data() {
    return {
      submitWorkInfo: {
        gameId: -1,
        theme: '',
        name: '',
        desc: '',
        cover: '',
        workId: ''
      },
      isMediaSkyDriveDialogShow: false
    }
  },
  async mounted() {
    await Promise.all([
      this.getLegalGamesProjects(),
      this.getGamesList()
    ]).catch(e => console.warn(e))
    for (let i = 0; i < this.gamesList.rows.length; i++) {
      if (this.gamesList.rows[i].state === 0) {
        this.submitWorkInfo.gameId = _.get(this.gamesList.rows[i], 'id', 0)
        break
      }
    }
  },
  computed: {
    ...mapGetters({
      legalGamesProjects: 'pbl/legalGamesProjects',
      gamesList: 'pbl/gamesList'
    }),
    gamesProjectsId() {
      return _.map(this.legalGamesProjects, ({ id, name }) => ({
        id,
        name
      }))
    }
  },
  methods: {
    ...mapActions({
      getLegalGamesProjects: 'pbl/getLegalGamesProjects',
      getGamesList: 'pbl/getGamesList',
      submitGameWorks: 'pbl/submitGameWorks'
    }),
    showMediaSkyDriveDialog() {
      this.isMediaSkyDriveDialogShow = true
    },
    closeSkyDriveManagerDialog({ file, url }) {
      this.isMediaSkyDriveDialogShow = false
      if (url) {
        this.submitWorkInfo.cover = url
      }
    },
    async goSubmitWork() {
      if (this.submitWorkInfo.gameId === -1) {
        this.$message.info('当前没有正在进行的比赛')
        return
      }
      let payload = {
        gameId: this.submitWorkInfo.gameId,
        worksSubject: this.submitWorkInfo.theme,
        worksName: this.submitWorkInfo.name,
        worksDescription: this.submitWorkInfo.desc,
        worksLogo: this.submitWorkInfo.cover,
        projectId: this.submitWorkInfo.workId
      }
      await this.submitGameWorks(payload).catch(e => {
        console.dir(e)
      })
      this.$emit('submitSuccess')
    }
  },
  components: {
    SkyDriveManagerDialog
  }
}
</script>

<style lang="scss">
.submit-work {
  &-title {
    font-size: 20px;
    color: #333333;
  }
  &-cover {
    display: flex;
    &-img {
      width: 208px;
      height: 120px;
      border: dashed 1px #80c6fe;
      position: relative;
      &:hover {
        .submit-work-cover-img-no {
          z-index: 10;
        }
      }
      &-image {
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        height: 120px;
        width: 208px;
        object-fit: cover;
      }
      &-no {
        z-index: 0;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        height: 120px;
        width: 208px;
        background: rgba(236, 247, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        &-text {
          text-align: center;
          &-icon {
            margin: 0;
            font-size: 26px;
            color: #409eff;
          }
          &-hint {
            margin: 0;
          }
        }
      }
    }
    &-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      p {
        margin: 0 0 0 50px;
        line-height: 20px;
        color: #666;
      }
      &-ratio {
        padding-top: 40px;
      }
    }
  }
}
</style>

