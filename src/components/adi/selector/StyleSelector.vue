<template>
  <div>
    <div v-if='modConf.name == "ModMarkdown" || !style.useImage' v-for='(style, index) in modConf.styles' :key='style.name' class="style-item render" :class='{active: isActive(index)}' @click='changeStyle(index)'>
      <div class="render-mod-container--click-prevent"></div>
      <div class="render-mod-container">
        <component class="render-mod" :is='modConf.mod' :mod='currentMod(index)' :editMode='true' :conf='modConf' :theme='theme'></component>
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
  mounted() {
    this.autoResizePreview()
  },
  updated() {
    this.autoResizePreview()
  },
  computed: {
    ...mapGetters({
      themeConf: 'themeConf'
    }),
    modConf() {
      let modConf = modLoader.load(this.mod.modType)

      _.forEach(modConf.styles, (item, key) => {
        item.container = ''
      })

      return modConf
    },
    theme() {
      let globalTheme = themeFactory.generate(this.themeConf)
      globalTheme.sheet.attach()

      return globalTheme
    }
  },
  methods: {
    ...mapActions({
      updateActiveModStyle: 'updateActiveModStyle'
    }),
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
    },
    autoResizePreview() {
      let all = this.$el.querySelectorAll('.render-mod-container')

      _.forEach(all , (dom, key) => {
        dom.style.height = null
        dom.style.height = dom.offsetHeight * 0.24 + 'px'
      })
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
  background-color: white;
  overflow: hidden;
  margin: auto;
  margin-bottom: 12px;
  position: relative;
  padding: 10px;

  .render-mod-container--click-prevent {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .render-mod-container {
    overflow: hidden;

    .render-mod {
      width: 1080px;
      transform: scale(0.357);
      transform-origin: top left;
    }
  }
}

@media screen and (max-width: 1920px) {
  .render {
    background-color: white;
    overflow: hidden;
    margin: auto;
    margin-bottom: 12px;
    position: relative;

    .render-mod-container {
      overflow: hidden;

      .render-mod {
        width: 1080px;
        transform: scale(0.24);
        transform-origin: top left;
      }
    }
  }
}
</style>
