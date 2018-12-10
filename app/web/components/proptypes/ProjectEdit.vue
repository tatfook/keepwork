<template>
  <div class="project-edit-container">
    <el-button @click="handleChangeProp">test</el-button>
    <el-input v-model="projectId"></el-input>
    <div class="project-edit-row">
      {{$t('card.projectTags')}} <el-switch></el-switch>
    </div>
    <div class="project-edit-row">
      {{$t('card.projectMembers')}} <el-switch></el-switch>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      projectId: ''
    }
  },
  methods: {
    handleChangeProp() {
      console.log(this.projectId)
      this.$emit('onPropertyChange', { projectId: this.projectId })
    }
  },
}
</script>
