<template>
  <div class="prop-box" :class="{'active': isCardActive, 'card-only-title': !isModShow}">
    <el-row class="prop-header" type='flex' justify='space-between'>
      <el-col>
        {{$t("card." + cardKey)}}
      </el-col>
      <el-tooltip v-if="cardKey == 'menu' || cardKey == 'board' || cardKey == 'comment' || cardKey == 'qq'" :content="tipTool()" popper-class="prop-header-tooltip-class" placement="top">
        <i class="iconfont icon-help"></i>
      </el-tooltip>
      <el-tooltip v-if="cardKey == 'md'" popper-class="prop-header-tooltip-class" placement="top">
        <i class="iconfont icon-help"></i>
        <div slot="content"><span v-html="tipTool()"></span></div>
      </el-tooltip>
      <el-col class="card-info">
        <el-tooltip :content="$t('editor.enlargeMdEditing')" placement="top">
          <i v-show="isMultiLineProp" class="iconfont icon-full-screen_" @click='showMultiTextDailog'></i>
        </el-tooltip>
        <el-tooltip :content="isToolTip" placement="top">
          <el-switch :width='32' v-model="isModShow" active-color="#3ba4ff" inactive-color='#bfbfbf' @change='toggleModVisible'></el-switch>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="prop-item" v-if="isModShow" :prop='prop' v-for='(propItem, index) in prop' :key='index'>
      <component 
        :is='proptypes[propItem]'
        :prop='prop'
        :optionsData='optionsData'
        :editingKey='index'
        :originValue='cardValue[index]'
        :cardValue='cardValue'
        :activePropertyOptions='activePropertyOptions'
        @onPropertyChange='changeProptyData'
        @onChangeValue='changeActivePropty'></component>
    </el-row>
  </div>
</template>
<script>
import proptypes from '@/components/proptypes'
import { mapGetters, mapActions } from 'vuex'
import modLoader from '@/components/adi/mod'
import BaseCompProptypes from '@/components/adi/common/comp.proptypes'
import _ from 'lodash'

export default {
  name: 'PropTypeCard',
  props: {
    cardKey: String,
    cardValue: Object,
    prop: Object,
    componentName: String,
    activePropertyOptions: Object,
    isCardActive: Boolean
  },
  data() {
    return {
      proptypes,
      BaseCompProptypes
    }
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod'
    }),
    isModShow: {
      get() {
        return this.cardValue && !this.cardValue.hidden
      },
      set() {}
    },
    isToolTip () {
      if (this.isModShow){
        return this.$t("tips.clickToHide")
      } else {
        return this.$t("tips.clickToShow")
      }
    },
    optionsData() {
      if (!this.activeMod || !this.activeMod.modType || !this.activeMod.data || !this.activeMod.data.styleID === '') {
        return {}
      }
      let modConf = modLoader.load(this.activeMod.modType)

      if ( !modConf || !modConf.styles) {
        return {}
      }
      let currentStyle = modConf.styles[this.activeMod.data.styleID]

      if (!currentStyle || !currentStyle.options || !currentStyle.options.config) {
        return {}
      }

      return currentStyle.options.config[this.componentName]
    },
    isMultiLineProp() {
      let propKeys = _.keys(this.prop)
      let multipleLineProps = _.filter(propKeys, propItem => {
        return this.prop[propItem] === 'autoSizeInput'
      })
      return multipleLineProps.length > 0
    }
  },
  methods: {
    ...mapActions({
      setActiveProperty: 'setActiveProperty',
      setActivePropertyData: 'setActivePropertyData',
      setIsMultipleTextDialogShow: 'setIsMultipleTextDialogShow'
    }),
    changeActivePropty() {
      this.setActiveProperty({
        key: this.activeMod.key,
        property: this.cardKey
      })
    },
    changeProptyData(changedData) {
      let self = this

      if (!self.changeProtyDataThrottle) {
        self.changeProtyDataThrottle = _.throttle(changedData => {
          self.changeActivePropty()
          self.setActivePropertyData({
            data: changedData
          })
        }, 100)
      }

      self.changeProtyDataThrottle(changedData)
    },
    toggleModVisible(value) {
      this.changeProptyData({
        hidden: !value
      })
    },
    showMultiTextDailog() {
      this.changeProptyData(this.cardValue)
      this.setIsMultipleTextDialogShow({
        isShow: true
      })
    },
    tipTool(){
      return this.$t("help." + this.cardKey)
    }
  }
}
</script>
<style lang="scss" scoped>
.prop-box {
  background-color: #fff;
  padding: 25px 18px;
  margin-bottom: 12px;
  border: 2px solid transparent;
}
.prop-box.active {
  border: 2px solid #3da4fd;
}
.card-only-title {
  padding: 16px 18px;
}
.card-only-title .prop-header {
  margin-bottom: 0;
}
.prop-header {
  margin-bottom: 12px;
  font-size: 16px;
  color: #3ba4ff;
}
.card-info {
  width: auto;
  white-space: nowrap;
  .iconfont {
    vertical-align: middle;
    color: #333;
    margin-right: 10px;
    cursor: pointer;
  }
}
.icon-help {
  line-height: 23px;
  margin-right: 10px;
  color: #4d90fe;
  height: 16px;
  width: 16px;
}
</style>
<style>
  .prop-header-tooltip-class {
    max-width: 215px;
  }
</style>

