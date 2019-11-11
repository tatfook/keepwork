<template>
  <div class="organization-cooperation" v-loading="isLoading">
    <div class="organization-cooperation-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Lesson' }">学习</el-breadcrumb-item>
        <el-breadcrumb-item>合作机构</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="area-select">
      <span class="area-select-tips">请选择:</span>
      <el-select class="area-select-options" v-model="selectedProvince" @change="searchOrganizations" placeholder="选择省" clearable>
        <el-option class="" v-for="item in province" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select class="area-select-options" v-model="selectedCity" @change="searchOrganizations" placeholder="选择市" clearable>
        <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select class="area-select-options" v-model="selectedArea" @change="searchOrganizations" placeholder="选择区" clearable>
        <el-option v-for="item in area" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="organization-list">
      <organization-cell class="organization-list-item" :organization="item" v-for="item in organizationList" :key="item.id"></organization-cell>
    </div>
  </div>
</template>


<script>
import OrganizationCell from './common/OrganizationCell'
import { keepwork } from '@/api'
import districts from './common/districts.js'
const PROVINCE_ID = 100000
export default {
  name: 'OrganizationCooperation',
  data() {
    return {
      isLoading: true,
      districts,
      res: {},
      selectedProvince: '',
      selectedCity: '',
      selectedArea: ''
    }
  },
  components: {
    OrganizationCell
  },
  async created() {
    await this.searchOrganizations()
    this.isLoading = false
  },
  methods: {
    async searchOrganizations() {
      const params = {}
      if (this.selectedProvince) {
        params['location-like'] = `%${[
          _.get(this.districts, [PROVINCE_ID, this.selectedProvince], ''),
          _.get(this.districts, [this.selectedProvince, this.selectedCity], ''),
          _.get(this.districts, [this.selectedCity, this.selectedArea], '')
        ]
          .filter(v => v)
          .join(',')}%`
      }
      const res = await keepwork.lessonOrganizations.searchOrganizations(params)
      this.res = res
    }
  },
  watch: {
    selectedProvince(value) {
      this.selectedCity = ''
      this.selectedArea = ''
    },
    selectedCity(value) {
      this.selectedArea = ''
    }
  },
  computed: {
    organizationList() {
      return _.filter(
        _.get(this.res, 'rows', []),
        item => item.visibility !== 1
      )
    },
    mapToOptions(item) {
      return { value: item[0], label: item[1] }
    },
    province() {
      return _.map(_.toPairs(_.get(this.districts, PROVINCE_ID, {})), item => ({
        value: item[0],
        label: item[1]
      }))
    },
    city() {
      return this.selectedProvince
        ? _.map(
            _.toPairs(_.get(this.districts, this.selectedProvince, {})),
            item => ({ value: item[0], label: item[1] })
          )
        : []
    },
    area() {
      return this.selectedCity
        ? _.map(
            _.toPairs(_.get(this.districts, this.selectedCity, {})),
            item => ({
              value: item[0],
              label: item[1]
            })
          )
        : []
    }
  }
}
</script>

<style lang="scss" scoped>
.organization-cooperation {
  min-height: 500px;
  max-width: 1200px;
  margin: 0 auto;
  &-breadcrumb {
    max-width: 1200px;
    margin: 28px auto 24px;
    box-sizing: border-box;
  }
  .area-select {
    line-height: 48px;
    padding: 0 15px;
    background: rgba($color: #000000, $alpha: 0.05);
    border-radius: 24px;
    &-tips {
      color: #303133;
      font-size: 14px;
    }
    &-options {
      margin-left: 10px;
      /deep/ .el-input__inner {
        background: none;
        border: none;
        border-radius: 0;
        color: #909399;
        border-bottom: 1px solid #d5d5d5;
        height: 32px;
        line-height: 32px;
        &::placeholder {
          color: #909399;
        }
      }
    }
  }
  .organization-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 32px;
    &-item {
      margin-right: 31px;
    }
  }
}

@media screen and(min-width: 1200px) {
  .organization-cooperation {
    .organization-list {
      &-item:nth-child(3n + 0) {
        margin-right: 0;
      }
    }
  }
}
</style>
