<template>
  <div class="org-teacher-router">
     <org-header></org-header>
     <router-view v-if="!isLoading"></router-view>
  </div>
</template>


<script>
import OrgHeader from './common/OrgHeader'
import { mapActions } from 'vuex'
export default {
  name: 'OrgTeacherContainer',
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
      await this.getCurrentClass()
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
  },
  methods: {
    ...mapActions({
       getCurrentClass: 'org/teacher/getCurrentClass'
    })
  }

}
</script>

