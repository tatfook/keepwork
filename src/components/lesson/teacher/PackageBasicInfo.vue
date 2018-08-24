<template>
  <div class="package-basic-info">
    <div class="package-basic-info-row">
      <div class="package-basic-info-subject-and-ages">
        <div class="package-basic-info-subject">
          <label class="package-basic-info-label" for="subjectSelector">科目</label>
          <el-select size="mini" v-model="newPackageDetail.subjectId" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="package-basic-info-ages">
          <label class="package-basic-info-label">年龄</label>
          <el-radio-group v-model="fitAgeType" @change="handleFitAgeTypeChange">
            <el-radio label="all">所有人群</el-radio>
            <el-radio label="custom">自定义</el-radio>
          </el-radio-group>
          <div class="package-basic-info-custom" v-show="fitAgeType==='custom'">
            <el-input class="package-basic-info-age-input" v-model="newPackageDetail.minAge"></el-input>
            <span class="package-basic-info-age-operate">-</span>
            <el-input class="package-basic-info-age-input" v-model="newPackageDetail.maxAge"></el-input>
          </div>
        </div>
      </div>
      <div class="package-basic-info-name-intro-price">
        <div class="package-basic-info-name-intro">
          <div class="package-basic-info-name">
            <label class="package-basic-info-label" for="nameInput">名称</label>
            <el-input id="nameInput" v-model="newPackageDetail.packageName"></el-input>
          </div>
          <div class="package-basic-info-intro">
            <label class="package-basic-info-label" for="introInput">简介</label>
            <el-input type="textarea" id="introInput" resize='none' v-model="newPackageDetail.intro"></el-input>
          </div>
        </div>
        <div class="package-basic-info-price">
          <label class="package-basic-info-label" for="priceInput">价格</label>
          <el-input id="priceInput" placeholder="请输入内容" v-model="newPackageDetail.rmb">
            <template slot="prepend">￥</template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PackageBasicInfo',
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
      fitAgeType: 'all', //all or custom
      newPackageDetail: {
        subjectId: null,
        minAge: 0,
        maxAge: 0,
        packageName: '',
        intro: '',
        rmb: 0
      }
    }
  },
  methods: {
    handleFitAgeTypeChange(value) {
      switch (value) {
        case 'all':
          this.newPackageDetail.minAge = 0
          this.newPackageDetail.maxAge = 0
          break
        case 'custom':
          this.newPackageDetail.minAge = null
          this.newPackageDetail.maxAge = null
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="scss">
.package-basic-info {
  background-color: #fff;
  padding: 26px 36px;
  font-size: 14px;
  color: #414141;
  &-label {
    font-weight: bold;
    margin: 0 12px 10px 0;
    display: inline-block;
  }
  &-subject-and-ages {
    display: flex;
    align-items: center;
    margin-bottom: 60px;
    .el-radio + .el-radio {
      margin-left: 40px;
    }
  }
  &-custom {
    display: inline-block;
    margin-left: 18px;
  }
  &-age-input {
    width: 46px;
    .el-input__inner {
      height: 24px;
      line-height: 24px;
      padding: 0 7px;
      text-align: center;
    }
  }
  &-subject {
    margin-right: 86px;
    .el-select {
      width: 132px;
    }
  }
  &-name-intro-price {
    display: flex;
  }
  &-name-intro {
    width: 500px;
    padding-right: 20px;
    box-sizing: border-box;
    border-right: 1px solid #b9bcc2;
  }
  &-intro {
    margin-top: 36px;
    .el-textarea__inner {
      height: 150px;
      color: #999;
    }
  }
  &-price {
    width: 150px;
    margin-left: 30px;
    .el-input-group__prepend {
      padding: 0 12px;
      color: #333;
      background-color: #eee;
      border-color: #ccc;
    }
  }
  .el-input__inner {
    border-color: #ccc;
  }
}
</style>
