<template>
  <div class='comp-menu'>
    <el-menu :mode='mode' :background-color='backgroundColor' :text-color='textColor' :active-text-color='activeTextColor'>
      <el-menu-item v-for='menuData in source.data' :key='menuData.title' :index='menuData.title'>
        {{menuData.title}}
      </el-menu-item>
    </el-menu>
    <div class="test" :class='options.bgColor1'>{{ source.title }}</div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiMenu',
  mixins: [compBaseMixin],
  computed: {
    mode() {
      return this.source.mode
    },
    backgroundColor() {
      return this.source.backgroundColor
    },
    textColor() {
      return this.source.textColor
    },
    activeTextColor() {
      return this.source.activeTextColor
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
