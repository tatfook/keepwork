<template>
  <div class="big-file-width" v-if="isImage">
    <span class="big-file-width-title">{{$t('field.width')}}</span>
    <el-input type="number" v-model="width" @change="handleInput" min="1" :max="max" class="big-file-width-input"></el-input>
    <span class="big-file-width-unit">{{unit}}</span>
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
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'
import _ from 'lodash'
export default {
  name: 'BigFileWidthInput',
  mixins: [protypesBaseMixin],
  props: {
    originValue: String
  },
  data() {
    return {
      width: 100
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.originValue) {
        this.width = this.originValue
      }
      if (!this.width) {
        this.$emit('onPropertyChange', { width: 100 })
      }
      if (!this.cardValue.unit) {
        this.handleDropdown('%')
      }
    },
    handleInput(width) {
      if (/^[0-9]*$/.test(width)) {
        if (this.isPercent && (width < 0 || width > 100)) {
          return this.$emit('onPropertyChange', { width: 100 })
        }
        this.$emit('onPropertyChange', { width: Number(width) })
      }
    },
    handleDropdown(unit) {
      this.$emit('onPropertyChange', { unit })
    }
  },
  watch: {
    unit(value, oldValue) {
      if (value === '%') {
        this.width = 100
        this.$emit('onPropertyChange', { width: 100 })
      }
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
    }
  }
}
</script>

<style lang="scss">
.big-file-width {
  display: flex;
  margin-bottom: 20px;
  &-title {
    line-height: 40px;
  }
  &-input {
    flex: 1;
    .el-input__inner {
      border-radius: 0;
      border-top: none;
      border-right: none;
      border-left: none;
    }
  }

  &-unit {
    line-height: 40px;
  }
  .big-file-unit-dropdown {
    cursor: pointer;
    .el-dropdown-link {
      line-height: 40px;
    }
  }
}
</style>

