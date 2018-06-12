<template>
  <div class="container" v-loading='loading'>
    <el-row class="website-setting-style" type="flex">
      <el-col class="website-setting-font" :span="10">
        <header>
          <h1>1.字体</h1>
        </header>
        <main>
          <el-row class="website-setting-font-family" type="flex" justify="center">
            <el-col :span="spanSize">
              <span class="website-setting-select-title">字体:</span>
              <el-select class="website-setting-select" v-model="fontFamily" size="small" @change="handleFontFamilyChange" placeholder="请选择">
                <el-option v-for="item in fontFamilyList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <div class="tips">注意: 所选字体如浏览器不支持，会显示默认字体</div>
            </el-col>
          </el-row>
          <el-row class="website-setting-font-size" type="flex" justify="center">
            <el-col :span="spanSize">
              <span class="website-setting-select-title">字号:</span>
              <el-select class="website-setting-select" v-model="fontSizeIndex" size="small" @change="handleFontSizeChange" placeholder="请选择">
                <el-option v-for="item in fontSize" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="24" class="website-setting-preview-fontsize">
              <website-setting-style-font-preview :fontSizeList="fontSizeList" :fontSizeIndex="fontSizeIndex" :fontFamily="fontFamily" />
            </el-col>
          </el-row>
        </main>
      </el-col>
      <el-col :span="11" class="website-setting-color">
        <header>
          <h1>2.颜色</h1>
        </header>
        <main>
          <website-setting-sytle-color-preview :colorsList="colors" :colorIndex="colorIndex" @handleSelectColor="handleSelectColor" />
        </main>
      </el-col>
      <el-col :span="3" class="website-setting-btns">
        <el-button @click="handleSave" type="primary">{{$t('editor.save')}}</el-button>
        <el-button>{{$t('editor.cancel')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import themeData from '@/lib/theme/theme.data'
import WebsiteSettingStyleFontPreview from './WebsiteSettingStyleFontPreview'
import WebsiteSettingSytleColorPreview from './WebSiteSettingSytleColorPreview'
export default {
  name: 'websiteSettingStyle',
  props: {
    sitePath: String
  },
  components: {
    WebsiteSettingSytleColorPreview,
    WebsiteSettingStyleFontPreview
  },
  methods: {
    handleSave() {
      console.log({
        fontSize: this.fontSizeIndex,
        fontFamily: this.fontFamily,
        colors: this.colorIndex
      })
    },
    handleSelectColor(index) {
      if (this.colorIndex !== index) {
        this.colorIndex = index
        console.log(`使用第${index}组颜色`)
      }
    },
    handleFontSizeChange(index) {
      console.log(`改变字体大小${index}`)
    },
    handleFontFamilyChange(value) {
      console.log(`改变字体为:${value}`)
    },
    hexRandomColor() {
      return (
        '#' +
        (('00000' + Math.random() * 0x1000000) << 0).toString(16).slice(-6)
      )
    }
  },
  computed: {
    colors() {
      let colors = themeData.classic.colors[0]
      let _temp = []
      let num = 10
      while (num--) {
        let n = 10
        let _arr = []
        while (n--) {
          _arr.push(this.hexRandomColor())
        }
        _temp.push(_arr)
      }
      return [colors, ..._temp]
    },
    fontSize() {
      let fonts = themeData.classic.fonts[0]
      return new Array(6).fill(fonts).map((val, index) => ({
        value: index,
        label: this.fontSizeName[index]
      }))
    },
    fontSizeList() {
      let fonts = [...new Set(themeData.classic.fonts[0])]
      let _fontsList = []
      let num = 6
      while (num--) {
        _fontsList.push(fonts.map(i => i + num))
      }
      return _fontsList.reverse()
    }
  },
  data() {
    return {
      spanSize: 22,
      name: 'websiteSettingStyle',
      loading: false,
      colorIndex: 0,
      fontSizeName: ['小号', '标准', '中号', '大号', '超大', '巨无霸'],
      fontSizeIndex: 1,
      fontFamilyList: [
        {
          value: 'default',
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
        },
        {
          value: 'Arial',
          label: 'Arial'
        },
        {
          value: 'Tahoma',
          label: 'Tahoma'
        },
        {
          value: 'Helvetica',
          label: 'Helvetica'
        },
        {
          value: 'Georgia',
          label: 'Georgia'
        }
      ],
      fontFamily: 'default'
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
.tips {
  color: rgba($color: #8a8a8a, $alpha: 0.5);
  font-size: 12px;
  text-align: center;
}
</style>


