<template>
  <div class="creative-dec">
    <el-dialog custom-class="creative-dec-dialog" :lock-scroll="false" :show-close="false" destroy-on-close :visible.sync="isDialogShow">
      <div class="creative-dec-container">
        <img src="@/assets/contests/creative-dec-dialog.png" alt="“汉字大赛”入选深圳第十五届“创意十二月”重点项目">
        <i class="el-icon-circle-close" @click="closeDialog"></i>
      </div>
    </el-dialog>
    <div class="creative-dec-fixed" @click="showDialog">
      <img src="@/assets/contests/creative_dec_fixed.png" alt="“汉字大赛”入选深圳第十五届“创意十二月”重点项目">
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'CreativeDec',
  mounted() {
    const dialogAutoShowDate = window.localStorage.getItem('dialogAutoShowDate')
    const nowDate = new Date()
    if (!moment().isSame(dialogAutoShowDate, 'day')) {
      this.isDialogShow = true
      window.localStorage.setItem('dialogAutoShowDate', nowDate)
    }
  },
  data() {
    return {
      isDialogShow: false,
    }
  },
  methods: {
    showDialog() {
      this.isDialogShow = true
    },
    closeDialog() {
      this.isDialogShow = false
    },
  },
}
</script>
<style lang="scss" scoped>
.creative-dec {
  text-align: center;
  &-fixed {
    position: fixed;
    right: 70px;
    top: 31%;
    cursor: pointer;
  }
  /deep/ &-dialog {
    width: auto;
    background-color: transparent;
    text-align: center;
    box-shadow: none;
    width: auto;
    display: inline-block;
  }
  &-container {
    position: relative;
    padding: 0 36px;
    img {
      max-width: 100%;
    }
    .el-icon-circle-close {
      position: absolute;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
      right: 0;
    }
  }
}
@media screen and (max-width: 768px) {
  .creative-dec {
    &-fixed {
      right: -8px;
      top: 35%;
      img {
        width: 54%;
      }
    }
    &-container {
      padding: 0;
      .el-icon-circle-close {
        top: -28px;
      }
    }
  }
}
</style>
