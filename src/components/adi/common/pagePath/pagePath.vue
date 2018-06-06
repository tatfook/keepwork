<template>
  <div class="comp-pagePath">
    <div class="pathName" :style="nameStyle">
      <a :target='target'>{{properties.name?properties.name:$t('editor.yourPage')}}</a>
    </div>
    <div class="wrapper-right">
      <p :style="labelStyle">{{$t('editor.yourPosition')}}</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in getPathData" :key="index" :style="selectStyle(index)">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
export default {
  name: 'AdiPagePath',
  mixins: [compBaseMixin],
  methods: {
    selectStyle(index) {
      if (index == this.getPathData.length - 1) {
        return this.pageStyle
      } else {
        return this.labelStyle
      }
    }
  },
  computed: {
    target() {
      return this.properties.target
    },
    nameStyle() {
      return this.generateStyleString({
        'font-size': this.options.nameFontSize,
        color: this.options.nameFontColor
      })
    },
    labelStyle() {
      return this.generateStyleString({
        'font-size': this.options.commonSize,
        color: this.options.labelFontColor
      })
    },
    pageStyle() {
      return this.generateStyleString({
        'font-size': this.options.commonSize,
        color: this.options.pageFontColor
      })
    },
    getPathData() {
      let pathData
      if (this.properties.path && this.properties.path.length == 0) {
        pathData = [this.$t('editor.defaultPage'), this.$t('editor.yourPage')]
      } else {
        pathData = this.properties.path.split('>')
      }
      return pathData
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-pagePath {
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  background-color: #f5f5f5;
  border: 1px solid #e4e3e3;
  box-shadow: 0 0 10px #e4e3e3;
  .pathName {
    display: flex;
    align-items: center;
  }
  .wrapper-right {
    display: flex;
    align-items: center;
    color: unset;
    .el-breadcrumb {
      color: unset;
      .el-breadcrumb__item {
        display: flex;
        align-items: center;
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  .comp-pagePath {
    padding: 0 10px;
  }
}
</style>

<style lang="scss">
.comp-pagePath {
  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      font-weight: normal;
      color: unset;
    }
    .el-breadcrumb__inner:hover {
      color: unset;
    }
  }
}
</style>