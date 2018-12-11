<template>
  <div class="project-members-switch">
    {{$t('card.projectMembers')}} <el-switch
      v-model="membersStatus"
      @change="switchMembers"
    ></el-switch>
  </div>
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'
export default {
  mixins: [protypesBaseMixin],
  props: {
    originValue: Boolean,
  },
  computed: {
    membersStatus() {
      return this.originValue
    }
  },
  methods: {
    switchMembers(status) {
      this.$emit('onPropertyChange', { projectMembersShow: status })
    }
  }

}
</script>

<style lang="scss">
.project-members-switch {
  display: flex;
  justify-content: space-between;
  color: #3ba4ff;
  font-size: 16px;
  margin-top: 20px;
}
</style>
