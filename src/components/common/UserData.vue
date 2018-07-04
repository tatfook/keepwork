<template>
  <el-container class="user-data-setting" v-loading='loading' @click.stop="handleDialogClick">
    <el-row class="user-data-setting-content">
      <el-col class="user-data-setting-portrait-col">
        <img :src="portrait" alt="" class="user-data-setting-profile">
        <div>
          <span>修改头像</span>
        </div>
      </el-col>
      <el-col class="user-data-setting-form-col">
        <el-form ref="form" :model="userInfo" label-width="80px">
          <el-form-item label="昵称:">
            <el-input v-model="userInfo.displayName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="性别:">
            <el-radio-group v-model="userInfo.sex">
              <el-radio label="M">男</el-radio>
              <el-radio label="F">女</el-radio>
              <el-radio label="N">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="位置:" size="small">
            <el-input v-model="userInfo.location"></el-input>
          </el-form-item>
          <el-form-item label="个人简介:">
            <el-input type="textarea" resize="none" :rows=6 v-model="userInfo.introduce"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'userData',
  mounted(){
    this.userInfo = _.cloneDeep(this.loginUserProfile)
  },
  data() {
    return {
      loading: false,
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters({
      loginUserProfile: 'user/profile'
    }),
    portrait() {
      return _.get(this.loginUserProfile, 'portrait')
    }
  }
}
</script>
<style lang='scss' scoped>
.user-data-setting {
  &-content {
    display: flex;
    width: 100%;
    padding: 40px 28px 0 20px;
  }
  &-portrait-col {
    padding-right: 55px;
    width: auto;
    text-align: center;
  }
  &-form-col {
    width: auto;
    flex: 1;
    .el-radio {
      color: #333;
    }
  }
  &-profile {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 13px;
  }
}
</style>
<style lang="scss">
.user-data-setting {
  .el-form-item__label {
    padding-right: 20px;
    color: #333;
  }
  .el-textarea__inner {
    font-family: inherit;
  }
}
</style>
