<template>
  <div class="exploration-page">
    <div class="exploration-page-theme">
      <div class="exploration-page-theme-center">
        <h2 class="theme">
          <span class="explore">探索</span>·未知之境</h2>
        <div class="search">
          <el-row>
            <el-col :span="22">
              <el-input class="search-input" v-model="searchKey" @keyup.enter.native="goSearch">
                <el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-dropdown @command="handleSort">
                <span class="el-dropdown-link">
                  {{currSortMode}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(i,index) in currSortColumn" :key="index" :command="i.command">{{i.mode}}</el-dropdown-item>
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
          <el-button :class="{'selected':1==currIndex}" @click="selectTab(1)">项目</el-button>
          <el-button :class="{'selected':2==currIndex}" @click="selectTab(2)">3D世界</el-button>
          <el-button :class="{'selected':3==currIndex}" @click="selectTab(3)">网站</el-button>
          <!-- <el-button :class="{'selected':4==currIndex}" @click="selectTab(4)">知识</el-button> -->
          <el-button :class="{'selected':5==currIndex}" @click="selectTab(5)">课程</el-button>
          <el-button :class="{'selected':6==currIndex}" @click="selectTab(6)">用户</el-button>
          <!-- <el-button :class="{'selected':7==currIndex}" @click="selectTab(7)">工作室</el-button> -->
          <el-button :class="{'selected':8==currIndex}" @click="selectTab(8)">招募中</el-button>
        </div>
        <div class="selected-projects" v-if='currIndex == 1'>
          <all-projects ref="allProjects" :searchKey="searchKey" :sortProjects="sortProjects"></all-projects>
        </div>
        <div class="selected-projects" v-if='currIndex == 2'>
          <paracraft ref="paracraft" :searchKey="searchKey" :sortProjects="sortProjects"></paracraft>
        </div>
        <div class="selected-projects" v-if='currIndex == 3'>
          <website ref="website" :searchKey="searchKey" :sortProjects="sortProjects"></website>
        </div>
        <div class="selected-knowledge" v-if='currIndex == 4'>程序员小哥哥小姐姐们拼命开发中。。。。</div>
        <div class="selected-lessons" v-if='currIndex == 5'>
          <course ref="course" :searchKey="searchKey" :sortProjects="sortProjects"></course>
        </div>
        <div class="selected-user" v-if='currIndex == 6'>
          <users ref="users" :searchKey="searchKey" :sortUsers="sortProjects"></users>
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
        <div class="selected-projects" v-if='currIndex == 8'>
          <recruiting ref="recruiting" :searchKey="searchKey" :sortProjects="sortProjects"></recruiting>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AllProjects from './explorationPageTab/AllProjects'
import Paracraft from './explorationPageTab/Paracraft'
import Website from './explorationPageTab/Website'
import Course from './explorationPageTab/Course'
import Recruiting from './explorationPageTab/Recruiting'
import Users from './explorationPageTab/Users'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ExplorationPage',
  data() {
    return {
      currIndex: 1,
      searchKey: '',
      sortProjects: '',
      currSortMode: '综合'
    }
  },
  mounted() {
    const { query } = this.$route
    if (query && query.keyword) {
      history.replaceState('', '', this.$route.path)
      this.searchKey = query.keyword
      this.goSearch()
    }
  },
  computed: {
    ...mapGetters({
      allProjects: 'pbl/allProjects',
      paracraft: 'pbl/paracraft',
      website: 'pbl/website'
    }),
    currSortColumn() {
      switch (this.currIndex) {
        case 1:
        case 2:
        case 3:
        case 5:
        case 8:
          return [
            { mode: '综合', command: '/综合' },
            { mode: '最新', command: 'updated_time/最新' },
            { mode: '热门', command: 'recent_view/热门' }
          ]
          break
        case 6:
          return [
            { mode: '综合', command: '/综合' },
            { mode: '项目', command: 'total_projects/项目' },
            { mode: '名气', command: 'total_fans/名气' }
          ]
          break
        default:
          return [{ mode: '综合', command: '/综合' }]
          break
      }
    }
  },
  methods: {
    handleSort(sortType) {
      this.currSortMode = sortType.split('/')[1]
      this.sortProjects = sortType.split('/')[0]
      this.goSearch()
    },
    goSearch() {
      switch (this.currIndex) {
        case 1:
          this.$refs.allProjects.targetPage(1)
          break
        case 2:
          this.$refs.paracraft.targetPage(1)
          break
        case 3:
          this.$refs.website.targetPage(1)
          break
        case 4:
          break
        case 5:
          this.$refs.course.targetPage(1)
          break
        case 6:
          this.$refs.users.targetPage(1)
          break
        case 7:
          break
        case 8:
          this.$refs.recruiting.targetPage(1)
          break
        default:
          this.currIndex = 1
          break
      }
    },
    selectTab(index) {
      this.currIndex = index
      this.currSortMode = '综合'
      this.sortProjects = ''
    }
  },
  components: {
    AllProjects,
    Paracraft,
    Website,
    Course,
    Recruiting,
    Users
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
          .search-num {
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
  .search-result-total {
    padding: 15px 0;
    font-size: 18px;
  }
}
.search-result-total{
  margin: 20px 30px;
}
.all-projects {
  &-pages {
    margin-top: 40px;
    text-align: center;
  }
}
</style>

