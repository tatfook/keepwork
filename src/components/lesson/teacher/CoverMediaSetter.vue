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
        <template slot="append">
          <el-popover placement="top" width="250" trigger="hover" popper-class='cover-media-setter-image-preview'>
            <img src="http://g.hiphotos.baidu.com/image/h%3D300/sign=a102682e4fa7d933a0a8e2739d4ad194/6f061d950a7b0208d5456ddb6fd9f2d3572cc878.jpg" alt="图片预览">
            <el-button slot="reference">预览</el-button>
          </el-popover>
        </template>
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
      .el-input__inner {
        border-radius: 4px;
      }
      .el-input-group__append {
        color: #333;
        background-color: transparent;
        border: none;
      }
    }
  }
  &-image-preview {
    padding: 0;
    height: 165px;
    border-radius: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
