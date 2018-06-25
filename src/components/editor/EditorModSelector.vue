<template>
<div :class="{'mod-wrap':true,'mod-active': isActive, }">
  <div :class="['kp-mod-selector',mod.cmd === 'Markdown' ? 'no-mask' : '']" @click='setActive'>
    <div class="delete-mod" @click.stop.prevent='toDeleteMod'>
      <i class="iconfont icon-delete icon-del"></i>
    </div>
    <div class='mod'>
      <component :is='modComponent' :mod='mod' :conf='modConf' :theme='theme' :editMode='true' :active='isActive'></component>
      <span v-if='invalid'> 错误的Mod指令 </span>
    </div>
    <div class='operator' v-if='isActive'>
      <el-button class="add-mod-btn add-before" @click.stop.prevent='newMod(gConst.POSITION_BEFORE)'> + </el-button>
      <el-button class="add-mod-btn add-after" @click.stop.prevent='newMod(gConst.POSITION_AFTER)'> + </el-button>
    </div>
  </div>
</div>
</template>

<script>
import ModLoader from '@/components/adi/mod'
import VueScrollTo from 'vue-scrollto'
import { mapGetters, mapActions } from 'vuex'
import { gConst } from '@/lib/global'

export default {
  props: {
    mod: Object,
    theme: Object
  },
  data() {
    return {
      gConst
    }
  },
  watch: {
    isActive(newVal) {
      if (newVal) this.scrollToCurrentMod()
    }
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod',
      modList: 'modList'
    }),
    modComponent() {
      if (this.modConf) return this.modConf.mod
    },
    modConf() {
      return ModLoader.load(this.mod.modType)
    },
    isActive() {
      return this.activeMod && this.mod.key === this.activeMod.key
    },
    invalid() {
      return !this.modConf
    }
  },
  methods: {
    ...mapActions({
      deleteMod: 'deleteMod',
      setPreMod: 'setPreMod',
      setNewModPosition: 'setNewModPosition',
    }),
    newMod(position) {
      this.$store.dispatch('setNewModPosition', position)
      this.$emit('onAddMod', this.mod.key)
    },
    setActive() {
      this.$store.dispatch('setActiveMod', this.mod.key)
    },
    scrollToCurrentMod() {
      const options = {
        easing: 'ease-in',
        offset: -30,
        x: false,
        y: true
      }
      VueScrollTo.scrollTo(this.$el, 500, options)
    },
    getPreMod() {
      let modList = this.modList
      let index = modList.findIndex(i => i.key === this.mod.key)
      return index ? modList[index - 1] : modList[index || 0]
    },
    toDeleteMod() {
      this.$confirm(
        this.$t('editor.modDelMsg'),
        this.$t('editor.modDelMsgTitle'),
        {
          confirmButtonText: this.$t('el.messagebox.confirm'),
          cancelButtonText: this.$t('el.messagebox.cancel'),
          type: 'error'
        }
      )
        .then(() => {
          let preMod = this.getPreMod()
          if (preMod) {
            this.setPreMod(preMod)
            this.setNewModPosition(gConst.POSITION_AFTER)
          }
          this.deleteMod(this.mod.key)
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.add-mod-btn {
  width: 38px;
  height: 38px;
  background-color: #7fc3ff;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  padding: 0;
  font-size: 30px;
  border: none;
  position: absolute;
  left: 50%;
  margin-left: -19px;
  z-index: 99;
}
.add-before {
  top: -19px;
}
.add-after {
  bottom: -19px;
}
.add-mod-btn:hover {
  background-color: #f7a935;
  color: #fff;
  font-size: 38px;
  transition: all 0.2s;
}
</style>

<style lang="scss">
.mod-wrap{
  border: 2px solid transparent;
  &:hover{
    border:2px dashed #3ab4ff;
  }
}
.mod-active {
  border:2px dashed #f7a935;  
  position: relative;
  .add-mod-btn{
    background-color: #f7a935;
  }
  &:hover{
    border:2px dashed #f7a935;      
  }
}
.kp-mod-selector .comp {
  position: relative;
}
.kp-mod-selector {
  position: relative;
  .delete-mod {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background-color: #f56c6c;
    color: #ffffff;
    border-radius: 50%;
    z-index: 99;
    display: none;
    cursor: pointer;
  }
  &:hover {
    .delete-mod {
      display: inline;
    }
  }
}
.kp-mod-selector .comp:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  background-color: rgba(127, 195, 255, 0.4);
  cursor: pointer;
}
.kp-mod-selector.no-mask .comp:hover::before {
  background-color: transparent;
  cursor: pointer;
}
</style>

