<template>
  <div>
    <div v-if='modConf.name == "ModMarkdown" || !style.useImage' v-for='(style, index) in modConf.styles' :key='style.name' class="style-item render" :class='{active: isActive(index)}' @click='changeStyle(index)'>
      <div class="render-mod-container--click-prevent"></div>
      <div class="render-mod-container">
        <component class="render-mod" :is='modConf.mod' :mod='currentMod(index)' :editMode='true' :conf='modConf' :theme='theme'></component>
        <div class="style-shade">
          <span>{{$t('tips.clickToChange')}}</span>
        </div>
      </div>
    </div>
    <div class="style-item" v-if='style.useImage && modConf.name != "ModMarkdown"' v-for='(style, index) in modConf.styles' :key='style.name'>
      <img class="style-item-image" :class='{active: isActive(index)}' @click='changeStyle(index)' :src="style.cover" :alt="index">
      <div class="style-shade">
        <span>{{$t('tips.clickToChange')}}</span>
      </div>
    </div>
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
  async mounted() {
    await this.$nextTick()
    await this.$nextTick()
    await this.$nextTick()
    await this.$nextTick()
    this.autoResizePreview()
  },
  async updated() {
    await this.$nextTick()
    await this.$nextTick()
    await this.$nextTick()
    await this.$nextTick()
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

      let refactor = 0
      if (window.innerWidth <= 1920) {
        refactor = 0.225
      } else {
        refactor = 0.357
      }
      _.forEach(all, (dom, key) => {
        dom.style.height = null
        dom.style.height = dom.offsetHeight * refactor + 'px'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.style-item {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  display: block;
  margin-bottom: 12px;
  &-image {
    width: 100%;
  }
}
.style-item:hover {
  border: 2px solid #bcbcbc;
  .style-shade {
    opacity: 1;
  }
}
.style-item.active {
  border-color: #3da4fd;
  .style-shade {
    opacity: 0;
  }
}
.style-shade {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 14px;
  width: 100%;
  padding: 6px 0px;
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  background: rgba(144, 167, 191, 0.5);
  opacity: 0;
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
      max-width: unset;
      width: 1080px;
      transform: scale(0.357);
      transform-origin: top left;
      position: unset;
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
        max-width: unset;
        width: 1080px;
        transform: scale(0.225);
        transform-origin: top left;
      }
    }
  }
}
</style>
