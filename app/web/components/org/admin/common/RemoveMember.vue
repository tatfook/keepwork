<template>
  <div class="remove-member" v-loading="isLoading" @click="confirmRemoveMember">{{$t('org.Remove')}}</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'RemoveMember',
  props: {
    memberDetail: {
      required: true,
      type: Object
    },
    classId: Number,
    roleId: {
      validator: function(value) {
        return [1, 2].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      currentOrgId: 'org/currentOrgId'
    })
  },
  methods: {
    ...mapActions({
      getOrgTeacherList: 'org/getOrgTeacherList',
      orgCreateNewMember: 'org/createNewMember',
      orgRemoveMemberFromClass: 'org/removeMemberFromClass'
    }),
    async removeMemberFromClass() {
      await this.orgRemoveMemberFromClass({
        memberId: this.memberDetail.memberId,
        roleId: this.roleId,
        classId: this.classId
      }).catch(() => {
        this.$message({ type:'error', message:'移除失败，请重试' })
      })
    },
    async removeMemberFromAllClass() {
      let memberDetail = this.memberDetail
      await this.orgCreateNewMember({
        organizationId: this.currentOrgId,
        classIds: [],
        memberName: memberDetail.username,
        realname: memberDetail.realname,
        roleId: memberDetail.roleId
      }).catch(() => {})
    },
    async removeMember() {
      this.isLoading = true
      if (this.classId && this.roleId) {
        await this.removeMemberFromClass()
      } else {
        await this.removeMemberFromAllClass()
      }
      await this.getOrgTeacherList({
        organizationId: this.currentOrgId
      }).catch(() => {})
      this.isLoading = false
      this.$emit('finish')
    },
    confirmRemoveMember() {
      let memberDetail = this.memberDetail
      this.$confirm(
        `${this.$t('org.delConfirm')} ${memberDetail.realname}?`,
        this.$t('org.deleteWarining'),
        {
          confirmButtonText: this.$t('common.Sure'),
          cancelButtonText: this.$t('common.Cancel'),
          type: 'warning'
        }
      ).then(() => {
        this.removeMember()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.remove-member {
  display: inline-block;
  padding: 0 20px;
  height: 20px;
  line-height: 18px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid;
  border-radius: 4px;
}
</style>
