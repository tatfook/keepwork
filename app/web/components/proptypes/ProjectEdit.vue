<template>
  <div class="project-edit-container">
    <el-button @click="handleChangeProp">test</el-button>
    <el-input></el-input>

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
    return {}
  },
  methods: {
    handleChangeProp() {
      this.$emit('onPropertyChange', {name: 'kevin', id: '90001'})
    }
  },
}
</script>
