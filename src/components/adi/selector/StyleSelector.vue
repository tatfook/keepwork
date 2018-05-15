<template>
  <div>
    <div v-if='modConf.name == "ModMarkdown" || !style.useImage' v-for='(style, index) in modConf.styles' :key='style.name' class="style-item render" :class='{active: isActive(index)}' @click='changeStyle(index)'>
      <div class="render-mod-container--click-prevent"></div>
      <div class="render-mod-container" :style="generateStyleString(style.preview && style.preview.outter || [], true)">
        <div :style="generateStyleString(style.preview && style.preview.inner ||[])">
          <component class="render-mod" :is='modConf.mod' :mod='currentMod(index)' :conf='modConf' :theme='theme'></component>
        </div>
      </div>
    </div>
    <img v-if='style.useImage && modConf.name != "ModMarkdown"' class="style-item" :class='{active: isActive(index)}' v-for='(style, index) in modConf.styles' :key='style.name' @click='changeStyle(index)' :src="style.cover" :alt="index">
  </div>
</template>

<script>
import themeFactory from '@/lib/theme/theme.factory'
import modLoader from '@/components/adi/mod'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    mod: Object
  },
  computed: {
    ...mapGetters({
      themeConf: 'themeConf'
    }),
    modConf() {
      return modLoader.load(this.mod.modType)
    },
    theme() {
      let globalTheme = themeFactory.generate(this.themeConf)
      globalTheme.sheet.attach()

      return globalTheme
    }
    // styles() {
    //   return mods[this.mod.modType].styles
    // }
  },
  methods: {
    ...mapActions({
      updateActiveModStyle: 'updateActiveModStyle'
    }),
    generateStyleString(style, isOutter) {
      let string = ''

      if (style) {
        _.forEach(style, (value, key) => {
          if (isOutter) {
            string = string + key + ':' + (parseInt(value) + 20) + 'px;'
          } else {
            string = string + key + ':' + value + ';'
          }
        })
      }

      return string
    },
    changeStyle(styleID) {
      this.updateActiveModStyle(styleID)
    },
    isActive(styleID) {
      let curStyle = Number(this.mod.data.styleID) || 0
      return curStyle === styleID
    },
    currentMod(index) {
      let currentMod = _.merge({}, this.mod)

      currentMod.data.styleID = index

      return currentMod
    }
  }
}
</script>

<style lang="scss" scoped>
.style-item {
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  display: block;
  margin-bottom: 12px;
}
.style-item.active {
  border-color: #3da4fd;
}

.render {
  // width: 295px;
  height: auto;
  background-color: white;
  overflow: hidden;
  margin: auto;
  margin-bottom: 12px;
  position: relative;

  .render-mod-container--click-prevent {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .render-mod-container {
    border: 10px solid white;
    // width: 275px;
    height: 290px;
    overflow: hidden;

    .render-mod {
      width: 1080px;
      transform: scale(0.357);
      transform-origin: top left;
    }
  }
}
</style>
