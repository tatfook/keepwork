<template>
  <div class="creativity-page">
    <div class="creativity-page-create">
      <div class="creativity-page-create-center">
        <h3>{{$t("create.creationStartFromProject")}}</h3>
        <p class="open-word">{{$t("create.projectIsWhereWorksStart")}}</p>
        <p class="open-word">{{$t("create.whatYouLearnFromProject")}}</p>
        <el-button class="create" type="primary" @click="createMyProject">＋{{$t("create.createMyProject")}}</el-button>
        <div class="project-type">
          <el-row>
            <el-col :sm="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_paracraft.png" :alt='`Paracraft${$t("create.create3DGameAndAnim")}`'>
                <div class="project-type-item-title">帕拉卡(Paracraft)</div>
                <div class="project-type-item-brief">{{$t("create.create3DGameAndAnim")}}</div>
              </div>
            </el-col>
            <el-col :sm="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_web.png" :alt='`${$t("create.website")}${$t("create.createYourOwnSite")}`'>
                <div class="project-type-item-title">{{$t("create.website")}}</div>
                <div class="project-type-item-brief">{{$t("create.createYourOwnSite")}}</div>
              </div>
            </el-col>
            <el-col :sm="8">
              <div class="project-type-item">
                <img src="@/assets/img/crate_knowledge_no.png" :alt='`${$t("create.konwledgeEngine")}${$t("create.toBeReleased")}`'>
                <div class="project-type-item-title">{{$t("create.konwledgeEngine")}}</div>
                <div class="project-type-item-brief">{{$t("create.toBeReleased")}}</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div :class="['learn-to-build',{'hidden-learn': hiddenLearn}]" v-if="!hasProjects">
          <span @click="showLearnStep" class="learn">
            <i class="el-icon-warning"></i>{{$t("create.howToCreateProject")}}
          </span>
          <span class="close" @click="closeLearn">&times;</span></div>
      </div>
    </div>
    <div class="creativity-page-projects">
      <div class="creativity-page-projects-center">
        <div class="my-projects" v-if="hasProjects">
          <h4 class="browse-title">{{$t("create.myProjects")}}</h4>
          <el-row>
            <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in myProjectsData" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="my-contribute-projects" v-if="myContributeProjectsData.length > 0">
          <h4 class="browse-title">{{$t("create.contributedProjects")}}</h4>
          <el-row>
            <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in myContributeProjectsData" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="others-projects">
          <h4 class="browse-title">{{$t("create.browseOthersProjects")}}</h4>
          <el-row>
            <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in otherProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="explore-more">
          <el-button class="more" type="primary" @click="goExplorationPage">{{$t("create.exploreMoreProjects")}} →</el-button>
        </div>
      </div>
    </div>
    <create-project-guide :showGuideDialog="showGuideDialog" @close="closeLearnGuide"></create-project-guide>
  </div>
</template>
<script>
import ProjectCell from './ProjectCell'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import CreateProjectGuide from './CreateProjectGuide'

export default {
  name: 'CreativityPage',
  data() {
    return {
      projects: [],
      hiddenLearn: false,
      showGuideDialog: false
    }
  },
  components: {
    ProjectCell,
    CreateProjectGuide
  },
  async mounted() {
    this.getExcellentProjects()
    this.getMyAllProjects()
  },
  computed: {
    ...mapGetters({
      isRealNamed: 'user/isRealNamed',
      excellentProjects: 'pbl/excellentProjects',
      myProjects: 'pbl/myProjects',
      myContributeProjects: 'pbl/myContributeProjects',
      isLogined: 'user/isLogined',
      userId: 'user/userId'
    }),
    myProjectsData() {
      let arr = _.cloneDeep(this.myProjects).sort(this.sortByKey('createdAt'))
      return _.forEach(arr, i => {
        i.name_title = i.name || this.$t('common.untitled')
      })
    },
    myContributeProjectsData() {
      let arr = _.cloneDeep(this.myContributeProjects)
      let myContribute = _.filter(
        arr,
        project => project.user.userId !== this.userId
      )
      return _.forEach(myContribute, i => {
        i.name_title = i.name || this.$t('common.untitled')
      })
    },
    hasProjects() {
      return this.myProjects.length > 0
    },
    otherProjects() {
      let tempArr = _.cloneDeep(_.get(this.excellentProjects, 'rows', []))
      let others = _.filter(
        tempArr,
        project => (project.user && project.user.userId || project.userId) !== this.userId
      )
      let tempArr2 = _.cloneDeep(others.slice(0, 4))
      return _.forEach(tempArr2, i => {
        i.name_title = i.name || this.$t('common.untitled')
      })
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName',
      getExcellentProjects: 'pbl/getExcellentProjects',
      getMyAllProjects: 'pbl/getMyAllProjects',
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    createMyProject() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      window.location.href = '/pbl/project/new'
    },
    goExplorationPage() {
      this.$router.push('explore?tab=allProjects')
    },
    closeLearn() {
      this.hiddenLearn = true
    },
    showLearnStep() {
      this.showGuideDialog = true
    },
    closeLearnGuide() {
      this.showGuideDialog = false
    },
    sortByKey(key) {
      return (obj1, obj2) => {
        return obj1[key] >= obj2[key] ? -1 : 1
      }
    }
  }
}
</script>
<style lang='scss'>
.creativity-page {
  &-create {
    padding: 20px;
    background: #fff;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      .open-word {
        font-size: 14px;
        color: #909399;
        margin: 0;
      }
      .create {
        height: 36px;
        margin: 36px 0 60px;
      }
      .project-type {
        &-item {
          margin-bottom: 40px;
          img {
            height: 144px;
            object-fit: cover;
          }
          &-title {
            margin-top: 30px;
            font-size: 18px;
            color: #333;
          }
          &-brief {
            font-size: 13px;
            color: #999;
          }
        }
      }
      .learn-to-build {
        height: 36px;
        line-height: 36px;
        background: #f5f5f5;
        border: 1px solid #e8e8e8;
        font-size: 14px;
        margin-bottom: 40px;
        color: #909399;
        position: relative;
        .learn {
          cursor: pointer;
        }
        .close {
          display: inline-block;
          width: 40px;
          height: 36px;
          line-height: 36px;
          font-size: 36px;
          position: absolute;
          right: 20px;
          top: 0;
          cursor: pointer;
        }
      }
      .hidden-learn {
        height: 0;
        overflow: hidden;
        border: none;
        transition: all 0.2s ease-out;
      }
    }
  }
  &-projects {
    background: #f6f7f8;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      // .my-projects {
      // }
      // .my-contribute-projects {
      // }
      // .others-projects {
      // }
      .browse-title {
        font-size: 16px;
        color: #303133;
        margin: 0;
        padding: 24px 0;
      }
      .explore-more {
        text-align: center;
        .more {
          margin: 60px 0 80px 0;
          height: 36px;
          line-height: 36px;
          border-radius: 18px;
          font-size: 14px;
          padding: 0 16px;
        }
      }
    }
  }
}
</style>


