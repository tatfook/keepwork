<template>
  <div class="website-setting-permission">
    <div class="website-setting-permission-type">
      <h1><span class="website-setting-permission-index-label">1</span>网站类型</h1>
      <div class="website-setting-permission-type-main">
        <div class="website-setting-permission-type-item">
          <el-radio v-model="siteVisibility" label="public">共有网站</el-radio>
          <p>默认允许大多数人访问，即使他们没有登录。可以为部分人设定编辑权限，使他们成为了参与编辑的管理员；还可以为部分人设定拒绝权限，则将他们加入黑名单（如果他们登录的话）。</p>
        </div>
        <div class="website-setting-permission-type-item">
          <el-radio v-model="siteVisibility" label="private">私有网站</el-radio>
          <p>默认不允许未登录用户浏览。可以为部分人设定编辑权限，使他们成为了参与编辑的管理员；可以为部分人设定浏览权限，则他们可以浏览您创建的内容，其他未授权用户均无法浏览。</p>
        </div>
      </div>
    </div>
    <div class="website-setting-permission-group">
      <h1><span class="website-setting-permission-index-label">2</span>分组管理</h1>
      <div class="website-setting-permission-group-main">
        <div class="website-setting-permission-group-button-row">
          <el-button round size="small">新建组</el-button>
        </div>
        <el-table :data="siteGroups" border style="width: 100%">
          <el-table-column prop="name" label="分组名" width="96" fixed>
          </el-table-column>
          <el-table-column prop="members" label="成员">
          </el-table-column>
          <el-table-column label="操作" width="76" fixed="right">
            <template slot-scope="scope">
              <span class="iconfont icon-edit__"></span>
              <span class="iconfont icon-delete"></span>
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
            <el-select v-model="tempAuth.group">
              <el-option label="分组一" value="shanghai"></el-option>
              <el-option label="分组二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择分组">
            <el-select v-model="tempAuth.auth">
              <el-option label="浏览" value="shanghai"></el-option>
              <el-option label="拒绝" value="beijing"></el-option>
              <el-option label="编辑" value="edit"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="website-setting-permission-auth-operations">
            <el-button @click="addAuth">添加授权</el-button>
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
  </div>
</template>

<script>
import DialogOperations from './DialogOperations'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'WebsiteSettingPermission',
  props: {
    sitePath: String
  },
  data() {
    return {
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
      tempAuth: {},
      siteVisibility: 'public'
    }
  },
  computed: {
    ...mapGetters({})
  },
  async mounted() {},
  methods: {
    ...mapActions({}),
    addAuth() {},
    handleClose() {
      this.$emit('close')
    }
  },
  components: {
    DialogOperations
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
}
</style>
