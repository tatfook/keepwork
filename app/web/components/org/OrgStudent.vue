<template>
  <div class="org-student-router">
    <org-header></org-header>
    <router-view v-if="!isLoading"></router-view>
  </div>
</template>


<script>
import OrgHeader from './common/OrgHeader'
import { mapActions } from 'vuex'
import { lesson } from '@/api'

export default {
  name: 'OrgStudentContainer',
  components: {
    OrgHeader
  },
  data() {
    return {
      isLoading: true
    }
  },
  async created() {
    try {
      await this.resumeClassroom()
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
    lesson.users.getUserDetail()
  },
  methods: {
    ...mapActions({
      resumeClassroom: 'org/student/resumeClassroom'
    })
  }
}
</script>

<style lang="scss" scoped>
.org-student-router {
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;
}
</style>


