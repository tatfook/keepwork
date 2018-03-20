<template>
  <el-row type='flex' class="full-height">
    <el-col class="mods-treeview">
      <el-tree :data='modsMenu' :props='defaultProps' highlight-current accordion :indent=0 @node-click='modeMenuClick'></el-tree>
    </el-col>
    <el-col class="preview-box">
      <img class="style-cover" src="http://keepwork.com/wiki/js/mod/adi/assets/images/projectOne.png" alt="">
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ModsList',
  data() {
    return {
      modsMenu: [
        {
          label: '全部'
        },
        {
          label: '常用'
        },
        {
          label: '混合搭配',
          children: [
            {
              label: '图文拼接'
            },
            {
              label: 'paracraft作品'
            },
            {
              label: '图文拼接'
            }
          ]
        },
        {
          label: '图文拼接'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    modeMenuClick(data) {
      console.log(data)
    }
  }
}
</script>
<style scoped>
.full-height {
  height: 100%;
}
.style-cover {
  max-width: 100%;
}
.mods-treeview{
  border-right: 2px solid #c0c4cc;
  width: auto;
  max-width: 40%;
}
.preview-box{
  padding: 0 5px;
  background-color: #e4e7ed;
}
</style>
<style>
.el-tree-node__content{
  padding-right: 15px;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background-color: #e6f7ff;
  color: #1890ff;
  position: relative;
}
.el-tree-node__content{
  height: 40px;
  line-height: 40px;
}
.el-tree-node__label{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
