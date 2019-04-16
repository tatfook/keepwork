<template>
  <el-input :placeholder="$t('adi.iframe.pleaseInput')" v-model="iframeLinkValue" @focus="updateFocus" @blur="updateFocus" class="input-with-select">
    <el-button v-if="iframeLinkValue" slot="prepend" icon="iconfont icon-link_"></el-button>
    <el-button v-else slot="prepend">{{$t('common.link')}}</el-button>
    <el-button v-if="isFocus" slot="append" :style="getSureStyle">{{$t('common.Sure')}}</el-button>
    <el-select v-if="!isFocus" v-model="iframeLinkValue" @change="updateValue" slot="append" placeholder="Select">
      <el-option v-for="(path, pathIndex) in personalAllPagePathList" :key="pathIndex" :value="getLocationUrl(path)">{{ path }}</el-option>
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
    this.iframeLinkValue = this.originValue ? this.originValue : ''
    await this.getAllPersonalPageList()
  },
  computed: {
    ...mapGetters({
      personalAllPagePathList: 'user/personalAllPagePathList'
    }),
    getSureStyle() {
      if (
        this.iframeLinkValue.match(/(http|https):\/\/.+/) ||
        this.iframeLinkValue === ''
      ) {
        return { color: '#3ba4ff' }
      } else {
        return { color: 'unset' }
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
        if (!this.iframeLinkValue) {
          this.iframeLinkValue = this.originValue
        }
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
        !this.iframeLinkValue.match(/(http|https):\/\/.+/) &&
        this.iframeLinkValue !== ''
      ) {
        this.$message.error(this.$t('adi.iframe.formatError'))
        return false
      }

      if (
        this.iframeLinkValue.match(
          /(http|https):\/\/(stage\.keepwork|release\.keepwork|keepwork|)(.com$|.com\/.+|localhost:7001$|localhost:7001\/.+)/
        )
      ) {
        callback()
        return true
      }

      this.$confirm(this.$t('adi.iframe.notice'), this.$t('editor.hint'), {
        confirmButtonText: this.$t('editor.confirm'),
        cancelButtonText: this.$t('editor.cancel'),
        type: 'warning'
      }).then(() => {
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
