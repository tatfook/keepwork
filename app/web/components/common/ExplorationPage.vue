<template>
  <div class="exploration-page">
    <div class="exploration-page-theme">
      <div class="exploration-page-theme-center">
        <div class="theme">
          <!-- <span class="explore">探索</span>·未知之境 -->
          <el-input :placeholder="$t('explore.searchFor')" class="search-input" v-model="searchKey" @keyup.enter.native="goSearch">
            <i slot="suffix" class="el-icon-search search-input-button" @click="goSearch"> {{$t("explore.search")}}</i>
            <!-- <el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button> -->
          </el-input>
        </div>
        <div class="search">
          <el-row>
            <el-col :sm="16" :xs="24">
              <!-- <el-autocomplete class="search-input" :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="handleSelect" v-model="searchKey" placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
              </el-autocomplete> -->
              <!-- <el-input placeholder="请输入你要搜索的内容" class="search-input" v-model="searchKey" @keyup.enter.native="goSearch">
                <i slot="suffix" class="el-icon-search search-input-button" @click="goSearch"></i> -->
              <!-- <el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button> -->
              <!-- </el-input> -->
              <div class="search-tab">
                <el-menu :default-active="activeTabIndex" class="search-tab-menu" mode="horizontal" @select="handleSelectTab">
                  <el-menu-item index="1">{{$t("explore.project")}}</el-menu-item>
                  <el-menu-item index="2">{{$t("explore.3DWorlds")}}</el-menu-item>
                  <el-menu-item index="3">{{$t("explore.websites")}}</el-menu-item>
                  <!-- <el-menu-item index="4">知识</el-menu-item> -->
                  <el-menu-item index="5">{{$t("explore.lessons")}}</el-menu-item>
                  <el-menu-item index="6">{{$t("explore.uses")}}</el-menu-item>
                  <!-- <el-menu-item index="7">工作室</el-menu-item> -->
                  <el-menu-item index="8">{{$t("explore.recruiting")}}</el-menu-item>
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
        <div class="selected-projects" v-if='currIndex == 1'>
          <all-projects ref="allProjects" :searchKey="searchKey" :sortProjects="sortProjects" @getAmount="getAmount"></all-projects>
        </div>
        <div class="selected-projects" v-if='currIndex == 2'>
          <paracraft ref="paracraft" :searchKey="searchKey" :sortProjects="sortProjects" @getAmount="getAmount"></paracraft>
        </div>
        <div class="selected-projects" v-if='currIndex == 3'>
          <website ref="website" :searchKey="searchKey" :sortProjects="sortProjects" @getAmount="getAmount"></website>
        </div>
        <div class="selected-knowledge" v-if='currIndex == 4'>程序员小哥哥小姐姐们拼命开发中。。。。</div>
        <div class="selected-lessons" v-if='currIndex == 5'>
          <course ref="course" :searchKey="searchKey" :sortProjects="sortProjects" @getAmount="getAmount"></course>
        </div>
        <div class="selected-user" v-if='currIndex == 6'>
          <users ref="users" :searchKey="searchKey" :sortUsers="sortProjects" @getAmount="getAmount"></users>
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
          <recruiting ref="recruiting" :searchKey="searchKey" :sortProjects="sortProjects" @getAmount="getAmount"></recruiting>
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
import { EsAPI } from '@/api'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ExplorationPage',
  data() {
    return {
      activeTabIndex: '1',
      currIndex: 1,
      searchKey: '',
      sortProjects: 'recent_view',
      // currSortMode: this.$t("explore.overall"),
      currSortMode: this.$t("explore.hottest"),
      searchResultAmount: 0
    }
  },
  created() {
    window.scrollTo(0, 0)
  },
  mounted() {
    const { query } = this.$route
    if (query && query.keyword) {
      this.searchKey = query.keyword
      this.goSearch()
    }
    history.replaceState('', '', this.$route.path)
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
            // { mode: this.$t("explore.overall"), command: '/综合' },
            { mode: this.$t("explore.newest"), command: 'updated_time/最新' },
            { mode: this.$t("explore.hottest"), command: 'recent_view/热门' }
          ]
        case 6:
          return [
            // { mode: this.$t("explore.overall"), command: '/综合' },
            { mode: this.$t("explore.projectSort"), command: 'total_projects/项目' },
            { mode: this.$t("explore.popularity"), command: 'total_fans/名气' }
          ]
        default:
          // return [{ mode: this.$t("explore.overall"), command: '/综合' }]
          return [{ mode: this.$t("explore.hottest"), command: 'recent_view/热门' }]
      }
    }
  },
  methods: {
    handleSelectTab(key, keyPath) {
      this.selectTab(Number(key))
    },
    getAmount(amount) {
      this.searchResultAmount = amount
    },
    filterSuggetions(res, cb) {
      if (res.length) {
        cb(_.map(res, i => ({ value: i.keyword })))
      }
    },
    async querySearch(queryString, cb) {
      // FIXME: 还缺个热门和最近
      let suggestions = await EsAPI.suggestions.getPrefixSuggestions({
        prefix: queryString
      })
      return this.filterSuggetions(suggestions, cb)
    },
    handleSelect(item) {
      this.searchKey = item.value
      this.goSearch()
    },
    handleSort(selectSort) {
      let sortType = selectSort.command
      this.currSortMode = selectSort.mode
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
      if(index == 6){
        this.currSortMode = this.$t("explore.popularity")
        this.sortProjects = 'total_fans'
      }else{
        // this.currSortMode = this.$t("explore.overall")
        this.currSortMode = this.$t("explore.hottest")
        this.sortProjects = 'recent_view'
      }
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
      margin: 10px auto 0;
      max-width: 1200px;
      .theme {
        text-align: center;
        margin: 24px auto 32px;
        .explore {
          color: #409eff;
        }
      }
      .search {
        &-tab {
          &-menu {
            border: none;
            &.el-menu.el-menu--horizontal{
              border: none;
              .el-menu-item{
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
  }
}
.search-result-total {
  margin: 20px 30px;
}
.all-projects {
  &-pages {
    margin-top: 40px;
    text-align: center;
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
            .sort-dropdown-menu{
              float: right;
            }
          }
        }
      }
    }
  }
}
</style>

