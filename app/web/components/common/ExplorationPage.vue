<template>
  <div class="exploration-page">
    <div class="exploration-page-theme">
      <div class="exploration-page-theme-center">
        <div class="theme">
          <el-input :placeholder="$t('explore.searchFor')" class="search-input" v-model="searchKey" @keyup.enter.native="goSearch">
            <i slot="suffix" class="el-icon-search search-input-button" @click="goSearch"> {{$t("explore.search")}}</i>
          </el-input>
        </div>
        <div class="search">
          <el-row>
            <el-col :sm="16" :xs="24">
              <div class="search-tab">
                <el-menu :default-active="activeTabIndex" class="search-tab-menu" mode="horizontal" @select="handleSelectTab">
                  <el-menu-item v-for="item in tabBar" :key='item.command' :index="item.command">{{item.tag}}</el-menu-item>
                </el-menu>
              </div>
            </el-col>
            <el-col :sm="8" :xs="24">
              <div class="search-result">
                <span class="contain-total">{{$t("explore.contain")}}<span class="contain-total-num">{{searchResultAmount}}</span>{{$t("explore.result")}}</span>
                <el-dropdown @command="handleSort" class="sort-dropdown-menu">
                  <span class="el-dropdown-link">
                    {{currSortMode}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(i,index) in currSortColumn" :key="index" :command="i">{{i.mode}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="exploration-page-cabinet">
      <div class="exploration-page-cabinet-center">
        <div class="selected-projects">
          <component :is="currentTabComp" :ref="currentTab" :searchKey="searchKey" :sortProjects="sortProjects" @getAmount="getAmount"></component>
        </div>
        <!-- <div class="selected-studio" v-if='currentTab == ""'>
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
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import PickedProjects from './explorationPageTab/PickedProjects'
import AllProjects from './explorationPageTab/AllProjects'
import Paracraft from './explorationPageTab/Paracraft'
import Website from './explorationPageTab/Website'
import Course from './explorationPageTab/Course'
import Recruiting from './explorationPageTab/Recruiting'
import Users from './explorationPageTab/Users'
import Webpage from './explorationPageTab/Webpage'
import { EsAPI } from '@/api'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ExplorationPage',
  data() {
    return {
      activeTabIndex: 'allProjects',
      currentTab: 'allProjects',
      searchKey: '',
      sortProjects: '',
      currSortMode: this.$t('explore.overall'),
      searchResultAmount: 0,
      currentTabComp: '',
      tabBar: [
        { command: 'pickedProjects', tag: '精选项目' },
        { command: 'allProjects', tag: this.$t('explore.project') },
        { command: 'paracraft', tag: this.$t('explore.3DWorlds') },
        { command: 'website', tag: this.$t('explore.websites') },
        { command: 'course', tag: this.$t('explore.lessons') },
        { command: 'users', tag: this.$t('explore.uses') },
        { command: 'webpage', tag: this.$t('editor.website') },
        { command: 'recruiting', tag: this.$t('explore.recruiting') }
      ]
    }
  },
  created() {
    window.scrollTo(0, 0)
  },
  mounted() {
    this.resetUrl()
    const { query } = this.$route
    this.currentTab = query.tab
    this.activeTabIndex = query.tab
    this.currentTabComp = query.tab
    if (query && query.keyword) {
      this.searchKey = query.keyword
    }
    this.goSearch()
  },
  computed: {
    ...mapGetters({
      allProjects: 'pbl/allProjects',
      paracraft: 'pbl/paracraft',
      website: 'pbl/website'
    }),
    currSortColumn() {
      if (
        this.currentTab === 'pickedProjects' ||
        'allProjects' ||
        'paracraft' ||
        'website' ||
        'course' ||
        'recruiting' ||
        'webpage'
      ) {
        return [
          { mode: this.$t('explore.overall'), command: '/综合' },
          { mode: this.$t('explore.newest'), command: 'updated_at/最新' },
          { mode: this.$t('explore.hottest'), command: 'recent_view/热门' }
        ]
      }
      if (this.currentTab === 'users') {
        return [
          { mode: this.$t('explore.overall'), command: '/综合' },
          {
            mode: this.$t('explore.projectSort'),
            command: 'total_projects/项目'
          },
          { mode: this.$t('explore.popularity'), command: 'total_fans/名气' }
        ]
      }
      return [{ mode: this.$t('explore.overall'), command: '/综合' }]
    }
  },
  methods: {
    resetUrl() {
      if (this.$route.query.searchType && this.$route.query.keyword) {
        let origin = window.location.origin
        history.replaceState('', '', `${origin}/exploration?tab=allProjects`)
      }
    },
    getAmount(amount) {
      this.searchResultAmount = amount
    },
    filterSuggetions(res, cb) {
      if (res.length) {
        cb(_.map(res, i => ({ value: i.keyword })))
      }
    },
    handleSort(selectSort) {
      let sortType = selectSort.command
      this.currSortMode = selectSort.mode
      this.sortProjects = sortType.split('/')[0]
      this.goSearch()
    },
    goSearch() {
      this.$nextTick(async () => {
        this.$refs[this.currentTab].targetPage(1)
      })
    },
    handleSelectTab(key, keyPath) {
      this.$router.push({
        name: 'ExplorationPage',
        query: {
          tab: key
        }
      })
      this.currentTabComp = key
      this.currentTab = key
      this.currSortMode = this.$t('explore.overall')
      this.sortProjects = ''
    }
  },
  components: {
    PickedProjects,
    AllProjects,
    Paracraft,
    Website,
    Course,
    Recruiting,
    Users,
    Webpage
  }
}
</script>

<style lang='scss'>
.exploration-page {
  &-theme {
    background: #fff;
    padding-top: 24px;
    &-center {
      margin: 10px auto 0;
      max-width: 1200px;
      .theme {
        text-align: center;
        margin: 0 auto 32px;
        .explore {
          color: #409eff;
        }
      }
      .search {
        &-tab {
          &-menu {
            border: none;
            &.el-menu.el-menu--horizontal {
              border: none;
              .el-menu-item {
                padding: 0 10px;
              }
            }
          }
        }
        &-input {
          width: 480px;
          height: 40px;
          .el-input__inner {
            height: 40px;
            background: #f5f5f5;
            border: #f5f5f5 1px solid;
          }
          .el-input__inner:hover,
          .el-input__inner:focus {
            border-color: #409efe;
          }
          .el-input__suffix {
            right: 0;
            top: 0;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
            background: #409eff;
            color: #fff;
            display: inline-block;
            width: 88px;
            height: 40px;
            line-height: 40px;
            border-radius: 4px;
            font-size: 16px;
            letter-spacing: 4px;
          }
          &-button {
            font-weight: bold;
            line-height: 32px;
            cursor: pointer;
            white-space: nowrap;
            letter-spacing: normal;
          }
        }
        .search-result {
          text-align: right;
          .contain-total {
            font-size: 14px;
            padding-right: 30px;
            color: #606266;
            &-num {
              color: #409eff;
            }
          }
          .el-dropdown-link {
            display: inline-block;
            height: 60px;
            line-height: 60px;
            font-size: 14px;
            color: #606266;
            cursor: pointer;
          }
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
    margin: 20px 30px;
  }
  .fade-enter-active {
    transition: opacity 2s;
  }
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .all-projects {
    &-pages {
      margin-top: 40px;
      text-align: center;
    }
    &-nothing {
      min-height: 500px;
      text-align: center;
      &-img {
        margin: 128px 0 32px;
      }
      &-tip {
        color: #606266;
        font-size: 14px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .exploration-page {
    &-theme {
      &-center {
        .theme {
          margin: 20px;
        }
        .search {
          &-tab {
            &-menu {
              display: flex;
              justify-content: center;
            }
          }
          &-input {
            width: 100%;
          }
          .search-result {
            text-align: left;
            padding: 0 16px;
            .contain-total {
              display: inline-block;
              height: 60px;
              line-height: 60px;
            }
            .sort-dropdown-menu {
              float: right;
            }
          }
        }
      }
    }
  }
}
</style>
