<template v-if='editorMode'>
  <el-menu :mode='menu.mode' :background-color='menu.backgroundColor' :text-color='menu.textColor' :active-text-color='menu.activeTextColor' @click='editProperty'>
    <el-menu-item v-for='menuData in menu.data' :key='menuData.title' :index='menuData.title'>
      {{menuData.title}}
    </el-menu-item>
  </el-menu>
</template>
<template v-else>
  <el-menu :mode='menu.mode' :background-color='menu.backgroundColor' :text-color='menu.textColor' :active-text-color='menu.activeTextColor'>
    <el-menu-item v-for='menuData in menu.data' :key='menuData.title' :index='menuData.title'>
      {{menuData.title}}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: {
    menu: {
      type: Object,
      required: true
    },
    editorMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  }
}
</script>

<style>

</style>
