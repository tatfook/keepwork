<template>
  <div class="edit-class" v-loading="isLoading">
    <class-comp :classDetail='classDetail' @save="updateClass"></class-comp>
  </div>
</template>
<script>
import ClassComp from './common/ClassComp'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'EditClass',
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
  toClassListPage() {
    this.$router.push({
      name: 'OrgClassList'
    })
  },
  methods: {
    ...mapActions({
      orgUpdateClass: 'org/updateClass'
    }),
    toClassListPage() {
      this.$router.push({
        name: 'OrgClassList'
      })
    },
    async updateClass(updatedClassData) {
      this.isLoading = true
      await this.orgUpdateClass({
        organizationId: this.orgId,
        classId: this.classDetail.id,
        ...updatedClassData
      })
        .then(() => {
          this.$message({
            message: this.$t('org.successfullyUpdatedClass'),
            type: 'success'
          })
          this.isLoading = false
          this.toClassListPage()
        })
        .catch(error => {
          console.log(error)
          this.$message({
            message: this.$t('org.failedUpdatedClass'),
            type: 'error'
          })
          this.isLoading = false
        })
    }
  },
  components: {
    ClassComp
  }
}
</script>
