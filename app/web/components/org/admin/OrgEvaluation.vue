<template>
  <div class="org-evaluation">
    <router-view v-if="orgClassesLength != 0"></router-view>
    <div v-else class="org-evaluation-empty">
      <img src="@/assets/img/media_library_empty.png" alt="">
      <p>
        暂无数据
      </p>
    </div>
  </div>

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrgEvaluation',
  async mounted() {
    await this.getOrgClassList({
      organizationId: this.orgId
    })
    this.isLoadPreset = false
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    orgClassesLength() {
      return this.orgClasses.length
    }
  },
  methods: {
    ...mapActions({
      getOrgClassList: 'org/getOrgClassList'
    })
  }
}
</script>
<style lang="scss" scoped>
.org-evaluation {
  &-empty {
    background-color: #fff;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    & > p {
      font-size: 14px;
      color: #666;
      margin: 26px 0 0;
    }
  }
}
</style>
