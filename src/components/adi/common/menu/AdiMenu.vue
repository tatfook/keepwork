<template>
  <div v-if='editorMode' @click.stop.prevent='editProperty' :class='{active: isActive}'>
    <el-menu :mode='menu.mode' :background-color='menu.backgroundColor' :text-color='menu.textColor' :active-text-color='menu.activeTextColor'>
      <el-menu-item v-for='menuData in menu.data' :key='menuData.title' :index='menuData.title'>
        {{menuData.title}}
      </el-menu-item>
    </el-menu>
  </div>
  <div v-else>
    <el-menu :mode='menu.mode' :background-color='menu.backgroundColor' :text-color='menu.textColor' :active-text-color='menu.activeTextColor'>
      <el-menu-item v-for='menuData in menu.data' :key='menuData.title' :index='menuData.title'>
        {{menuData.title}}
      </el-menu-item>
    </el-menu>
  </div>
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
    },
    sign: String,
    isActive: Boolean
  },
  data() {
    return {}
  },
  methods: {
    editProperty() {
      this.$emit('editProperty', this.sign)
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  border: 1px solid rgb(199, 27, 27);
}
</style>
