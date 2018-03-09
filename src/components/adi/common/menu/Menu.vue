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
  }
}
</script>

<style lang="scss" scoped>
.test {
  width: 100px;
  height: 100px;
}

.el-menu {
}

.el-menu--horizontal {
  border-right: 10px;
}
</style>
