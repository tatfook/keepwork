<template>
  <div class="user-certificate">
    <el-card class="user-certificate-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>我的证书</span>
        <el-button v-show="!isCertificateEmpty" class="user-certificate-card-header-button" type="text" @click="showAddingDialog">添加</el-button>
      </div>
      <div class="user-certificate-list" v-if="!isCertificateEmpty">
        <div class="user-certificate-item" v-for="(certificate, index) in userCertifications" :key="index">
          <span class="user-certificate-item-title">{{certificate.title}}</span>
          <span class="user-certificate-item-date">{{certificate.date}}</span>
          <div class="user-certificate-item-operations">
            <el-button type="text">
              <i class="iconfont icon-edit-square"></i>编辑
            </el-button>
            <el-button type="text">
              <i class="iconfont icon-delete1"></i>删除
            </el-button>
          </div>
        </div>
      </div>
      <div class="user-certificate-empty" v-if="isCertificateEmpty">
        <img src="@/assets/img/default_certificate.png" alt="">
        <p><span class="user-certificate-empty-anchor">添加</span>个人证书，展现更好的自己</p>
      </div>
    </el-card>
    <el-dialog title="添加证书" :visible.sync="isAddingDialogVisible" width="416px" class="user-certificate-adding-dialog" :before-close="handleAddingDialogClose">
      <el-form label-position="top" :model="newCertificate">
        <el-form-item label="名称">
          <el-input v-model="newCertificate.title"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="newCertificate.date" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="技能描述">
          <el-input type="textarea" resize="none" v-model="newCertificate.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddingDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddExperience">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UserCertificates',
  data() {
    return {
      isCertificateEmpty: false,
      isAddingDialogVisible: false,
      newCertificate: {
        title: '',
        date: '',
        description: ''
      },
      userCertifications: [
        {
          title: '普通话二级一等',
          date: '2014 / 5'
        },
        {
          title: '全国摄影大赛一等奖全国摄影大赛一等奖',
          date: '2014 / 5'
        },
        {
          title: '驾驶证',
          date: '2014 / 5'
        },
        {
          title: '英语六级',
          date: '2014 / 5'
        }
      ]
    }
  },
  methods: {
    showAddingDialog() {
      this.isAddingDialogVisible = true
    },
    handleAddingDialogClose() {
      this.isAddingDialogVisible = false
    },
    handleAddExperience() {
      this.handleAddingDialogClose()
    }
  },
  props: {},
  filters: {}
}
</script>
<style lang="scss">
.user-certificate {
  &-card {
    .el-card__header {
      font-weight: bold;
      padding: 18px 16px;
    }
    .el-card__body {
      padding: 24px 16px;
    }
    &-header {
      &-button {
        float: right;
        padding: 3px 0;
        font-size: 12px;
        color: #909399;
      }
      &-button + &-button {
        margin-right: 6px;
      }
    }
  }
  &-list {
    font-size: 14px;
    color: #555;
  }
  &-item {
    margin-bottom: 8px;
    display: flex;
    position: relative;
    &:last-child {
      margin-bottom: 0;
    }
    &-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-date {
      font-size: 12px;
      color: #909399;
      margin-left: 8px;
    }
    &-operations {
      position: absolute;
      right: 0;
      background-color: #fff;
      display: none;
      .el-button {
        padding: 0;
        font-size: 12px;
        color: #909399;
      }
      .el-button + .el-button {
        margin-left: 4px;
      }
    }
    &:hover &-operations {
      display: inline-block;
    }
  }
  &-empty {
    color: #909399;
    font-size: 14px;
    text-align: center;
    &-anchor {
      color: #2397f3;
      cursor: pointer;
    }
  }
  &-adding-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #e8e8e8;
      padding: 16px;
    }
    .el-dialog__title {
      font-size: 16px;
      font-weight: bold;
    }
    .el-dialog__body {
      padding: 24px 16px 0;
    }
    .el-form--label-top .el-form-item__label {
      line-height: 1;
    }
    .el-form-item {
      margin-bottom: 24px;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-textarea__inner {
      height: 96px;
    }
    .el-button {
      width: 88px;
      height: 36px;
      line-height: 36px;
      padding: 0 16px;
    }
  }
}
</style>
