<template>
  <div class="my-organization">
    <div v-if="isHasOrg" class="my-organization-title">我的机构</div>
    <div v-if="isHasOrg" class="my-organization-cabinet">
      <organization-cell :organization="i" v-for="i in userOrg" :key="i.id"></organization-cell>
    </div>
    <div v-else class="my-organization-empty">
      <div class="my-organization-empty-tips">成为机构学员，学习keepwork在线课程</div>
      <div class="my-organization-empty-button" @click="toOrganizationCooperation">了解更多机构信息</div>
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
    }),
    isHasOrg() {
      return this.userOrg.length > 0
    }
  },
  methods: {
    ...mapActions({
      getUserOrg: 'org/getUserOrg'
    }),
    toOrganizationCooperation() {
      this.$router.push({ name: 'OrganizationCooperation' })
    }
  },
  components: {
    OrganizationCell
  }
}
</script>

<style lang="scss" scoped>
.my-organization {
  &-title {
    font-size: 16px;
    max-width: 1200px;
    font-weight: bold;
    margin: 30px auto 0;
  }
  &-cabinet {
    margin: 0 auto 24px;
    max-width: 1200px;
    display: flex;
    flex-wrap: wrap;
    &-box {
      margin: 24px 32px 0 0;
    }
  }
  &-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 14px;
    color: #909399;
    &-button {
      margin-top: 26px;
      border: 1px solid #2397f3;
      color: #2397f3;
      display: inline-block;
      padding: 6px 10px;
      border-radius: 20px;
      cursor: pointer;
    }
  }
}
@media screen and(min-width: 1200px) {
  .my-organization {
    &-cabinet {
      &-box {
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
