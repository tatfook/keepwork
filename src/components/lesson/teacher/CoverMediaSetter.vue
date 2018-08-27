<template>
  <div class="cover-media-setter">
    <label class='cover-media-setter-title'>封面图</label>
    <el-radio-group class="cover-media-setter-radio-group" v-model="imageSourceType">
      <el-radio label="bigfile">选择文件</el-radio>
      <el-radio label="url">输入url地址</el-radio>
    </el-radio-group>
    <div class="cover-media-setter-from-bigfile" v-show="imageSourceType === 'bigfile'">
      <div class="cover-media-setter-add-button">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <div class="cover-media-setter-from-url" v-show="imageSourceType === 'url'">
      <el-input placeholder="请输入内容" v-model="urlTypeUrl">
        <template slot="append">预览</template>
      </el-input>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CoverMediaSetter',
  data() {
    return {
      imageSourceType: 'bigfile', // bigfile or url
      bigfileTypeUrl: '',
      urlTypeUrl: ''
    }
  }
}
</script>
<style lang="scss">
.cover-media-setter {
  height: 260px;
  padding: 35px;
  background-color: #fff;
  &-radio-group {
    display: block;
    margin-top: 30px;
    .el-radio + .el-radio {
      margin-left: 40px;
    }
  }
  &-add-button {
    width: 200px;
    height: 132px;
    line-height: 132px;
    font-size: 46px;
    text-align: center;
    background-color: #f6f6f6;
    border: 1px dashed #b9bcc2;
    color: #b9bcc2;
    margin-top: 10px;
  }
  &-from-url {
    .el-input-group {
      width: 565px;
      margin-top: 18px;
    }
  }
}
</style>
