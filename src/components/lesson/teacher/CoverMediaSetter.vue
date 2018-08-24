<template>
  <div class="cover-media-setter">
    <label class='cover-media-setter-title'>封面图</label>
    <el-radio-group v-model="imageSourceType">
      <el-radio :label="bigfile">选择文件</el-radio>
      <el-radio :label="url">输入url地址</el-radio>
    </el-radio-group>
    <div class="cover-media-setter-from-bigfile" v-show="imageSourceType === 'bigfile'">
      <div class="cover-media-setter-add-button">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <div class="cover-media-setter-from-url" v-show="imageSourceType === 'url'"></div>
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
  &-add-button {
    width: 200px;
    height: 132px;
    line-height: 132px;
    font-size: 46px;
    text-align: center;
    background-color: #f6f6f6;
    border: 1px dashed #b9bcc2;
  }
}
</style>
