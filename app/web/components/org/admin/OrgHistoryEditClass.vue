<template>
  <div class="edit-class" v-loading="isLoading">
    <history-class-comp :classDetail='classDetail' @save="updateClass"></history-class-comp>
  </div>
</template>
<script>
import HistoryClassComp from './common/HistoryClassComp'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgHistoryEditClass',
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    classDetail() {
      return _.get(this.$route, 'query')
    }
  },
  methods: {
    ...mapActions({
      orgUpdateClass: 'org/updateClass'
    }),
    toHistoryClassListPage() {
      this.$router.push({
        name: 'HistoricalData'
      })
    },
    async updateClass(updatedClassData) {
      this.isLoading = true
      try {
        await this.orgUpdateClass({
          organizationId: this.orgId,
          classId: this.classDetail.id,
          ...updatedClassData
        })
        this.$message({
          message: this.$t('org.successfullyUpdatedClass'),
          type: 'success'
        })
        this.toHistoryClassListPage()
      } catch (error) {
        let message =
          error.status == 400
            ? '该班学生人数过多，不能完成延期操作。请联系keepwork客服处理:support@paraengine.com'
            : '操作失败，请重试'
        this.$message({
          message: message,
          type: 'error'
        })
      }
      this.isLoading = false
    }
  },
  components: {
    HistoryClassComp
  }
}
</script>
