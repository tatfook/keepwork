<template>
  <el-input
    :placeholder="$t('editor.pleaseInput')"
    v-model="linkTypeValue"
    @focus="updateFocus"
    @blur="updateFocus"
    class="input-with-select"
  >
    <el-button v-if="linkTypeValue" slot="prepend" icon="iconfont icon-link_"></el-button>
    <el-button v-else slot="prepend">{{$t('common.link')}}</el-button>
    <el-button v-if="isFocus" slot="append">确定</el-button>
    <el-select
      v-if="!isFocus"
      v-model="linkTypeValue"
      @change="updateValue"
      slot="append"
      placeholder="Select"
    >
      <el-option
        v-for="(path, pathIndex) in personalAllPagePathList"
        :key="pathIndex"
        :value="getLocationUrl(path)"
      >{{ path }}</el-option>
    </el-select>
  </el-input>
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LinkType',
  mixins: [protypesBaseMixin],
  data() {
    return {
      isFocus: false,
      iframeLinkValue: ''
    }
  },
  props: {
    originValue: String
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
          ? this.originValue
          : (this.optionsData && this.optionsData.emptyIfameLink) || ''
      },
      set(data) {
        this.iframeLinkValue = data
      }
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalPageList: 'user/getAllPersonalPageList'
    }),
    updateValue() {
      let tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = this.iframeLinkValue
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getLocationUrl(url) {
      return url ? location.origin + '/' + url : ''
    },
    updateFocus(val) {
      if (val && val.type === 'focus') {
        this.iframeLinkValue = this.originValue
        this.isFocus = true
      } else {
        this.checkUrl(() => {
          this.updateValue()
          this.isFocus = false
        })
      }
    },
    checkUrl(callback) {
      if (
        typeof this.iframeLinkValue !== 'string' ||
        typeof callback !== 'function'
      ) {
        return false
      }

      if (
        !this.iframeLinkValue.match(/(http|https):\/\//) 
      ) {
        this.iframeLinkValue = ''
        callback()
        return false
      }

      if (
        this.iframeLinkValue.match(/(http|https):\/\/(stage\.keepwork|release\.keepwork|keepwork|)(.com$|.com\/.+|localhost:7001$|localhost:7001\/.+)/)
      ) {
        callback()
        return true
      }

      this.$confirm(
        this.$t('adi.iframe.notice'),
        this.$t('editor.hint'),
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        callback()
      })
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