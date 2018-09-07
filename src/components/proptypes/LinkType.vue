<template>
  <el-input :placeholder="$t('editor.pleaseInput')" v-model="linkTypeValue" @change='updateValue' class="input-with-select">
    <el-button v-if="linkTypeValue" slot="prepend" icon="iconfont icon-link_"></el-button>
    <el-button v-else slot="prepend">{{$t('common.link')}}</el-button>
    <el-select v-model="linkTypeValue" @change='updateValue' slot="append" placeholder="Select">
      <el-option v-for="(path, pathIndex) in personalAllPagePathList" :key="pathIndex" :value="locationOrigin + '/' + path">
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
    editingKey: String,
    originValue: String
  },
  data() {
    return {
      locationOrigin: location.origin
    }
  },
  async mounted() {
    await this.getAllPersonalPageList()
  },
  computed: {
    ...mapGetters({
      personalAllPagePathList: 'user/personalAllPagePathList'
    }),
    linkTypeValue: {
      get() {
        return this.originValue
      },
      set(data) {
        this.updateValue(data)
      }
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalPageList: 'user/getAllPersonalPageList'
    }),
    updateValue(newVal) {
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
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
</style>