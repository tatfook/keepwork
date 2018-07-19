<template>
  <div class="container" v-loading='loading'>
    <el-row class="website-setting-style" type="flex">
      <el-col class="website-setting-font" :span="10">
        <header>
          <h1>1.字体</h1>
        </header>
        <main>
          <el-row class="website-setting-font-family" type="flex" justify="center">
            <el-col :span="22">
              <span class="website-setting-select-title">字体:</span>
              <el-select class="website-setting-select" v-model="fontFamily" size="small" placeholder="请选择">
                <el-option v-for="item in fontFamilyList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <div class="tips">注意: 所选字体如浏览器不支持，会显示默认字体</div>
            </el-col>
          </el-row>
          <el-row class="website-setting-font-size" type="flex" justify="center">
            <el-col :span="22">
              <span class="website-setting-select-title">字号:</span>
              <el-select class="website-setting-select" v-model="fontID" size="small" placeholder="请选择">
                <el-option v-for="item in fontSize" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="24" class="website-setting-preview-fontsize">
              <p v-for="(size, index) in fontSizeList[fontID]" :style="{fontSize: `${size}px`, fontFamily: fontFamily}" :key="index">你好,Hello.</p>
            </el-col>
          </el-row>
        </main>
      </el-col>
      <el-col :span="11" class="website-setting-color">
        <header>
          <h1>2.颜色</h1>
        </header>
        <main>
          <website-setting-sytle-color-preview :colorsList="colors" :colorID.sync="colorID" @handleSelectColor="handleSelectColor" />
        </main>
      </el-col>
      <el-col :span="3" class="website-setting-btns">
        <el-button @click="handleSave" type="primary">{{$t('editor.save')}}</el-button>
        <el-button @click="handleClose">{{$t('editor.cancel')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import themeData from '@/lib/theme/theme.data'
import { mapActions, mapGetters } from 'vuex'
import WebsiteSettingSytleColorPreview from './WebSiteSettingSytleColorPreview'
export default {
  name: 'websiteSettingStyle',
  props: {
    sitePath: String
  },
  components: {
    WebsiteSettingSytleColorPreview
  },
  async mounted() {
    this.loading = true
    await this.userGetSiteThemeConfig({ path: this.sitePath })
    this.loading = false
  },
  methods: {
    ...mapActions({
      userGetSiteThemeConfig: 'user/getSiteThemeConfig',
      userSaveSiteThemeConfig: 'user/saveSiteThemeConfig'
    }),
    async handleSave() {
      this.loading = true
      let config = {
        fontID: this.fontID,
        fontFamily: this.fontFamily,
        colorID: this.colorID,
        name: 'classic'
      }
      await this.userSaveSiteThemeConfig({ sitePath: this.sitePath, config })
        .then(() => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message.error('保存失败')
        })
      this.loading = false
    },
    handleClose() {
      this.$emit('close')
    },
    handleSelectColor(index) {
      if (this.colorID !== index) {
        this.colorID = index
      }
    }
  },
  watch: {
    userSiteThemeConfigClone(config) {
      let { fontID = 0, colorID = 0, fontFamily = 'inherit' } = config || {}
      this.fontID = fontID
      this.fontFamily = fontFamily
      this.colorID = colorID
    }
  },
  computed: {
    ...mapGetters({
      userSiteThemeConfigBySitePath: 'user/siteThemeConfigBySitePath'
    }),
    userSiteThemeConfigClone() {
      return this.userSiteThemeConfigBySitePath(this.sitePath)
    },
    colors() {
      return themeData.classic.colors
    },
    fontSize() {
      return this.fontSizeName.map((label, index) => ({
        value: index,
        label: label
      }))
    },
    fontSizeList() {
      const fonts = themeData.classic.fonts[0]
      let big = [0, 3, 6, 9]
      let small = [2, 5, 8, 9]
      let midium = [1, 4, 7, 9]
      let comp = [small, midium, big]
      return comp.map(size => size.map(index => fonts[index]))
    }
  },
  data() {
    return {
      loading: false,
      colorID: 0,
      fontID: 0,
      fontFamily: 'inherit',
      fontSizeName: ['小号', '中号', '大号'],
      fontFamilyList: [
        {
          value: 'inherit',
          label: '系统默认'
        },
        {
          value: 'Microsoft YaHei',
          label: '微软雅黑'
        },
        {
          value: 'SimHei',
          label: '黑体'
        },
        {
          value: 'STXihei',
          label: '华文细黑'
        },
        {
          value: 'SimSun',
          label: '宋体'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.container {
  height: 100%;
  overflow: hidden;
}
.website-setting {
  $column-height: 100%;
  &-style {
    min-height: $column-height;
    min-width: 1000px;
  }
  &-font,
  &-color {
    padding: 20px;
  }
  &-color {
    main {
      border-left: 1px solid #bcbcbc;
      height: 100%;
      margin-left: -20px;
      padding: 10px 20px;
    }
  }
  &-font-size,
  &-font-family {
    margin-top: 30px;
  }
  &-select {
    width: 75%;
  }
  &-preview-fontsize {
    background: #e5edf5;
    border-radius: 4px;
    padding: 20px;
    margin-top: 20px;
  }
  &-select-title {
    margin-right: 10px;
  }
  &-btns {
    padding: 20px;
    height: $column-height;
    h1 {
      padding-left: 0;
    }
  }
}
.website-setting-preview-fontsize {
  width: 80%;
}
.tips {
  color: rgba($color: #8a8a8a, $alpha: 0.5);
  font-size: 12px;
  text-align: center;
}
</style>


