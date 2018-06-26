<template>
  <el-row class="pagePath comp">
    <el-col :xs="24" :sm="6" :class="getPageNameClass.pageNameClass">
      <span>{{properties.name?properties.name:$t('editor.pageName')}}</span>
    </el-col>

    <el-col :xs="24" :sm="18" class="pagePath__path-info">
      <div class="pagePath__path-info__position" :class="getPageNameClass.labelNameClass">
        <span>{{$t('editor.yourPosition')}}</span>
      </div>
      <div class="pagePath__path-info__squeue">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in pageData" :key="index" :class="selectStyle(index)">
            <a :href="item.link" :target='target' @mouseenter="mouseenter" @mouseleave="mouseleave">{{item.title}}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'
import preset from 'jss-preset-default'
import { search } from '@/api/esGateway'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'AdiPagePath',
  mixins: [compBaseMixin],
  data() {
    return {
      pageData: []
    }
  },
  created() {
    this.getSource()
  },
  methods: {
    selectStyle(index) {
      if (index == this.pageData.length - 1) {
        return this.getPageNameClass.pathNameClass
      } else {
        return this.getPageNameClass.labelNameClass
      }
    },
    mouseenter(event) {
      let element = event.path[0]
      element.style.color = this.options.pageFontColor
    },
    mouseleave(event) {
      let element = event.path[0]
      element.style.color = null
    },
    formatData(source) {
      this.pageData = []
      let allData = (source && source.hits && source.hits.hits) || []

      _.forEach(allData, (item, index) => {
        let currentData = {
          lastName: ''
        }

        let array = item._source['pagename'].split('/')
        currentData.lastName = array[array.length - 1]

        if (currentData.lastName == this.activePageInfo.pagename) {
          _.forEach(array, (each, key) => {
            let eachName = {
              title: each,
              link: item._source['url']
            }
            this.pageData.push(eachName)
          })

          let pageData0 = {
            title: this.$t('editor.homePage'),
            link: ''
          }
          this.pageData.unshift(pageData0)

          for (let i = this.pageData.length - 1; i >= 1; i--) {
            this.pageData[i - 1].link = this.pageData[i].link.replace(
              '/' + this.pageData[i].title,
              ''
            )
          }

          for (let j = this.pageData.length - 2; j >= 1; j--) {
            this.pageData[j].link = this.pageData[j].link + 'Index'
          }
          this.pageData[0].link = this.pageData[0].link + '/index'
          this.pageData[this.pageData.length - 1].link = 'javascript:void(0)'
        }
      })

      return this.pageData
    },
    async getSource() {
      let url = this.activePageInfo.sitepath
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
        }
      }
      let source = await search({ index, type, body })
      this.formatData(source)
    }
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo'
    }),
    target() {
      return this.properties.target
    },
    getPageNameClass() {
      let pageName = 'pagePath__page-name'
      let labelName = 'pagePath__path-info__position'
      let pathName = 'breadcrumb-item'

      let style = {
        [pageName]: {
          'font-size': this.options.nameFontSize,
          color: this.options.nameFontColor
        },
        [labelName]: {
          'font-size': this.options.commonSize,
          color: this.options.labelFontColor
        },
        [pathName]: {
          'font-size': this.options.commonSize,
          color: this.options.pageFontColor
        },
        '@media only screen and (max-width: 767px)': {
          [pageName]: {
            'font-size': this.options.nameMobileSize
          },
          [labelName]: {
            'font-size': this.options.commonMobileSize
          },
          [pathName]: {
            'font-size': this.options.commonMobileSize
          }
        }
      }
      if (!this.sheet) {
        this.sheet = jss.createStyleSheet(style)
        this.sheet.attach()
      }
      return {
        pageNameClass: this.sheet.classes[pageName],
        labelNameClass: this.sheet.classes[labelName],
        pathNameClass: this.sheet.classes[pathName]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagePath {
  display: flex;
  align-items: center;
  padding: 20px 40px;
  background-color: #f5f5f5;
  border: 1px solid #e4e3e3;
  box-shadow: 0 0 10px #e4e3e3;

  .pagePath__path-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    white-space: nowrap;

    .pagePath__path-info__position {
      width: 126px;
      line-height: 1;
    }

    .pagePath__path-info__squeue {
      overflow-x: hidden;

      .el-breadcrumb {
        overflow-x: auto;
        overflow-y: hidden;
        display: flex;
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  .pagePath {
    display: block;
    padding: 10px;

    .pagePath__path-info {
      justify-content: flex-start;
      margin-top: 5px;

      .pagePath__path-info__position {
        width: 84px;
      }
      .pagePath__path-info__squeue {
        .el-breadcrumb {
          max-width: 604px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.pagePath {
  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: unset;
      a {
        color: unset;
        font-weight: normal;
        text-decoration: none;
      }
    }
    .el-breadcrumb__separator {
      color: unset;
    }
  }

  .el-breadcrumb__item:last-child {
    .el-breadcrumb__inner {
      color: unset;
      a {
        color: unset;
      }
    }
  }
}
</style>