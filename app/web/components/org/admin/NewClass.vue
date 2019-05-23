<template>
  <div class="new-class" v-loading="isLoading">
    <class-comp @save="createNewClass"></class-comp>
  </div>
</template>
<script>
import ClassComp from './common/ClassComp'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'NewClass',
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
    }
  },
  methods: {
    ...mapActions({
      orgCreateNewClass: 'org/createNewClass'
    }),
    toClassListPage() {
      this.$router.push({
        name: 'OrgClassList'
      })
    },
    async createNewClass(newClassData) {
      this.isLoading = true
      await this.orgCreateNewClass({
        ...newClassData,
        organizationId: this.orgId
      })
        .then(result => {
          this.$message({
            message: this.$t('org.successfullyCreatedANewClass'),
            type: 'success'
          })
          this.isLoading = false
          this.toClassListPage()
        })
        .catch(error => {
          let message = ''
          switch (error.status) {
            case 409:
              message = this.$t('org.classNameAlreadyExist')
              break
            default:
              message = this.$t('org.failedToCreateANewClass')
              break
          }
          this.isLoading = false
          this.$message({
            message: message,
            type: 'error'
          })
        })
    }
  },
  components: {
    ClassComp
  }
}
</script>
