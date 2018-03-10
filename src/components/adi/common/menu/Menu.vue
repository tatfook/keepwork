<template>
  <div class='comp-menu'>
    <el-menu :mode='mode'>
      <el-menu-item v-for='menuData in data' :key='menuData.title' :index='menuData.title'>
        {{menuData.title}}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiMenu',
  mixins: [compBaseMixin],
  computed: {
    mode() {
      return this.options.mode
    },
    data() {
      return JSON.parse(this.source.data)
    }
  },
  created: function() {
    console.log(this.mod)
  }
}
</script>

<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item {
}

.el-menu {
}

.el-menu--horizontal {
  border-right: 10px;
}
</style>
