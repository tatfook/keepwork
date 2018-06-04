<template>
  <div class="comp-pagePath">
    <div class="pathName" :style="nameStyle">
      <a :target='target'>{{properties.name}}</a>
    </div>
    <div class="wrapper-right">
      <p :style="labelStyle">您所在的位置：</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }" :style="labelStyle">首页</el-breadcrumb-item>
        <el-breadcrumb-item :style="pageStyle">{{properties.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
export default {
  name: 'AdiPagePath',
  mixins: [compBaseMixin],
  methods: {},
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
  .comp-breadCrumbPage {
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