<template>
  <div class="exploration-page">
    <div class="exploration-page-theme">
      <div class="exploration-page-theme-center">
        <h2 class="theme">
          <span class="explore">探索</span>·未知之境</h2>
        <div class="search">
          <el-row>
            <el-col :span="22">
              <el-input class="search-input">
                <el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-dropdown>
                <span class="el-dropdown-link">
                  最新
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>综合</el-dropdown-item>
                  <el-dropdown-item>最新</el-dropdown-item>
                  <el-dropdown-item>最流行</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="exploration-page-cabinet">
      <div class="exploration-page-cabinet-center">
        <div class="options">
          <el-button type="primary">项目</el-button>
          <el-button>3D世界</el-button>
          <el-button>网站</el-button>
          <el-button>知识</el-button>
          <el-button>课程</el-button>
          <el-button>用户</el-button>
          <el-button>工作室</el-button>
          <el-button>招募中</el-button>
        </div>
        <div class="selected-projects">
          <project-cell></project-cell>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from './ProjectCell'

export default {
  name: 'ExplorationPage',
  data() {
    return {
    }
  },
  methods: {
  },
  components:{
    ProjectCell
  }
}
</script>

<style lang='scss'>
.exploration-page {
  &-theme {
    background: #fff;
    &-center {
      margin: 10px auto;
      max-width: 1200px;
      .theme {
        text-align: center;
        margin: 42px;
        .explore {
          color: #409eff;
        }
      }
      .search {
        &-input {
          width: 300px;
          height: 32px;
          .el-input__inner {
            height: 32px;
          }
        }
        .el-dropdown-link {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          color: #aaa;
        }
      }
    }
  }
  &-cabinet {
    background: #f6f7f8;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 0 56px;
      .options{
        width: 55%;
        margin: 0 auto 24px;
        .el-button{
          height: 24px;
          padding: 0 15px;
          font-size: 14px;
          border-radius: 12px;
        }
      }
    }
  }
}
</style>

