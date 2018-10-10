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
        <div class="options" ref="options">
          <el-button :class="{'selected':1==currIndex}"  @click="selectTab(1)">项目<span class="search-num">({{allProjects.length}})</span></el-button>
          <el-button :class="{'selected':2==currIndex}"  @click="selectTab(2)">3D世界<span class="search-num">(12345)</span></el-button>
          <el-button :class="{'selected':3==currIndex}"  @click="selectTab(3)">网站<span class="search-num">(12345)</span></el-button>
          <el-button :class="{'selected':4==currIndex}"  @click="selectTab(4)">知识<span class="search-num">(12345)</span></el-button>
          <el-button :class="{'selected':5==currIndex}"  @click="selectTab(5)">课程<span class="search-num">(12345)</span></el-button>
          <el-button :class="{'selected':6==currIndex}"  @click="selectTab(6)">用户<span class="search-num">(12345)</span></el-button>
          <el-button :class="{'selected':7==currIndex}"  @click="selectTab(7)">工作室<span class="search-num">(12345)</span></el-button>
          <el-button :class="{'selected':8==currIndex}"  @click="selectTab(8)">招募中<span class="search-num">(12345)</span></el-button>
        </div>
        <div class="selected-projects" v-if='currIndex == 1'>
          <el-row>
            <el-col :span="6" v-for="(project,index) in allProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="selected-lessons" v-if='currIndex == 5'>

        </div>
        <div class="selected-user" v-if='currIndex == 6'>
          <ul class="selected-user-list">
            <li class="user">
              <div class="portrait">
                <img src="http://star.rayli.com.cn/public/upload/share/000/001/658/04/bcfec7af1f18a45ddc90ec7f9d40a649OJWppZ.jpeg" alt="">
              </div>
                <div class="nickname">
                  <h5 class="name">告诉果果</h5>
                  <p class="desc">项目：<span class="total">1234</span> 粉丝：<span class="total">123456</span></p>
                  <el-button type="primary" class="follow">关注</el-button>
                </div>
                <div class="cover">
                  <img src="http://star.rayli.com.cn/public/upload/share/000/001/658/04/bcfec7af1f18a45ddc90ec7f9d40a649OJWppZ.jpeg" alt="">
              </div>
            </li>
          </ul>
        </div>
        <div class="selected-studio" v-if='currIndex == 7'>
          <el-row>
            <el-col :span="6">
              <div class="studio">
                <img class="studio-cover" src="http://star.rayli.com.cn/public/upload/share/000/001/658/04/bcfec7af1f18a45ddc90ec7f9d40a649OJWppZ.jpeg" alt="">
                <h5 class="studio-name">笑傲江湖</h5>
                <p class="studio-brief">你好，这里是笑傲江湖工作室</p>
                <div class="studio-abstract">
                  <div>
                    <p class="title">项目</p>
                    <p class="amount">123456</p>
                  </div>
                  <div class="member">
                    <p class="title">成员</p>
                    <p class="amount">123456</p>
                  </div>
                  <div>
                    <p class="title">粉丝</p>
                    <p class="amount">1235689</p>
                  </div>
                </div>
                <div class="studio-jion">
                  <el-button type="primary" class="studio-jion-button">申请加入</el-button>
                  <el-button class="studio-jion-button">关注</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="selected-recruitment" v-if='currIndex == 8'></div>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from './ProjectCell'
import _ from 'lodash'
import { mapActions,mapGetters } from 'vuex'

export default {
  name: 'ExplorationPage',
  data() {
    return {
      currIndex: 1
    }
  },
  mounted(){
    this.getAllProjects()
  },
  computed: {
    ...mapGetters({
      allProjects: 'pbl/allProjects'
    })
  },
  methods: {
    ...mapActions({
      getAllProjects: 'pbl/getAllProjects'
    }),
    goSearch() {},
    selectTab(index) {
      switch (index) {
        case 1:
          this.currIndex = 1
          break
        case 2:
          this.currIndex = 2
          break
        case 3:
          this.currIndex = 3
          break
        case 4:
          this.currIndex = 4
          break
        case 5:
          this.currIndex = 5
          break
        case 6:
          this.currIndex = 6
          break
        case 7:
          this.currIndex = 7
          break
        case 8:
          this.currIndex = 8
          break
        default:
          this.currIndex = 1
          break
      }
    }
  },
  components: {
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
          cursor: pointer;
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
      .options {
        margin: 0 auto 24px;
        text-align: center;
        .el-button {
          height: 24px;
          padding: 0 15px;
          font-size: 14px;
          border-radius: 12px;
          margin-top: 4px;
          .search-num{
            margin-left: 8px;
          }
        }
        .selected {
          background: #409eff;
          color: #fff;
        }
        .selected:hover {
          background: rgb(24, 138, 252);
        }
      }
      .selected-user {
        &-list {
          list-style: none;
          .user {
            height: 182px;
            background: #fff;
            display: flex;
            border: 1px solid #e8e8e8;
            .portrait {
              width: 144px;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 96px;
                height: 96px;
                border-radius: 50%;
                object-fit: cover;
              }
            }
            .nickname {
              flex: 1;
              padding-top: 50px;
              .name {
                margin: 5px 0;
                font-size: 16px;
              }
              .desc {
                margin: 5px 0;
                font-size: 14px;
                color: #909399;
                .total {
                  color: #303133;
                }
              }
              .follow {
                height: 32px;
                padding: 0 32px;
                margin-top: 10px;
              }
            }
            .cover {
              width: 268px;
              padding: 16px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
        }
      }
      .selected-studio {
        .el-row {
          .studio {
            width: 286px;
            border: 1px solid #e8e8e8;
            background: #fff;
            padding: 30px 0;
            text-align: center;
            &-cover {
              width: 96px;
              height: 96px;
              border-radius: 50%;
              object-fit: cover;
            }
            &-name {
              font-size: 16px;
              color: #333;
              margin: 18px 0;
            }
            &-brief {
              font-size: 12px;
              color: #999;
              margin: 9px 0;
            }
            &-abstract {
              display: flex;
              div {
                flex: 1;
                .title {
                  font-size: 13px;
                  color: #666;
                }
                .amount {
                  font-size: 18px;
                  color: #333;
                }
              }
              .member {
                position: relative;
              }
              .member::before {
                content: '';
                width: 1px;
                height: 20px;
                background: rgb(202, 200, 200);
                position: absolute;
                left: 0;
                top: 32px;
              }
              .member::after {
                content: '';
                width: 1px;
                height: 20px;
                background: rgb(202, 200, 200);
                position: absolute;
                right: 0;
                top: 32px;
              }
            }
            &-jion {
              padding-top: 6px;
              &-button {
                height: 32px;
                width: 108px;
                padding: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>

