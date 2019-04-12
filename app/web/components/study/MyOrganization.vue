<template>
  <div class="my-organization">
    <div class="my-organization-cabinet">
      <organization-cell :organization="i" v-for="i in userOrg" :key="i.id"></organization-cell>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import OrganizationCell from '@/components/study/common/OrganizationCell'
export default {
  name: 'MyOrganization',
  data() {
    return {}
  },
  async mounted() {
    await this.getUserOrg()
  },
  computed: {
    ...mapGetters({
      userOrg: 'org/userOrg'
    })
  },
  methods: {
    ...mapActions({
      getUserOrg: 'org/getUserOrg'
    })
  },
  components: {
    OrganizationCell
  }
}
</script>

<style lang="scss" scoped>
.my-organization {
  &-cabinet {
    margin: 0 auto 24px;
    max-width: 1200px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
