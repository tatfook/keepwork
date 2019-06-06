<template>
  <el-input :placeholder="$t('editor.pleaseInput')" v-model="linkVal" @change='updateValue' class="input-with-select">
    <el-button v-if="linkVal" slot="prepend" icon="iconfont icon-link_"></el-button>
    <el-button v-else slot="prepend">{{$t('common.link')}}</el-button>
    <el-select v-model="linkVal" @change='updateValue' @visible-change="handleOptionVisible" slot="append" placeholder="Select" popper-class="link-type-popper" :loading="isPageListLoading">
      <el-option v-for="(path, pathIndex) in personalAllPagePathList" :key="pathIndex" :value="getLocationUrl(path)">
        {{ path }}
      </el-option>
    </el-select>
  </el-input>
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LinkType',
  mixins: [protypesBaseMixin],
  props: {
    originValue: String
  },
  async mounted() {
    this.linkVal = this.linkTypeValue
  },
  data() {
    return {
      isPageListLoading: false,
      linkVal: ''
    }
  },
  computed: {
    ...mapGetters({
      personalAllPagePathList: 'user/personalAllPagePathList'
    }),
    linkTypeValue() {
      return this.originValue
        ? this.originValue
        : (this.optionsData && this.optionsData.emptyLink) || ''
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalPageList: 'user/getAllPersonalPageList'
    }),
    async handleOptionVisible(isVisible) {
      if (isVisible) {
        this.isPageListLoading = true
        await this.getAllPersonalPageList().catch()
        this.isPageListLoading = false
      }
    },
    updateValue(newVal) {
      let tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getLocationUrl(url) {
      return url ? location.origin + '/' + url : ''
    }
  },
  watch: {
    originValue(value) {
      this.linkVal = this.linkTypeValue
    }
  }
}
</script>

<style lang="scss">
.el-input-group__prepend {
  padding: 0;
  .el-button--default {
    padding: 0;
    margin: 0;
  }
}
.input-with-select {
  border-bottom: 1px solid #e4e7ed;
  > .el-input-group__prepend,
  > .el-input__inner,
  > .el-input-group__append {
    border: none;
    background: none;
  }
  > .el-input__inner {
    padding: 0 0 0 5px;
  }
  > .el-input-group__append {
    padding-left: 12px;
  }
}
.link-type {
  &-popper {
    max-width: 400px;
  }
}
</style>
