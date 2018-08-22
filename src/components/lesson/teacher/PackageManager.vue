<template>
  <div class="package-manager">
    <div class="package-manager-overview">
      <div class="package-manager-total">Packages: 10</div>
      <el-button type="primary" class="package-manager-new-button">
        <i class="iconfont icon-add"></i>New Package
      </el-button>
    </div>
    <div class="package-manager-selector">
      <div class="package-manager-selector-item">
        <label for="subjectSelector">Subject</label>
        <el-select id="subjectSelector" v-model="subject" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="package-manager-selector-item">
        <label for="statusSelector">Status</label>
        <el-select id="statusSelector" v-model="status" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="package-manager-selector-item package-manager-selector-box">
        <el-input class="package-manager-selector-search-box" placeholder="请输入内容" suffix-icon="el-icon-search" v-model="searchName">
        </el-input>
      </div>
    </div>
    <div class="package-manager-details">
      <el-table class="package-manager-table" :data="filteredPackageList" height="450" style="width: 100%">
        <el-table-column type="index" label="No." width="70">
        </el-table-column>
        <el-table-column prop="packageName" label="name">
        </el-table-column>
        <el-table-column prop="subjectId" label="Subject" width="190">
        </el-table-column>
        <el-table-column label="Status" width="125">
          <template slot-scope="scope">{{getStatusText(scope.row)}}</template>
        </el-table-column>
        <el-table-column label="" width="180" class-name="package-manager-table-operations">
          <template slot-scope="scope">
            <i v-if="isSubmitable(scope.row)" class="iconfont icon-submit"></i>
            <i v-if="isEditable(scope.row)" class="iconfont icon-edit--"></i>
            <i v-if="isDeletable(scope.row)" class="iconfont icon-delete1"></i>
            <i v-if="isReleasable(scope.row)" class="iconfont icon-Release"></i>
            <i v-if="isRevocable(scope.row)" class="iconfont icon-recall"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'PackageManager',
  async mounted() {
    await this.lessonGetUserPackages({})
  },
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      searchName: '',
      subject: '',
      status: ''
    }
  },
  computed: {
    ...mapGetters({
      lessonUserPackages: 'lesson/userPackages'
    }),
    filteredPackageList() {
      return this.lessonUserPackages
    }
  },
  methods: {
    ...mapActions({
      lessonGetUserPackages: 'lesson/getUserPackages'
    }),
    getStatusText(packageDetail) {
      let statusText = ''
      switch (packageDetail.state) {
        case 0:
          statusText = 'Not submitted'
          break
        case 1:
          statusText = 'Pending review'
          break
        case 2:
          statusText = 'Approved'
          break
        case 3:
          statusText = 'Reject'
          break
        case 4:
          statusText = 'Disabled'
          break
        default:
          break
      }
      return statusText
    },
    isSubmitable(packageDetail) {
      return (
        packageDetail.state === 0 ||
        packageDetail.state === 3 ||
        packageDetail.state === 4
      )
    },
    isEditable(packageDetail) {
      return packageDetail.state != 1
    },
    isDeletable(packageDetail) {
      return (
        packageDetail.state === 0 ||
        packageDetail.state === 3 ||
        packageDetail.state === 4
      )
    },
    isReleasable(packageDetail) {
      return packageDetail.state === 2
    },
    isRevocable(packageDetail) {
      return packageDetail.state === 1
    }
  }
}
</script>
<style lang="scss">
.package-manager {
  padding-top: 48px;
  &-overview {
    margin-bottom: 20px;
    display: flex;
    align-items: flex-end;
  }
  &-total {
    flex: 1;
    color: #333;
    font-size: 22px;
    font-weight: bold;
  }
  &-new-button {
    font-size: 18px;
    font-weight: bold;
    padding: 16px 15px;
    width: 266px;
    i {
      margin-right: 9px;
      font-weight: normal;
      font-size: 22px;
      vertical-align: middle;
    }
  }
  &-selector {
    margin-bottom: 20px;
    background-color: #fff;
    text-align: center;
    font-size: 14px;
    color: #b3b3b3;
    padding: 22px 0;
    &-item {
      display: inline-block;
      margin-right: 86px;
      .el-select {
        width: 120px;
        margin-left: 8px;
        .el-select__caret.is-reverse {
          line-height: 0;
          top: -6px;
          position: relative;
        }
      }
    }
    &-item:last-child {
      margin-right: 0;
    }
    &-box {
      width: 166px;
    }
    .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
    .el-input__suffix {
      top: 6px;
    }
    &-search-box {
      .el-input__inner {
        border-radius: 28px;
        background-color: #f2f8ff;
      }
      .el-input__suffix {
        top: 0;
      }
      .el-input__icon {
        line-height: 28px;
      }
    }
  }
  &-details {
    padding: 10px 20px;
    background-color: #fff;
  }
  &-table {
    border: 1px solid #d2d2d2;
    tr,
    th {
      text-align: center;
      color: #414141;
    }
    td,
    th.is-leaf {
      border-color: #d2d2d2;
      padding: 11px 0;
    }
    th.is-leaf {
      padding: 15px 0;
    }
    .iconfont {
      font-size: 20px;
      color: #b3b3b3;
      margin-right: 30px;
    }
    .iconfont:last-child {
      margin-right: 0;
    }
    &-operations {
      text-align: right;
      .cell {
        padding: 0 20px;
      }
    }
  }
}
</style>
