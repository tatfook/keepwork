<template>
  <div v-if='isHidden'></div>
  <div v-else-if='editorMode' @click.stop.prevent='editProperty' class='comp-menu' :class='{active: isActive}'>
    <el-menu :mode='mode' :background-color='backgroundColor' :text-color='textColor' :active-text-color='activeTextColor'>
      <el-menu-item v-for='menuData in source.data' :key='menuData.title' :index='menuData.title'>
        {{menuData.title}}
      </el-menu-item>
    </el-menu>
  </div>
  <div v-else class='comp-menu'>
    <el-menu :mode='mode' :background-color='backgroundColor' :text-color='textColor' :active-text-color='activeTextColor'>
      <el-menu-item v-for='menuData in source.data' :key='menuData.title' :index='menuData.title'>
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
.comp-menu {
  &.active {
    border: 1px solid rgb(199, 27, 27);
  }
}
</style>
