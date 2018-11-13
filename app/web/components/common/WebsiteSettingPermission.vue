<template>
  <div class="website-setting-permission" v-loading='isLoading'>
    <div class="website-setting-permission-type">
      <h1><span class="website-setting-permission-index-label">1</span>网站类型</h1>
      <div class="website-setting-permission-type-main">
        <div class="website-setting-permission-type-item">
          <el-radio v-model="siteVisibility" :label="0">共有网站</el-radio>
          <p>默认允许大多数人访问，即使他们没有登录。可以为部分人设定编辑权限，使他们成为了参与编辑的管理员；还可以为部分人设定拒绝权限，则将他们加入黑名单（如果他们登录的话）。</p>
        </div>
        <div class="website-setting-permission-type-item">
          <el-radio v-model="siteVisibility" :label="1">私有网站</el-radio>
          <p>默认不允许未登录用户浏览。可以为部分人设定编辑权限，使他们成为了参与编辑的管理员；可以为部分人设定浏览权限，则他们可以浏览您创建的内容，其他未授权用户均无法浏览。</p>
        </div>
      </div>
    </div>
    <div class="website-setting-permission-group">
      <h1><span class="website-setting-permission-index-label">2</span>分组管理</h1>
      <div class="website-setting-permission-group-main">
        <div class="website-setting-permission-group-button-row">
          <el-button round size="small" @click="showNewGroupDialog">新建组</el-button>
        </div>
        <el-table :data="userGroups" border style="width: 100%">
          <el-table-column label="分组名" width="96" fixed>
            <template slot-scope="scope">
              <span :title="scope.row.groupname">{{scope.row.groupname}}</span>
            </template>
          </el-table-column>
          <el-table-column label="成员">
            <template slot-scope="scope">
              <span v-for="(member, index) in scope.row.members" :key="index">{{member.nickname || member.username}}, </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="76" fixed="right">
            <template slot-scope="scope">
              <span class="iconfont icon-edit__" @click="editGroup(scope.row)"></span>
              <span class="iconfont icon-delete" @click="deleteGroup(scope.row)"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="website-setting-permission-auth">
      <h1><span class="website-setting-permission-index-label">3</span>授权管理</h1>
      <div class="website-setting-permission-auth-main">
        <p>*权限管理按照从严原则，如果一个账号同时存在于几个权限分组，则按照最严格计算。</p>
        <p>例如：某用户同时存在于"编辑"权限与"禁止访问"权限的2个组，则会禁止访问</p>
        <p>*网站拥有者不受分组配置影响</p>
        <el-form ref="form" :model="tempAuth" label-width="80px">
          <el-form-item label="选择分组">
            <el-select v-model="tempAuth.groupId">
              <el-option v-for="(group, index) in userGroups" :key="index" :label='group.groupname' :value="group.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设定权限">
            <el-select v-model="tempAuth.level">
              <el-option label="拒绝" :value="0"></el-option>
              <el-option label="浏览" :value="32"></el-option>
              <el-option label="编辑" :value="64"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="website-setting-permission-auth-operations">
            <el-button @click="addAuth" :disabled="isNewAuthButtonDisabled">添加授权</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="siteGroups" border style="width: 100%">
          <el-table-column prop="name" label="分组名" width="96">
          </el-table-column>
          <el-table-column prop="auth" label="权限">
          </el-table-column>
          <el-table-column label="操作" width="46">
            <template slot-scope="scope">
              <span class="iconfont icon-delete"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="website-setting-permission-operations-col">
      <dialog-operations @close='handleClose'></dialog-operations>
    </div>
    <el-dialog class="website-setting-permission-create-group" :visible.sync="isNewGroupDialogShow" width="768px" :before-close="handleNewGroupDialogClose" append-to-body>
      <site-new-group :editingGroupData='editingGroupData' @close='handleNewGroupDialogClose'></site-new-group>
    </el-dialog>
  </div>
</template>

<script>
import DialogOperations from './DialogOperations'
import SiteNewGroup from './SiteNewGroup'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'WebsiteSettingPermission',
  props: {
    siteDetail: {
      type: Object,
      required: true
    },
    sitePath: String
  },
  async mounted() {
    await this.userGetUserGroups()
    let siteId = this.siteId
    await this.userGetSiteGroupsBySiteId({ siteId })
    this.originSiteGroups = _.cloneDeep(this.getSiteGroupsById({ siteId }))
    this.tempGroups = _.cloneDeep(this.originSiteGroups)
  },
  data() {
    return {
      isLoading: false,
      siteGroups: [
        {
          name: 'apv4',
          members: 'member1, member2'
        },
        {
          name: 'git4',
          members: ''
        }
      ],
      tempAuth: {
        groupId: undefined,
        level: undefined
      },
      originSiteGroups: [],
      tempGroups: [],
      siteVisibility: this.siteDetail.visibility,
      isNewGroupDialogShow: false,
      editingGroupData: undefined
    }
  },
  computed: {
    ...mapGetters({
      getSiteGroupsById: 'user/getSiteGroupsById',
      userGroups: 'user/userGroups'
    }),
    siteId() {
      return _.get(this.siteDetail, 'id')
    },
    isNewAuthButtonDisabled() {
      return (
        _.isUndefined(this.tempAuth.groupId) ||
        _.isUndefined(this.tempAuth.level)
      )
    }
  },
  methods: {
    ...mapActions({
      userGetSiteGroupsBySiteId: 'user/getSiteGroupsBySiteId',
      userGetUserGroups: 'user/getUserGroups',
      userCreateSiteGroup: 'user/createSiteGroup',
      userDeleteGroup: 'user/deleteGroup'
    }),
    async addAuth() {
      let { groupId, level } = this.tempAuth
      await this.userCreateSiteGroup({
        siteId: this.siteId,
        groupId,
        level
      }).then(() => {
        this.$message({
          type: 'success',
          message: '添加授权成功'
        })
        this.tempAuth = {
          groupId: undefined,
          level: undefined
        }
      })
    },
    handleClose() {
      this.$emit('close')
    },
    editGroup(groupData) {
      this.editingGroupData = groupData
      this.showNewGroupDialog()
    },
    showNewGroupDialog() {
      this.isNewGroupDialogShow = true
    },
    deleteGroup(groupData) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.isLoading = true
          await this.userDeleteGroup({ id: groupData.id })
          this.isLoading = false
        })
        .catch(() => {})
    },
    async handleNewGroupDialogClose() {
      this.editingGroupData = undefined
      this.isNewGroupDialogShow = false
    }
  },
  components: {
    DialogOperations,
    SiteNewGroup
  }
}
</script>

<style lang='scss'>
.website-setting-permission {
  display: flex;
  height: 100%;
  h1 {
    margin: 46px 0 40px 16px;
    font-size: 22px;
    color: #51515b;
  }
  &-index-label {
    width: 32px;
    height: 32px;
    background-color: #c0c4cc;
    display: inline-block;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    font-size: 14px;
    line-height: 32px;
    margin-right: 8px;
    vertical-align: top;
  }
  &-type {
    width: 22.24%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    p {
      font-weight: lighter;
      margin: 16px 0 0;
    }
    &-main {
      flex: 1;
      padding: 0 16px;
      border-right: 1px solid #cdd4db;
    }
    &-item {
      margin-bottom: 44px;
    }
    &-item:last-child {
      margin-bottom: 0;
    }
    .el-radio__label {
      color: #303133;
      padding-left: 6px;
      font-weight: bold;
    }
  }
  &-group {
    width: 35.86%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    &-main {
      flex: 1;
      padding: 0 16px;
      border-right: 1px solid #cdd4db;
    }
    &-button-row {
      text-align: right;
      margin-bottom: 12px;
      .el-button {
        color: #1989fa;
        border-color: #1989fa;
        font-size: 16px;
        padding: 7px 25px;
      }
    }
  }
  &-auth {
    flex: 1;
    overflow: hidden;
    border-right: 15px solid #cdd4db;
    p {
      font-size: 12px;
      margin: 6px 0;
    }
    &-main {
      padding: 0 16px;
    }
    &-operations {
      text-align: right;
    }
    .el-form {
      margin: 16px 0;
    }
    .el-form-item {
      margin-bottom: 8px;
    }
    .el-button {
      font-size: 14px;
      padding: 8px 21px;
      border-radius: 32px;
    }
    .el-button:not(.is-disabled) {
      color: #1989fa;
      border-color: #1989fa;
    }
  }
  .el-table {
    th {
      background-color: #f5f5f5;
      color: #000;
    }
    .cell {
      padding: 0 8px;
      white-space: nowrap;
    }
    .iconfont {
      display: inline-block;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      text-align: center;
      line-height: 26px;
      cursor: pointer;
    }
    .icon-edit__:hover {
      background-color: #2989fa;
      color: #fff;
    }
    .icon-delete:hover {
      background-color: #ff4948;
      color: #fff;
    }
  }
  &-operations-col {
    width: 120px;
    text-align: center;
    align-self: flex-end;
  }
  &-create-group {
    .el-dialog__headerbtn {
      top: 14px;
      right: 18px;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
