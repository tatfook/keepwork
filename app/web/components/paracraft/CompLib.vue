<template>
  <div class="comp-lib">
    <el-row type="flex" class="comp-lib-header" align="middle">
      <el-col class="comp-lib-header-left">元件库</el-col>
      <el-col class="comp-lib-header-right">
        <el-input size="small" placeholder="请输入搜索内容..." v-model="seachContent">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <i class="el-icon-close" @click="closeCompsLib"></i>
      </el-col>
    </el-row>
    <el-row type="flex" class="comp-lib-main">
      <el-col class="comp-lib-sidebar">
        <el-tree :data="compsClassList" :props="defaultProps" :indent="12" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col>
        <el-row type="flex" class="comp-lib-content">
          <el-col :span="8" class="comp-lib-item" v-for="(comp, index) in compsList" :key="index">
            <comp-item :compDetail='comp'></comp-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CompItem from './common/CompItem'
import { type } from 'os'
export default {
  name: 'CompLib',
  data() {
    return {
      seachContent: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      compsClassList: [
        {
          label: '建筑',
          children: [
            {
              label: '房子'
            },
            {
              label: '高塔'
            },
            {
              label: '大厦'
            }
          ]
        },
        {
          label: '家居',
          children: [
            {
              label: '桌子'
            },
            {
              label: '椅子'
            }
          ]
        },
        {
          label: '植物',
          children: [
            {
              label: '树'
            },
            {
              label: '草'
            }
          ]
        }
      ]
    }
  },
  computed: {
    compsList() {
      return _.map([1, 2, 3, 4, 5, 6], index => {
        return {
          code: 'E' + (1234 + index),
          type: ['bmax', 'x', 'template', 'stl'][_.random(0, 3)],
          coverSourceUrl: [
            'https://api.keepwork.com/storage/v0/siteFiles/4389/raw#Duck.glb',
            // 'https://api.keepwork.com/storage/v0/siteFiles/4393/raw#Duck.gltf',
            'https://api.keepwork.com/storage/v0/siteFiles/4386/raw#Soldier.glb'
          ][_.random(0, 1)],
          bgColor: [
            '#ff7875',
            '#ff9c6e',
            '#ffc069',
            '#ffd666',
            '#fff566',
            '#d3f261',
            '#95de64',
            '#5cdbd3',
            '#69c0ff',
            '#85a5ff',
            '#b37feb',
            '#ff85c0'
          ][_.random(0, 11)],
          name: '会动的桌子' + index,
          author: '李宇' + index,
          downloadUrl: 'downloadUrl' + index
        }
      })
    }
  },
  methods: {
    closeCompsLib() {
      alert('closeCompsLib')
    },
    handleNodeClick(data) {
      console.log(data)
    }
  },
  components: {
    CompItem
  }
}
</script>
<style lang="scss" scoped>
.comp-lib {
  height: 100vh;
  position: relative;
  &-header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
    height: 60px;
    padding: 0 16px 0 36px;
    font-weight: bold;
    &-right {
      white-space: nowrap;
      width: auto;
    }
    .el-input {
      width: 240px;
    }
    .el-icon-close {
      font-size: 24px;
      vertical-align: middle;
      margin-left: 72px;
      cursor: pointer;
    }
  }
  &-main {
    background-color: #f5f5f5;
    height: 100%;
    padding-top: 60px;
  }
  &-sidebar {
    width: 162px;
    background-color: #fff;
    flex-shrink: 0;
    padding: 16px 12px;
  }
  &-content {
    flex-wrap: wrap;
    padding: 16px 8px;
    overflow: auto;
    max-height: 100%;
  }
  &-item {
    margin-bottom: 16px;
    padding: 0 8px;
  }
}
</style>
