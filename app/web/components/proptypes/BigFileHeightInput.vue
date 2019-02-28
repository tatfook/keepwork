<template>
  <div class="big-file-height" v-if="isImage && isPx">
    <span class="big-file-height-title">{{$t('field.height')}}</span>
    <el-input type="number" min="1" max="10000" v-model="height" @input="hanldeInput" class="big-file-height-input"></el-input>
    <span class="big-file-height-unit"> px</span>
  </div>
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'
export default {
  name: 'BigFileInputInput',
  mixins: [protypesBaseMixin],
  props: {
    originValue: String
  },
  data() {
    return {
      height: ''
    }
  },
  mounted() {
    this.height = this.originValue
  },
  methods: {
    hanldeInput(height) {
      if (/^[0-9]*$/.test(height) && (height > 0 && height < 10000)) {
        this.$emit('onPropertyChange', { height: Number(height) })
      }
    }
  },
  watch: {
    isPx(value) {
      if (!value) {
        this.height = ''
        this.$emit('onPropertyChange', { height: '' })
      }
    }
  },
  computed: {
    isImage() {
      return ['jpg', 'png', 'gif'].includes(this.cardValue.ext)
    },
    isPx() {
      return this.unit === 'px'
    },
    unit() {
      return this.cardValue.unit
    }
  }
}
</script>

<style lang="scss">
.big-file-height {
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
    margin-right: 20px;
  }
  // .big-file-unit-dropdown {
  //   .el-dropdown-link {
  //     line-height: 40px;
  //   }
  // }
}
</style>

