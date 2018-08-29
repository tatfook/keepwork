<template>
  <div class="package-basic-info">
    <div class="package-basic-info-row">
      <div class="package-basic-info-subject-and-ages">
        <div class="package-basic-info-subject">
          <label class="package-basic-info-label" for="subjectSelector">科目</label>
          <el-select size="mini" v-model="newPackageDetail.subjectId">
            <el-option v-for="item in lessonSubjects" :key="item.id" :label="item.subjectName" :value="item.id">
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
            <el-input-number class="package-basic-info-age-input" v-model="tempMinAge" :min="1" :max="tempMaxAge" :controls='false' @change='changeMinAgeValue'></el-input-number>
            <span class="package-basic-info-age-operate">-</span>
            <el-input-number class="package-basic-info-age-input" v-model="tempMaxAge" :min="tempMinAge" :max="100" @change='changeMaxAgeValue' :controls='false'></el-input-number>
          </div>
        </div>
      </div>
      <div class="package-basic-info-name-intro-price">
        <div class="package-basic-info-name-intro">
          <div class="package-basic-info-name">
            <label class="package-basic-info-label" for="nameInput">名称</label>
            <el-input id="nameInput" v-model="newPackageDetail.packageName" @blur='trimPackageName'></el-input>
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'PackageBasicInfo',
  async mounted() {
    await this.lessonGetAllSubjects({})
    this.newPackageDetail.subjectId = this.lessonSubjects[0].id
  },
  data() {
    return {
      fitAgeType: 'all', //all or custom
      tempMinAge: 1,
      tempMaxAge: 30,
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
  computed: {
    ...mapGetters({
      lessonSubjects: 'lesson/subjects'
    })
  },
  methods: {
    ...mapActions({
      lessonGetAllSubjects: 'lesson/getAllSubjects'
    }),
    trimPackageName() {
      let oldPackageName = this.newPackageDetail.packageName
      this.newPackageDetail.packageName = _.trim(oldPackageName)
    },
    handleFitAgeTypeChange(value) {
      switch (value) {
        case 'all':
          this.newPackageDetail.minAge = 0
          this.newPackageDetail.maxAge = 0
          break
        case 'custom':
          this.newPackageDetail.minAge = this.tempMinAge
          this.newPackageDetail.maxAge = this.tempMaxAge
          break
        default:
          break
      }
    },
    changeMinAgeValue(minAge) {
      this.newPackageDetail.minAge = minAge
    },
    changeMaxAgeValue(maxAge) {
      this.newPackageDetail.maxAge = maxAge
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
    line-height: 24px;
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
    line-height: 24px;
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
    .el-input__inner {
      font-size: 12px;
      color: #414141;
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
      color: #414141;
      font-size: 12px;
      border-color: #ccc;
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
  .el-input-number.is-without-controls .el-input__inner {
    padding: 0 10px;
  }
}
</style>
