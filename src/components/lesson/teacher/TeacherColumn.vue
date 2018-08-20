<template>
  <div class="teacher-column">
    <not-activated-teacher-role v-if="activatedTeacherRole"></not-activated-teacher-role>
    <activated-teacher-role></activated-teacher-role>
  </div>
</template>

<script>
import NotActivatedTeacherRole from './NotActivatedTeacherRole'
import ActivatedTeacherRole from './ActivatedTeacherRole'
export default {
  name: "TeacherColumn",
  data(){
    return{
      activatedTeacherRole: false
    }
  },
  components: {
    NotActivatedTeacherRole,
    ActivatedTeacherRole
  }
}
</script>

<style lang="scss">

</style>


