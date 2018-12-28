<template>
  <div class="teacher-column">
    <activated-teacher-role class="teacher-column-activated"></activated-teacher-role>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ActivatedTeacherRole from './ActivatedTeacherRole'

export default {
  name: 'TeacherColumn',
  data() {
    return {}
  },
  async created() {
    await this.getUserDetail()
  },
  computed: {
    ...mapGetters({
      userinfo: 'lesson/userinfo'
    })
  },
  methods: {
    ...mapActions({
      getUserDetail: 'lesson/getUserDetail'
    })
  },
  components: {
    ActivatedTeacherRole
  }
}
</script>
