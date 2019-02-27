<template>
  <el-select class="user-pages-selector" v-model="selectedUrl" :size='size' @change='updateValue' slot="append" :placeholder="placeholderText" filterable allow-create>
    <el-option v-for="(path, pathIndex) in personalAllPagePathList" :key="pathIndex" :value="getLocationUrl(path)">
      {{ path }}
    </el-option>
  </el-select>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'UserPagesSelector',
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    placeholderText: String,
    emitData: Object
  },
  async mounted() {
    await this.getAllPersonalPageList()
  },
  data() {
    return {
      selectedUrl: ''
    }
  },
  computed: {
    ...mapGetters({
      personalAllPagePathList: 'user/personalAllPagePathList'
    })
  },
  methods: {
    ...mapActions({
      getAllPersonalPageList: 'user/getAllPersonalPageList'
    }),
    updateValue(newLink) {
      this.$emit('onChangeLink', {
        link: newLink,
        emitData: this.emitData
      })
    },
    getLocationUrl(url) {
      return url ? location.origin + '/' + url : ''
    }
  }
}
</script>
