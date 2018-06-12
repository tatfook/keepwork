<template>
  <div class="comp-breadcrumb">

    <el-breadcrumb :style="getStyle" separator="/">
      <el-breadcrumb-item v-for="(menuData, index) in data" :key="index">
        <a :target="getTarget" :href="menuData.link" @mouseenter="mouseenter" @mouseleave="mouseleave">
          {{isEmptyData ? $t(menuData.name) : menuData.name}}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown>
      <el-button type="primary">
        <span>导航</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(menuData, index) in data" :key="index">
          <a :target="getTarget" :href="menuData.link">
            {{isEmptyData ? $t(menuData.name) : menuData.name}}
          </a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>


<script>
import compBaseMixin from '../comp.base.mixin'
import _ from 'lodash'

export default {
  name: 'AdiBreadCrumb',
  mixins: [compBaseMixin],
  methods: {
    mouseenter(event) {
      let element = event.path[0]

      element.style.color = this.options.color
      element.style.backgroundColor = this.options.backgroundColor
      element.style.borderBottomColor = this.options.borderBottomColor
    },
    mouseleave(event) {
      let element = event.path[0]

      element.style.color = null
      element.style.backgroundColor = null
      element.style.borderBottomColor = null
    }
  },
  computed: {
    data() {
      return this.properties.data
    },
    isEmptyData() {
      return this.properties.data.length != 0 ? false : true
    },
    getTarget() {
      return this.properties.target
        ? this.properties.target
        : this.options.emptyTarget
    },
    getStyle() {
      return this.generateStyleString({
        'font-size': this.options.fontSize,
        color: this.options.fontColor
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-breadcrumb {
  .el-breadcrumb {
    @media only screen and (max-width: 767px) {
      display: none;
    }
    @media only screen and (min-width: 768px) {
      display: block;
    }
    .el-breadcrumb__item {
      height: 64px;
      display: flex;
      align-items: center;
      a {
        height: 60px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        color: unset;
        text-decoration: none;
        text-align: center;
        font-weight: normal;
      }
      a:hover {
        border-bottom-width: 4px;
        border-bottom-style: solid;
      }
    }
  }
  .el-dropdown {
    @media only screen and (max-width: 767px) {
      display: block;
    }
    @media only screen and (min-width: 768px) {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.comp-breadcrumb {
  .el-breadcrumb__inner,
  .el-breadcrumb__separator {
    height: 100%;
    display: flex;
    align-items: center;
    color: unset;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a {
    cursor: pointer;
  }
}
.el-dropdown-menu {
  .el-dropdown-menu__item {
    a {
      color: unset;
      text-decoration: none;
    }
  }
}
</style>
