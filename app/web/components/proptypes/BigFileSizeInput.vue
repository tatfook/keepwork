<template>
  <div class="big-file-size" v-if="isImage">
    <div class="big-file-alignment">
      <div class="big-file-alignment-title">
        {{$t('field.alignment')}}
      </div>
      <el-dropdown class="big-file-alignment-dropdown" size="small" split-button @command="handleAlignmentSelect">
        {{$t(`field.${alignment}`)}}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="center">{{$t('field.center')}}</el-dropdown-item>
          <el-dropdown-item command="left">{{$t('field.left')}}</el-dropdown-item>
          <el-dropdown-item command="right">{{$t('field.right')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="big-file-px" v-if="isPx">
      <div class="big-file-px-left">
        <span :class="['big-file-custom', { 'custom-off': !isCustom }]" @click="handleCustomSwitch"></span>
      </div>
      <div class="big-file-px-right">
        <div class="big-file-px-row">
          <span class="big-file-size-title">{{$t('field.width')}}</span>
          <el-input-number size="small" v-model="width" controls-position="right" @change="handleWidthInput"  :min="1" :max="10000" class="big-file-size-input"></el-input-number>
          <span class="big-file-size-unit">px</span>
          <el-dropdown class="big-file-unit-dropdown" @command="handleDropdown">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="%">%</el-dropdown-item>
              <el-dropdown-item command="px">px</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="big-file-px-row">
          <span class="big-file-size-title">{{$t('field.height')}}</span>
          <el-input-number size="small" controls-position="right" :disabled="!isCustom" v-model="height" @change="handleHeightInput"  :min="1" :max="10000" class="big-file-size-input"></el-input-number>
          <span class="big-file-size-unit">px</span>
          <el-dropdown class="big-file-unit-dropdown" @command="handleDropdown">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="%">%</el-dropdown-item>
              <el-dropdown-item command="px">px</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="big-file-percent" v-else>
      <span class="big-file-percent-title">{{$t('field.width')}}</span>
      <el-input-number size="small" controls-position="right" v-model="percent" @change="handlePercentInput"  :min="1" :max="100" class="big-file-percent-input"></el-input-number>
      <span class="big-file-size-unit">%</span>
      <el-dropdown class="big-file-unit-dropdown" @command="handleDropdown">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="%">%</el-dropdown-item>
          <el-dropdown-item command="px">px</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'
import _ from 'lodash'
export default {
  mixins: [protypesBaseMixin],
  props: {
    originValue: String
  },
  data() {
    return {
      percent: 100,
      width: '',
      height: '',
      alignment: 'center'
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.percent = this.originPercent
      this.width = this.originWidth
      this.height = this.originHeight
      this.alignment = this.originAligment
      if (!this.cardValue.unit) {
        this.handleDropdown('%')
      }
    },
    handlePercentInput(percent) {
      if (/^[0-9]*$/.test(percent)) {
        if (percent < 0 || percent > 100) {
          return this.$emit('onPropertyChange', { percent: 100 })
        }
        this.$emit('onPropertyChange', { percent: Number(percent) })
      }
    },
    handleWidthInput(width) {
      if (/^[0-9]*$/.test(width)) {
        this.$emit('onPropertyChange', { width: Number(width) })
      }
    },
    handleHeightInput(height) {
      if (/^[0-9]*$/.test(height)) {
        this.$emit('onPropertyChange', { height: Number(height) })
      }
    },
    handleDropdown(unit) {
      this.$emit('onPropertyChange', { unit })
    },
    handleCustomSwitch() {
      this.$emit('onPropertyChange', { custom: !this.isCustom })
    },
    handleAlignmentSelect(alignment) {
      console.log(alignment)
      this.$emit('onPropertyChange', { alignment })
    }
  },
  watch: {
    originWidth(value) {
      this.width = value
    },
    originHeight(value) {
      this.height = value
    },
    originPercent(value) {
      this.percent = value
    },
    originAligment(value) {
      this.alignment = value
    }
  },
  computed: {
    isImage() {
      return ['jpg', 'png', 'gif'].includes(this.cardValue.ext)
    },
    unit() {
      return this.cardValue.unit || '%'
    },
    isPx() {
      return this.unit === 'px'
    },
    isPercent() {
      return this.unit === '%'
    },
    max() {
      return this.isPx ? 10000 : 100
    },
    originWidth() {
      return _.get(this.cardValue, 'width', 100)
    },
    originHeight() {
      return _.get(this.cardValue, 'height', 100)
    },
    originPercent() {
      return _.get(this.cardValue, 'percent', 100)
    },
    isCustom() {
      return _.get(this.cardValue, 'custom', false)
    },
    originAligment() {
      return _.get(this.cardValue, 'alignment', 'center')
    }
  }
}
</script>

<style lang="scss">
.big-file-size {
  .big-file-alignment {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    &-title {
      margin-right: 20px;
    }
  }
  .big-file-unit-dropdown {
    cursor: pointer;
  }
  &-title {
    display: block;
    width: 70px;
  }
  &-input {
    margin-right: 5px;
  }
  .big-file-px {
    display: flex;
    &-row {
      display: flex;
      line-height: 32px;
      padding: 5px 0;
    }
    &-left {
      width: 20px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      .big-file-custom {
        display: block;
        height: 21px;
        width: 9px;
        background: url('../../assets/img/big-file-unlock.png') no-repeat;
        cursor: pointer;
        &.custom-off {
          background: url('../../assets/img/big-file-lock.png') no-repeat;
        }
      }
    }
    &-right {
      width: 220px;
    }
  }

  .big-file-percent {
    display: flex;
    align-items: center;
    &-title {
      display: block;
      width: 84px;
    }
    &-input {
      margin-right: 5px;
      width: 110px;
    }
  }
}
</style>

