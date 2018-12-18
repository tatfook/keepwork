<template>
  <div class="project-tags-switch">
    {{$t('card.projectTags')}} <el-switch
      v-model="tagsStatus"
      @change="switchTags"
    ></el-switch>
  </div>
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'
export default {
  mixins: [protypesBaseMixin],
  props: {
    originValue: Boolean
  },
  computed: {
    tagsStatus() {
      return this.originValue
    }
  },
  methods: {
    switchTags(status) {
      this.$emit('onPropertyChange', { projectTagsShow: status })
    }
  }

}
</script>
<style lang="scss">
.project-tags-switch {
  display: flex;
  justify-content: space-between;
  color: #3ba4ff;
  font-size: 16px;
  margin-top: 20px;
}
</style>
