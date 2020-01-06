<template>
  <use-code v-loading="isLoading" :selectedStudents="selectedStudents" :nowPageText="nowPageText" :isTryShow="false" @save="toBeFormal" @cancel="toStudentListPage" />
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import UseCode from './common/UseCode'
export default {
  name: 'UseFormalCode',
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      useFormalCodeParams: 'org/useFormalCodeParams',
    }),
    type() {
      return this.useFormalCodeParams.type
    },
    selectedStudents() {
      return this.useFormalCodeParams.students
    },
    nowPageText() {
      return this.type == 'renew' ? '续费' : '试听转正式'
    },
  },
  methods: {
    ...mapActions({
      orgToBeFormal: 'org/toBeFormal',
      orgRenew: 'org/renew',
    }),
    async toBeFormal(params) {
      this.isLoading = true
      try {
        this.type == 'renew' ? await this.orgRenew(params) : await this.orgToBeFormal(params)
        this.toStudentListPage()
      } catch (error) {
        console.log(error)
        this.$message({ type: 'error', message: '操作失败，请重试' })
      }
      this.isLoading = false
    },
    toStudentListPage() {
      this.$router.push({ name: 'OrgStudentList' })
    },
  },
  components: {
    UseCode,
  },
}
</script>
