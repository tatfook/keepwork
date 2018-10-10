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
            <el-col :span="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_paracraft.png" alt="">
                <div class="project-type-item-title">Paracraft</div>
                <div class="project-type-item-brief">创造3D交互动画和游戏</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_web.png" alt="">
                <div class="project-type-item-title">网站</div>
                <div class="project-type-item-brief">创造属于你的网站</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_knowledge.png" alt="">
                <div class="project-type-item-title">个人知识</div>
                <div class="project-type-item-brief">敬请期待！</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="learn-to-build" v-if="!hasProjects">
          <i class="el-icon-warning"></i>不太了解项目？马上学习如何创建项目</div>
      </div>
    </div>
    <div class="creativity-page-projects">
      <div class="creativity-page-projects-center">
        <div class="my-projects" v-if="hasProjects">
          <h4 class="browse-title">我的项目</h4>
          <el-row>
            <el-col :span="6" v-for="(project,index) in myProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="my-contribute-projects" v-if="myContributeProjects.length > 0">
          <h4 class="browse-title">我参与的项目</h4>
          <el-row>
            <el-col :span="6" v-for="(project,index) in myContributeProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="others-projects">
          <h4 class="browse-title">看看其他人的项目</h4>
          <el-row>
            <el-col :span="6" v-for="(project,index) in allProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="explore-more">
          <el-button class="more" type="primary">去探索更多好玩的项目 →</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from './ProjectCell'
import { keepwork } from '@/api'
import _ from 'lodash'
import { mapActions,mapGetters } from 'vuex'

export default {
  name: 'CreativityPage',
  data() {
    return {
      projects: [],
      myProjects: [],
      myContributeProjects: [],
    }
  },
  components: {
    ProjectCell
  },
  async mounted(){
    this.getAllProjects()
    await Promise.all([
      keepwork.projects.getPersonalProjects(),
      keepwork.projects.getContributeProjects(),
    ]).then(res => {
      this.myProjects = res[0]
      this.myContributeProjects = res[1]
    }).catch(err => console.error(err))
  },
  computed:{
    ...mapGetters({
      allProjects: 'pbl/allProjects'
    }),
    hasProjects(){
      return this.myProjects.length > 0
    }
  },
  methods:{
    ...mapActions({
      getAllProjects: 'pbl/getAllProjects'
    }),
    createMyProject(){
      window.location.href='/pbl/project/new'
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
          img {
            // width: 218px;
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
        margin: 40px 0;
        color: #909399;
      }
    }
  }
  &-projects {
    background: #f6f7f8;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      .my-projects {
      }
      .my-contribute-projects {
      }
      .others-projects {
      }
      .browse-title {
        font-size: 16px;
        color: #303133;
        margin: 0;
        padding: 24px 0;
      }
      .explore-more{
        text-align: center;
        .more{
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


