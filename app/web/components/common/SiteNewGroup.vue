<template>
  <div class="site-new-group">
    <div class="site-new-group-title">添加</div>
    <el-form label-position="right" label-width="98px" :model="newGroupData">
      <el-form-item label="分组名:">
        <el-input v-model="newGroupData.groupname"></el-input>
        <p class="site-new-group-info">* 分组名称仅支持英文、数字</p>
      </el-form-item>
      <el-form-item label="成员:">
        <div>
          <el-input v-model="newMembers" type="textarea" resize='none'></el-input>
          <el-button class="site-new-group-add-button" :disabled="!newMembers" @click="addNewMember">添加</el-button>
        </div>
        <p class="site-new-group-info">* 可同时添加多名成员，用户名之间以英文半角逗号(,)隔开</p>
        <div class="site-new-group-tags">
          <el-tag v-for="(member, index) in memberTags" :key="index" closable type="info" @close="removeMember(member)">
            {{member.username}}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item class="site-new-group-operations">
        <el-button type="primary" :disabled="!newGroupData.groupname" @click="createNewGroup">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'SiteNewGroup',
  data() {
    return {
      isAddingButtonLoading: false,
      memberTags: [],
      newMembers: '',
      newGroupData: {
        groupname: '',
        members: []
      }
    }
  },
  methods: {
    ...mapActions({
      userCreateNewGroup: 'user/createNewGroup',
      userAddMemberToGroup: 'user/addMemberToGroup',
      getUsersDetailByUsernames: 'user/getUsersDetailByUsernames'
    }),
    async addNewMember() {
      this.isAddingButtonLoading = true
      let addingMembers = await this.getUsersDetailByUsernames({
        username: {
          $in: this.newMembers.split(',')
        }
      }).catch()
      addingMembers = _.get(addingMembers, 'rows', [])
      _.map(addingMembers, member => {
        let findedIndex = _.findIndex(this.memberTags, {
          username: member.username
        })
        if (findedIndex === -1) {
          this.memberTags.push(member)
        }
      })
      this.saveMemberData()
      this.isAddingButtonLoading = false
      this.newMembers = ''
    },
    saveMemberData() {
      this.newGroupData.members = _.map(this.memberTags, 'id')
    },
    removeMember(member) {
      this.memberTags.splice(this.memberTags.indexOf(member), 1)
    },
    async createNewGroup() {
      await this.userCreateNewGroup(this.newGroupData).catch()
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.site-new-group {
  padding: 2px 24px 24px 32px;
  &-title {
    font-size: 16px;
    color: #000;
    line-height: 1;
    margin-bottom: 22px;
  }
  &-add-button {
    font-size: 16px;
    padding: 7px 33px;
    border-radius: 32px;
    vertical-align: top;
    border-color: #1989fa;
    color: #1989fa;
    margin-left: 8px;
  }
  &-info {
    margin: 8px 0 0;
    line-height: 1;
    color: #515158;
  }
  &-operations {
    text-align: right;
    margin: 96px 0 0;
  }
  .el-form-item__label {
    color: #333;
  }
  .el-input {
    width: 435px;
  }
  .el-textarea {
    width: 435px;
  }
  .el-textarea__inner {
    height: 98px;
  }
  .el-tag {
    border-radius: 32px;
    margin-right: 11px;
    margin-top: 54px;
    padding: 0 32px;
    font-size: 14px;
    .el-icon-close {
      width: 22px;
      height: 22px;
      background-color: #c0c4cc;
      color: #000;
      font-weight: bold;
      line-height: 22px;
      display: none;
      position: absolute;
      right: 4px;
      top: 4px;
    }
    &:hover {
      padding: 0 50px 0 14px;
      position: relative;
      .el-icon-close {
        display: inline-block;
      }
    }
  }
}
</style>
