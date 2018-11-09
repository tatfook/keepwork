<template>
  <div class="creativity-page">
    <div class="creativity-page-create">
      <div class="creativity-page-create-center">
        <h3>创造，从项目开始</h3>
        <p class="open-word">项目，是一个作品的开始。</p>
        <p class="open-word">它将让你在学习中成长，让你体会到团结协作的快乐，让你成为优秀的管理者！</p>
        <el-button class="create" type="primary" @click="createMyProject">＋创建我的项目</el-button>
        <div class="project-type" v-if="!hasProjects">
          <el-row>
            <el-col :sm="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_paracraft.png" alt="">
                <div class="project-type-item-title">Paracraft</div>
                <div class="project-type-item-brief">创造3D交互动画和游戏</div>
              </div>
            </el-col>
            <el-col :sm="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_web.png" alt="">
                <div class="project-type-item-title">网站</div>
                <div class="project-type-item-brief">创造属于你的网站</div>
              </div>
            </el-col>
            <el-col :sm="8">
              <div class="project-type-item">
                <img src="@/assets/img/crate_knowledge_no.png" alt="">
                <div class="project-type-item-title">个人知识</div>
                <div class="project-type-item-brief">敬请期待！</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div :class="['learn-to-build',{'hidden-learn': hiddenLearn}]" v-if="!hasProjects">
          <span @click="showLearnStep" class="learn"><i class="el-icon-warning"></i>不太了解项目？马上学习如何创建项目</span><span class="close" @click="closeLearn">&times;</span></div>
      </div>
    </div>
    <div class="creativity-page-projects">
      <div class="creativity-page-projects-center">
        <div class="my-projects" v-if="hasProjects">
          <h4 class="browse-title">我的项目</h4>
          <el-row>
            <el-col :sm="12" :md="6" v-for="(project,index) in myProjectsData" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="my-contribute-projects" v-if="myContributeProjects.length > 0">
          <h4 class="browse-title">我参与的项目</h4>
          <el-row>
            <el-col :sm="12" :md="6" v-for="(project,index) in myContributeProjectsData" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="others-projects">
          <h4 class="browse-title">看看其他人的项目</h4>
          <el-row>
            <el-col :sm="12" :md="6" v-for="(project,index) in otherProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="explore-more">
          <el-button class="more" type="primary" @click="goExplorationPage">去探索更多好玩的项目 →</el-button>
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
      excellentProjects: 'pbl/excellentProjects',
      myProjects: 'pbl/myProjects',
      myContributeProjects: 'pbl/myContributeProjects',
      isLogined: 'user/isLogined'
    }),
    myProjectsData(){
      let arr = _.cloneDeep(this.myProjects)
      return _.forEach(arr, i => {
        i.name_title = i.name || '未命名'
      })
    },
    myContributeProjectsData(){
      let arr = _.cloneDeep(this.myContributeProjects)
      return _.forEach(arr, i => {
        i.name_title = i.name || '未命名'
      })
    },
    hasProjects() {
      return this.myProjects.length > 0
    },
    otherProjects() {
      let tempArr = _.cloneDeep(_.get(this.excellentProjects, 'rows', []))
      let tempArr2 = _.cloneDeep(tempArr.slice(0, 4))
      return _.forEach(tempArr2, i => {
        i.name_title = i.name || '未命名'
      })
    }
  },
  methods: {
    ...mapActions({
      getExcellentProjects: 'pbl/getExcellentProjects',
      getMyAllProjects: 'pbl/getMyAllProjects',
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    createMyProject() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      window.location.href = '/pbl/project/new'
    },
    goExplorationPage() {
      this.$router.push('exploration')
    },
    closeLearn() {
      this.hiddenLearn = true
    },
    showLearnStep(){
      this.showGuideDialog =true
    },
    closeLearnGuide(){
      this.showGuideDialog = false
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
        .learn{
          cursor: pointer;
        }
        .close {
          display: inline-block;
          width: 40px;
          height: 38px;
          line-height: 42px;
          font-size: 28px;
          position: absolute;
          right: 20px;
          cursor: pointer;
        }
      }
      .hidden-learn {
        height: 0;
        overflow: hidden;
        border: none;
        transition: all .2s ease-out;
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


