<template>
  <div class="teacher-column">
    <NotActivatedTeacherRole v-if="activatedTeacherRole"/>
    <ActivatedTeacherRole/>
  </div>
</template>

<script>
import NotActivatedTeacherRole from './NotActivatedTeacherRole'
import ActivatedTeacherRole from './ActivatedTeacherRole'
export default {
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


