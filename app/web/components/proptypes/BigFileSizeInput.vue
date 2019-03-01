<template>
  <div class="big-file-size" v-if="isImage">
    <div class="big-file-px" v-if="isPx">
      <div class="big-file-px-left">
        <span :class="['big-file-custom', { 'custom-off': !isCustom }]" @click="handleCustomSwitch">自定义</span>
      </div>
      <div class="big-file-px-right">
        <div class="big-file-px-row">
          <span class="big-file-size-title">{{$t('field.width')}}</span>
          <el-input type="number" v-model="width" @change="handleWidthInput" @focus="handleWidthInput" min="1" max="10000" class="big-file-size-input"></el-input>
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
          <el-input type="number" :disabled="!isCustom" v-model="height" @change="handleHeightInput" @focus="handleHeightInput" min="1" max="10000" class="big-file-size-input"></el-input>
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
      <span class="big-file-size-title">{{$t('field.width')}}</span>
      <el-input type="number" v-model="percent" @change="handlePercentInput" @focus="handlePercentInput" min="1" max="100" class="big-file-size-input"></el-input>
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
      height: ''
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
      return this.cardValue.custom
    }
  }
}
</script>

<style lang="scss">
.big-file-size {
  .big-file-unit-dropdown {
    line-height: 40px;
    cursor: pointer;
  }
  &-title {
    display: block;
    width: 80px;
    line-height: 40px;
  }
  &-unit {
    line-height: 40px;
  }
  &-input {
    .el-input__inner {
      border-right: none;
      border-top: none;
      border-left: none;
      border-radius: 0;
    }
  }
  .big-file-px {
    display: flex;
    &-row {
      display: flex;
    }
    &-left {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .big-file-custom {
        width: 16px;
        padding: 4px 2px;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        border-radius: 4px;
        color: #fff;
        background: #3ba4ff;
        box-shadow: 3px 3px 5px #ccc;
        cursor: pointer;
        &.custom-off {
          color: #fff;
          background-color: #aaadb3;
          border-color: #909399;
          box-shadow: 2px 2px 3px #ccc;
        }
      }
    }
    &-right {
      flex: 1;
    }
  }

  .big-file-percent {
    display: flex;
    &-title {
      display: block;
      width: 80px;
    }
    &-unit {
      line-height: 40px;
    }
  }
}
</style>

