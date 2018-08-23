<template>
  <div class="comp-ppt">
    <el-button plain type='info' size='mini' @click='isPptShow = true'>{{$t('editor.beginToShow')}}</el-button>
    <showComponent :isEditorShow='isPptShow' :originalTreeData='originValue' @cancel='cancel'></showComponent>
  </div>
</template>

<script>

import compBaseMixin from '../comp.base.mixin'
import showComponent from './ShowComponent'

export default {
  name: 'AdiPpt',
  props: {
    originValue: String
  },
  data() {
    return {
      isPptShow: false
    }
  },
  mixins: [compBaseMixin],
  components: {
    showComponent
  },
  computed: {},
  methods: {
    cancel(){
      this.isPptShow = false
    },
  },
  created() {}
}
</script>

<style lang="scss">
.comp-ppt{

}
</style>
