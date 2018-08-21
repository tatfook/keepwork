<template>
  <div class="teacher-column">
    <activated-teacher-role v-if="userinfo.identify === 2"></activated-teacher-role>
    <not-activated-teacher-role v-else></not-activated-teacher-role>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NotActivatedTeacherRole from './NotActivatedTeacherRole'
import ActivatedTeacherRole from './ActivatedTeacherRole'
export default {
  name: 'TeacherColumn',
  data() {
    return {
    }
  },
  async mounted() {
    await this.getUserDetail(this.getToken)
  },
  computed: {
    ...mapGetters({
      getToken: 'user/getToken',
      userinfo: 'lesson/userinfo'
    })
  },
  methods: {
    ...mapActions({
      getUserDetail: 'lesson/getUserDetail'
    })
  },
  components: {
    NotActivatedTeacherRole,
    ActivatedTeacherRole
  }
}
</script>

<style lang="scss">
.teacher-column{
  height: calc(100vh - 61px - 63px -104px);
  overflow: auto;
}
</style>