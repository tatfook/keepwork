<template>
  <div class="comp category-list-comp">
    <div class="style-0" v-if="getStyleId === 0" v-loading="loading">
      <div class="item" v-for="(item, index) in pageData" :key="index">
        <el-row class="item-container" :gutter="5">
          <el-col :span="6" :xs="24">
            <img class="cover" :src="item.cover">
          </el-col>
          <el-col :span="18" :xs="24">
            <div class="desc">
              <div class="title">
                <a :href="item.url" target="_blank">
                  {{item.title}}
                </a>
              </div>
              <div class="summary">
                {{item.summary}}
              </div>
              <div class="date">{{item.date}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="style-1" v-if="getStyleId === 1">
      <div class="item" v-for="(item, index) in pageData" :key="index">
        <img class="cover" :src="item.cover">
        <div class="desc">
          <div class="title">{{item.title}}</div>
          <div class="summary">{{item.summary}}</div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { search } from '@/api/esGateway'
import _ from 'lodash'
import compBaseMixin from '../comp.base.mixin'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AdiCategoryList',
  data() {
    return {
      total: 0,
      currentPage: 1,
      allData: [],
      pageData: [],
      loading: true
    }
  },
  mixins: [compBaseMixin],
  created() {
    this.getSource()
  },
  methods: {
    ...mapActions({
      getRepositoryTree: 'gitlab/getRepositoryTree'
    }),
    ...mapGetters({
      gitlabChildrenByPath: 'gitlab/childrenByPath'
    }),
    async getSource() {
      if (!this.properties.path) {
        return
      }

      this.loading = true

      let url = this.activePageInfo.sitepath + this.properties.path

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
                  url: {
                    query: '.gitignore'
                  }
                }
              },
              {
                match: {
                  source_url: {
                    query: this.properties.path + '.md'
                  }
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
        from:
          this.currentPage == 1
            ? 0
            : this.currentPage * this.pageSize - this.pageSize,
        size: this.pageSize
      }

      let source = await search({ index, type, body })

      this.formatData(source)
      this.loading = false
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
    },
    formatData(source) {
      this.pageData = []
      this.total = (source && source.hits && source.hits.total) || 0

      let allData = source && source.hits && source.hits.hits

      _.forEach(allData, (item, index) => {
        let currentData = item._source

        let newItem = {
          title: '',
          summary: '',
          date: '',
          cover: this.properties.emptyCover || '',
          url: '#'
        }

        let pageArray = currentData['pagename'].split('/')

        newItem['title'] = pageArray[pageArray.length - 1]

        let content = currentData['content'].split('\n')

        _.forEach(content, (item, key) => {
          if (this.properties.summarySign && item.match(this.properties.summarySign)) {
            newItem['summary'] = item
          }

          if (item.match(/!\[cover\]/)) {
            newItem['cover'] = item.replace(/(!\[cover\]\(|\))/gi, '')
          }
        })

        newItem['date'] = currentData['update_time']
        newItem['url'] = currentData['url']

        this.pageData.push(newItem)
      })
    }
  },
  watch: {
    currentPage() {
      this.getSource()
    }
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo',
      getGitlabAPI: 'gitlab/getGitlabAPI',
      getProjectIdByPath: 'gitlab/getProjectIdByPath',
      repositoryTreesAllFiles: 'gitlab/repositoryTreesAllFiles'
    }),
    getStyleId() {
      return this.options.styleId || 0
    },
    pageSize() {
      return this.properties.pageSize || 5
    }
  }
}
</script>

<style lang="scss" scoped>
.category-list-comp {
  width: 100%;
  box-shadow: 0px 1px 25px #00000036;
  padding: 30px 0;
  margin: 0 auto;

  .style-0 {
    .item {
      height: auto;
      padding: 0 2.5%;
      margin: 0 auto;

      .item-container {
        border-bottom: rgb(29, 14, 14) 1px dashed;

        & > div {
          padding-top: 10px;
          padding-bottom: 10px;
        }
      }

      .cover {
        width: 100%;
        display: block;
        background-repeat: no-repeat;
        background-size: 100%;

        @media only screen and (min-width: 768px) {
          max-width: 240px;
        }
      }

      .desc {
        height: 135px;
        padding: 1px;

        .title {
          height: 23px;
          overflow: hidden;

          a {
            text-decoration: none;
            color: unset;
          }
        }

        .summary {
          font-size: 12px;
          height: 104px;
          overflow: hidden;
        }

        .date {
          font-size: 10px;
          text-align: right;
          height: 17px;
          overflow: hidden;
        }
      }

      @media (max-width: 1000px) {
        .category-page {
          .styleOne {
            .category-page-list {
              .category-page-list-right {
                width: 60%;
                height: 135px;
                float: right;
                padding: 1px;
              }
            }
          }
        }
      }

      @media (max-width: 760px) {
        .category-page {
          width: 94%;
          height: auto;
          border: #bbbaba 1px solid;
          padding: 30px 2.5%;

          .styleOne {
            .category-page-list {
              width: 90%;
              padding: 2.5%;
              height: auto;
              margin: 0 auto;
              border-bottom: #000 1px dashed;
              .category-page-list-left {
                width: 100%;
                height: 100%;
                margin: 0 auto;
                float: none;
              }
              .category-page-list-right {
                width: 100%;
                height: auto;
                float: none;
                padding: 1px;
                div {
                  width: 100%;
                }
                .category-page-list-right-font-size-one {
                  width: 100%;
                  height: auto;
                  overflow: visible;
                  text-align: center;
                }
                .category-page-list-right-font-size-two {
                  width: 100%;
                  font-size: 10px;
                  height: auto;
                  overflow: visible;
                  text-align: left;
                }
                .category-page-list-right-font-size-three {
                  width: 100%;
                  font-size: 10px;
                  height: auto;
                  text-align: center;
                  overflow: visible;
                }
              }
            }
          }
        }
      }
    }
  }

  .style-1 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 30px;

    &::after {
      content: '';
      width: 300px;
    }

    .item {
      padding: 10px 0;

      @media only screen and (max-width: 768px) {
        width: 100%;
      }

      .cover {
        display: block;
        width: 300px;

        @media only screen and (max-width: 768px) {
          width: 100%;
        }
      }

      .desc {
        margin-top: 10px;

        .title {
          text-align: center;
        }

        .summary {
          text-align: center;
        }
      }
    }
  }

  .pagination {
    margin-top: 35px;
    text-align: center;
  }
}
</style>
