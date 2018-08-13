<template>
  <el-dialog class="dialog" :title="$t('editor.pptPresentation')" :visible.sync="isDialogShow" :before-close="handleClose" center>
    <!-- <div class="pptShow">
      ppt presentation
    </div> -->
    <iframe :src='"/static/reveal.js/index.html"'></iframe>
  </el-dialog>
</template>

<script>

// import compBaseMixin from '../comp.base.mixin'
// import Reveal from 'reveal.js/js/reveal';
import Reveal from 'reveal.js'

export default {
  // name: '',
  props: {
    isEditorShow: Boolean
  },
  data() {
    return {}
  },
  // mixins: [compBaseMixin],
  components: {},
  computed: {
    isDialogShow() {
      return this.isEditorShow
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
  },
  created() {}
}
</script>

<style lang="scss">
.dialog {
  iframe {
    width: 750px;
    height: 500px;
  }
}
</style>
