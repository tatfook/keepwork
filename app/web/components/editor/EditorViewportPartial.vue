<template>
  <div class='viewport-partial' :class='activeClass'>
    <div class='mask' v-if='unActive' @click='setActiveArea' :title="$t('editor.edit')">
    </div>
    <div class="add-btn-row" @click='openModSelector' v-show='modList.length <= 0'>
      <el-button class='add-mod-btn' type='primary' circle icon='el-icon-plus'></el-button>
      <p class="info">{{$t('editor.addMod')}}</p>
    </div>
    <draggable v-model='modDraggableList' @change="changeDraggableList">
      <template v-for='mod in modList'>
        <editor-mod-selector :key='mod.uuid' :mod='mod' :theme='theme' @onAddMod='openModSelector'></editor-mod-selector>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import EditorModSelector from './EditorModSelector'
import themeFactory from '@/lib/theme/theme.factory'

export default {
  name: 'EditorViewportPartial',
  props: {
    theme: Object,
    modList: Array,
    isActive: Boolean,
    area: String
  },
  components: {
    EditorModSelector,
    draggable
  },
  computed: {
    ...mapGetters({
      activeArea: 'activeArea'
    }),
    modDraggableList: {
      get() {
        return this.modList
      },
      set(value) {
        // do nothing
      }
    },
    unActive() {
      return this.activeArea !== this.area
    },
    activeClass() {
      if (this.activeArea === this.area) return 'active'
    }
  },
  methods: {
    openModSelector(key) {
      this.$store.dispatch('setActiveManagePaneComponent', 'ModsList')
    },
    changeDraggableList(evt) {
      if (evt.moved) {
        this.$store.dispatch('moveMod', {
          oldIndex: evt.moved.oldIndex,
          newIndex: evt.moved.newIndex
        })
      }
    },
    setActiveArea() {
      this.$store.dispatch('setActiveArea', this.area)
    }
  }
}
</script>

<style lang="scss"  scoped>
.viewport-partial {
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  &.active {
    padding: 20px 0;
  }
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
.mask {
  z-index: 99999;
  cursor: pointer;
  background-color: rgba(0, 0, 0, .2);
  -moz-opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  &:hover {
    background-color: rgba(0, 0, 0, .35);
  }
}
</style>
