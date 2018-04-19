<template>
  <div class='viewport-container'>
    <div class="add-btn-row" @click='openModSelector' v-show='modList.length <= 0'>
      <el-button class='add-mod-btn' type='primary' circle icon='el-icon-plus'></el-button>
      <p class="info">请点击添加内容</p>
    </div>
    <draggable v-model='modDraggableList' @change="changeDraggableList">
      <template v-for='mod in modList'>
        <editor-mod-selector :key='mod.key' :mod='mod' :theme='theme' @onAddMod='openModSelector'></editor-mod-selector>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import EditorModSelector from './EditorModSelector'
import themeFactory from '@/lib/theme/theme.factory'
import mods from '@/components/adi/mod'

export default {
  name: 'EditorViewportPartial',
  data() {
    return {
      mods
    }
  },
  components: {
    EditorModSelector,
    draggable
  },
  computed: {
    ...mapGetters({
      modList: 'modList',
      themeConf: 'themeConf'
    }),
    theme() {
      let newTheme = themeFactory.generate(this.themeConf)
      if (this.storedTheme === newTheme) return this.storedTheme
      if (this.storedTheme) this.storedTheme.sheet.detach()
      this.storedTheme = newTheme
      this.storedTheme.sheet.attach()
      return this.storedTheme
    },
    modDraggableList: {
      get() {
        return this.modList
      },
      set(value) {
        // do nothing
      }
    }
  },
  methods: {
    openModSelector(key) {
      this.$store.dispatch('setActiveWinType', 'ModsList')
    },
    changeDraggableList(evt) {
      if (evt.moved) {
        this.$store.dispatch('moveMod', {
          oldIndex: evt.moved.oldIndex,
          newIndex: evt.moved.newIndex
        })
      }
    }
  }
}
</script>
<style scoped>
.viewport-container {
  flex: 1;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px 0;
}
.add-btn-row {
  text-align: center;
  padding-top: 43px;
  cursor: pointer;
}
.add-mod-btn {
  width: 66px;
  height: 66px;
  background-color: #3ba4ff;
  color: #fff;
  padding: 0;
  font-size: 40px;
}
.info {
  font-size: 25px;
  color: #c0c4cc;
  margin-top: 13px;
}
</style>
