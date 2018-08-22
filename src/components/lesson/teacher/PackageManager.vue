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
        <el-table-column prop="id" label="No." width="70">
        </el-table-column>
        <el-table-column prop="name" label="name">
        </el-table-column>
        <el-table-column prop="subject" label="Subject" width="190">
        </el-table-column>
        <el-table-column prop="status" label="Status" width="150">
        </el-table-column>
        <el-table-column prop="operations" label="" width="160">
          <template class="package-manager-table-icon" slot-scope="scope">
            <i class="iconfont icon-submit"></i>
            <i class="iconfont icon-edit--"></i>
            <i class="iconfont icon-delete1"></i>
            <i class="iconfont icon-Release"></i>
            <i class="iconfont icon-recall"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PackageManager',
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
      status: '',
      filteredPackageList: [
        {
          id: 1,
          name: 'Enjoy the beauty of your youth',
          subject: 'Computer Science',
          status: 'Not submitted'
        },
        {
          id: 2,
          name: 'Enjoy the beauty of your youth',
          subject: 'Computer Science',
          status: 'Rejected'
        },
        {
          id: 3,
          name: 'Enjoy the beauty of your youth',
          subject: 'Computer Science',
          status: 'Pending review'
        },
        {
          id: 4,
          name: 'Enjoy the beauty of your youth',
          subject: 'Computer Science',
          status: 'Approved'
        },
        {
          id: 5,
          name: 'Enjoy the beauty of your youth',
          subject: 'Computer Science',
          status: 'Disabled'
        }
      ]
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
        width: 100px;
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
    }
    td,
    th.is-leaf {
      border-color: #d2d2d2;
    }
    .iconfont {
      font-size: 20px;
      line-height: 1;
      color: #b3b3b3;
      margin-right: 30px;
    }
  }
}
</style>
