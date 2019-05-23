<template>
  <div class="package-basic-info">
    <div class="package-basic-info-row">
      <div class="package-basic-info-subject-and-ages">
        <div class="package-basic-info-subject">
          <label class="package-basic-info-label" for="subjectSelector">{{$t('lesson.packageManage.Subject')}}</label>
          <el-select :disabled="!isEditable" size="mini" v-model="newPackageDetail.subjectId">
            <el-option v-for="item in lessonSubjects" :key="item.id" :label="subjectName(item)" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="package-basic-info-ages">
          <label class="package-basic-info-label">{{$t('lesson.packageManage.Age')}}</label>
          <el-radio-group :disabled="!isEditable" v-model="fitAgeType" @change="handleFitAgeTypeChange">
            <el-radio label="all">{{$t('lesson.packageManage.SuitableForAll')}}</el-radio>
            <el-radio label="custom">{{$t('lesson.packageManage.Customize')}}</el-radio>
          </el-radio-group>
          <div class="package-basic-info-custom" v-show="fitAgeType==='custom'">
            <el-input-number :disabled="!isEditable" class="package-basic-info-age-input" v-model="tempMinAge" :min="1" :max="tempMaxAge" :controls='false' @change='changeMinAgeValue'></el-input-number>
            <span class="package-basic-info-age-operate">-</span>
            <el-input-number :disabled="!isEditable" class="package-basic-info-age-input" v-model="tempMaxAge" :min="tempMinAge" :max="100" @change='changeMaxAgeValue' :controls='false'></el-input-number>
          </div>
        </div>
      </div>
      <div class="package-basic-info-name-intro-price">
        <div class="package-basic-info-name-intro">
          <div class="package-basic-info-name">
            <label class="package-basic-info-label" for="nameInput">{{$t('lesson.nameLabel')}}</label>
            <el-input :class="{'package-basic-info-name-intro-success': isSubmitPressed && !isPackageNameEmpty, 'package-basic-info-name-intro-error': isSubmitPressed && isPackageNameEmpty}" :disabled="!isEditable" id="nameInput" :maxlength='255' v-model="newPackageDetail.packageName" @blur='trimPackageName'></el-input>
          </div>
          <div class="package-basic-info-intro">
            <label class="package-basic-info-label" for="introInput">{{$t('lesson.intro')}}</label>
            <el-input :class="{'package-basic-info-name-intro-success': isSubmitPressed && !isIntroEmpty, 'package-basic-info-name-intro-error': isSubmitPressed && isIntroEmpty}" :disabled="!isEditable" type="textarea" id="introInput" :maxlength='512' resize='none' v-model="newPackageDetail.intro"></el-input>
          </div>
        </div>
        <div class="package-basic-info-price">
          <label class="package-basic-info-label" for="priceInput">{{$t('lesson.packageManage.priceLabel')}}</label>
          <div class="package-basic-info-price-input">
            <span class="package-basic-info-price-prepend">￥</span>
            <el-input-number :disabled="!isEditable" v-model="newPackageDetail.rmb" :min="0" :controls='false'></el-input-number>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import colI18n from '@/lib/utils/i18n/column'

export default {
  name: 'PackageBasicInfo',
  props: {
    editingPackageDetail: Object,
    isEditable: {
      type: Boolean,
      default: true
    },
    isSubmitPressed: {
      type: Boolean,
      default: false
    },
    isEditing: Boolean
  },
  async mounted() {
    await this.lessonGetAllSubjects({})
    if (this.isEditing) {
      let editingPackageDetail = this.editingPackageDetail
      let { minAge, maxAge } = editingPackageDetail
      if (minAge !== 0 || maxAge !== 0) {
        this.fitAgeType = 'custom'
        this.tempMinAge = minAge
        this.tempMaxAge = maxAge
      }
      this.newPackageDetail = _.clone(editingPackageDetail)
    } else {
      this.newPackageDetail.subjectId = this.lessonSubjects[0].id
    }
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
    }),
    isPackageNameEmpty() {
      let packageName = _.get(this.newPackageDetail, 'packageName')
      return !packageName || packageName == ''
    },
    isIntroEmpty() {
      let intro = _.get(this.newPackageDetail, 'intro')
      return !intro || intro == ''
    }
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
    },
    subjectName(subject) {
      return colI18n.getLangValue(subject, 'subjectName')
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
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }
  }
  &-price {
    width: 150px;
    margin-left: 30px;
    &-input {
      display: flex;
    }
    &-prepend {
      line-height: 38px;
      padding: 0;
      width: 38px;
      text-align: center;
      flex-shrink: 0;
      color: #333;
      background-color: #eee;
      border: 1px solid #ccc;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .el-input-number {
      width: 100%;
      .el-input__inner {
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        text-align: left;
        color: #999;
      }
    }
  }
  .el-input__inner {
    border-color: #ccc;
    font-size: 12px;
  }
  .el-input-number.is-without-controls .el-input__inner {
    padding: 0 10px;
  }
  &-name-intro {
    &-success {
      .el-input__inner, .el-textarea__inner {
        border-color: #67c23a;
      }
    }
    &-error {
      .el-input__inner, .el-textarea__inner {
        border-color: #f56c6c;
      }
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .package-basic-info {
    padding: 16px;
    &-subject-and-ages {
      display: block;
      margin-bottom: 8px;
    }
    &-name-intro-price {
      display: block;
    }
    &-name-intro {
      width: 100%;
      border-right: none;
    }
    &-intro {
      margin-top: 16px;
    }
    &-price {
      margin: 16px 0 0;
    }
  }
}
</style>
