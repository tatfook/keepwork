<template>
  <div class="comp comp-tab">
    <el-row>
      <el-col :span="16" :xs="24" class="tab-page">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in tabList" :key="index">
            <div class="tab-notice">
              <a href="#">
                {{ item.notice }}
              </a>
            </div>
            <div class="tab-article-title">
              <div v-for="(itemA, indexA) in item.list" :key="indexA">
                <a :href="itemA.link" target="_blank">
                  <div>[{{item.label}}]</div>
                  <div>{{ itemA.title }}</div>
                  <div class="tab-news-release-time">{{ itemA.date }}</div>
                </a>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="8" :xs="24" class="tab-image">
        <div :style="getStyle"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters, mapActions } from 'vuex'
import { search } from '@/api/esGateway'

export default {
  name: 'AdiTab',
  mixins: [compBaseMixin],
  data() {
    return {
      tabList: [],
      allFiles: []
    }
  },
  methods: {
    ...mapActions({
      getRepositoryTree: 'gitlab/getRepositoryTree'
    }),
    handleClick(tabsComponent) {
      return
    },
    formatData(source, path) {
      let pageData = []
      let allData = source && source.hits && source.hits.hits || []

      _.forEach(allData, (item, index) => {
        let currentItem = item._source
        let currentData = {
          title: currentItem['pagename'].replace(path.substr(1) + '/', ''),
          link: currentItem['url'],
          date: currentItem['update_time']
        }

        pageData.push(currentData)
      })

      return pageData
    },
    async getSource(path) {
      let url = this.activePageInfo.sitepath + path

      let index = process.env.ES_INDEX
      let type = process.env.ES_TYPE
      let body = {
        query: {
          bool: {
            must: {
              match: {
                url: {
                  query: url,
                  operator: 'and'
                }
              }
            },
            must_not: [
              {
                match: {
                  url: '.gitignore'
                }
              }
            ]
          }
        },
        sort: {
          update_time: {
            order: 'desc'
          }
        },
        size: 5
      }

      let source = await search({index, type, body})

      return this.formatData(source, path)
    }
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo',
      repositoryTreesAllFiles: 'gitlab/repositoryTreesAllFiles'
    }),
    getStyle() {
      if (this.properties.src) {
        return this.generateStyleString({
          'background-image': 'url(' + this.properties.src + ')'
        })
      } else {
        return this.generateStyleString(this.options.style)
      }
    },
    activeName: {
      get() {
        return this.properties.defaultTabName || ''
      },
      set() {}
    }
  },
  async created() {
    let source = []
    if(this.properties.source && Array.isArray(this.properties.source)) {
      source = this.properties.source
    }

    _.forEach(source, async (element, key) => {
      let curEle = {
        label: element.label || '',
        name: element.name || '',
        notice: element.notice || '',
        list: []
      }

      this.tabList.push(curEle)

      let curFiles = await this.getSource(element.path)
      curEle['list'] = curFiles
    })
  }
}
</script>

<style lang="scss">
.comp-tab {
  .el-tabs__active-bar {
    background-color: red;
  }

  .el-tabs__item:hover {
    color: red;
  }

  .el-tabs__item.is-active {
    color: red;
  }
}
</style>


<style lang="scss" scoped>
.comp-tab {
  padding: 20px;
  max-width: 700px;
  margin: 0 auto;
  border: #bbbaba 1px solid;
  border-radius: 5px;

  .tab-page {
    height: 300px;

    a {
      text-decoration: none;
    }

    /* 中间公告 */
    .tab-notice {
      height: 40px;
      padding-top: 10px;
      padding-bottom: 10px;
      a {
        color: red;
        font-weight: bold;
      }
    }

    /* 下方标题以及内容 */
    .tab-article-title {
      & > div {
        display: block;
        height: 20px;
        margin-bottom: 15px;

        a {
          color: black;
          font-size: 14px;

          div {
            display: inline-block;
            float: left;
          }

          .tab-news-release-time {
            float: right;
            background-color: #6f6f6f;
            color: #fff;
            padding: 0 5px;
          }
        }
      }
    }
  }

  .tab-image {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 300px;

    & > div {
      width: 172px;
      height: 262.5px;
      background-size: 100%;
      background-repeat: no-repeat;
    }
  }
}
</style>

