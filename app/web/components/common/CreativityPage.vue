<template>
  <div class="creativity-page">
    <div class="creativity-page-create">
      <div class="creativity-page-create-center">
        <h3>创造，从项目开始</h3>
        <p class="open-word">项目，是一个作品的开始。</p>
        <p class="open-word">它将让你在学习中成长，让你体会到团结协作的快乐，让你成为优秀的管理者！</p>
        <el-button class="create" type="primary">＋创建我的项目</el-button>
        <div class="project-type" v-if="!hasProjects">
          <el-row>
            <el-col :span="8">
              <div class="item">
                <img src="@/assets/img/create_paracraft.png" alt="">
                <div class="item-title">Paracraft</div>
                <div class="item-brief">创造3D交互动画和游戏</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="item">
                <img src="@/assets/img/create_web.png" alt="">
                <div class="item-title">网站</div>
                <div class="item-brief">创造属于你的网站</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="item">
                <img src="@/assets/img/create_knowledge.png" alt="">
                <div class="item-title">个人知识</div>
                <div class="item-brief">敬请期待！</div>
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
            <el-col :span="6">
              <project-cell></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="my-contribute-projects" v-if="hasProjects">
          <h4 class="browse-title">我参与的项目</h4>
          <el-row>
            <el-col :span="6">
              <project-cell></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="others-projects">
          <h4 class="browse-title">看看其他人的项目</h4>
          <el-row>
            <el-col :span="6">
              <project-cell></project-cell>
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

export default {
  name: 'CreativityPage',
  data() {
    return {
      hasProjects: false
    }
  },
  components: {
    ProjectCell
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
        margin: 36px;
      }
      .project-type {
        .item {
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


