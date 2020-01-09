<template>
  <use-code class="active-student" v-loading="isLoading" :selectedStudents="selectedStudents" nowPageText="激活用户" confirmText="确定激活学生吗？" @save="reActive" @cancel="toHistoryStudentListPage" />
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import UseCode from './common/UseCode'
export default {
  name: 'ActiveStudent',
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      reActivatedParams: 'org/reActivatedParams',
    }),
    selectedStudents() {
      return this.reActivatedParams.students
    },
  },
  methods: {
    ...mapActions({
      orgReactivate: 'org/reactivate',
    }),
    async reActive(params) {
      this.isLoading = true
      try {
        await this.orgReactivate(params)
        this.toHistoryStudentListPage()
        this.$message({ type: 'success', message: '激活成功' })
      } catch (error) {
        console.log(error)
        this.$message({ type: 'error', message: '激活失败，请重试' })
      }
      this.isLoading = false
    },
    toHistoryStudentListPage() {
      this.$router.push({ name: 'HistoricalMember' })
    },
  },
  components: {
    UseCode,
  },
}
</script>
<style lang="scss" scoped>
.active-student {
  background-color: #fff;
}
</style>
