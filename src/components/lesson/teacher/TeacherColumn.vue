<template>
  <div class="teacher-column">
    <not-activated-teacher-role v-if="activatedTeacherRole"></not-activated-teacher-role>
    <activated-teacher-role v-else></activated-teacher-role>
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
      activatedTeacherRole: true
    }
  },
  computed: {
    ...mapGetters({
      userinfo: 'lesson/userinfo'
    })
  },
  async mounted() {
    await this.getUserDetail(this.getToken)
    setTimeout(() => console.log('userinfo', this.userinfo),3000)
  },
  computed: {
    ...mapGetters({
      getToken: 'user/getToken'
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
</style>


