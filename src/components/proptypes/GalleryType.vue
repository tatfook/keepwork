<template>
  <div>
    <div class="gallery-type">
      <el-button @click='handleAdd' class="gallery-type-add-btn" icon="el-icon-plus">{{$t('common.add')}}</el-button>
      <div v-for='(item, index) in galleryData'
        class="gallery-type-item"
        :key='index'
        :item="item"
        @change="updateValue(item)">

        <div
          class="gallery-type-item-img"
          :style="{
            backgroundImage: 'url(' + item.img + ')'
          }">
          <div class="gallery-type-item-img-cover">
            <span>
              <el-button class="gallery-type-change-img-btn" size="mini" round @click="handleUpdateImg(index)">{{$t('common.change')}}</el-button>
              <el-button class="gallery-type-remove-img-btn iconfont icon-delete" size="mini" round @click="handleRemove(index)"></el-button>
            </span>
          </div>
        </div>

        <el-input :placeholder="$t('editor.pleaseInput')" v-model="item.link" class="input-with-select">
            <el-button v-if="item.link" slot="prepend" icon="iconfont icon-link_"></el-button>
            <el-button v-if="!item.link" slot="prepend">{{$t('common.link')}}</el-button>
            <el-select v-model="item.link" slot="append" placeholder="Select">
              <el-option v-for="(path, pathIndex) in personalAllPagePathList" :key="pathIndex" :value="locationOrigin + '/' + path">
                {{ path }}
              </el-option>
            </el-select>
        </el-input>
      </div>
    </div>
    <SkyDriveManagerDialog :mediaLibrary='true' :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog' />
  </div>
</template>
<script>
import _ from 'lodash'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'GalleryType',
  props: {
    editingKey: String,
    originValue: Array
  },
  data() {
    return {
      locationOrigin: location.origin,
      selectedIndex: NaN,
      isSkyDriveManagerDialogShow: false
    }
  },
  async mounted() {
    await this.getAllPersonalPageList()
  },
  computed: {
    ...mapGetters({
      personalAllPagePathList: 'user/personalAllPagePathList'
    }),
    galleryData: {
      get() {
        return this.originValue
      },
      set() {}
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalPageList: 'user/getAllPersonalPageList'
    }),
    handleChange() {
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = this.galleryData
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    handleAdd() {
      this.galleryData.push({
        img: require('@/../static/adi/imgLoop/imgCarouselOne.jpg'),
        link: ''
      })
    },
    async handleRemove(index) {
      await this.$confirm(this.$t('editor.removeImgConfirmMsg'), '', {
        confirmButtonText: this.$t('common.OK'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })
      this.galleryData.splice(index, 1)
    },
    handleUpdateImg(index) {
      this.selectedIndex = index
      this.openSkyDriveManagerDialog()
    },
    openSkyDriveManagerDialog() {
      this.isSkyDriveManagerDialogShow = true
    },
    closeSkyDriveManagerDialog({ url }) {
      this.isSkyDriveManagerDialogShow = false
      let item = this.galleryData[this.selectedIndex]
      if (!url || !item) return
      item.img = url
      this.handleChange()
    }
  },
  components: {
    SkyDriveManagerDialog
  }
}
</script>
<style lang="scss">
.gallery-type {
  .el-button {
    border: none;
  }
  &-add-btn {
    padding: 0 ;
    margin: 16px 0;
    font-size: 16px !important;
    .el-icon-plus {
      background: #E9F5FF;
      color: #A6B3C0;
    }
    &:hover, &:focus, &:active {
      background: none;
      .el-icon-plus {
        background: #1B81F3;
        color: white;
      }
    }
  }
  &-change-img-btn {
    padding: 6px 12px !important;
    font-size: 14px !important;
  }
  &-remove-img-btn {
    padding: 6px !important;
    margin-left: 2px !important;
    font-size: 14px !important;
  }
  .el-input-group__prepend {
    padding: 0;
    .el-button--default {
      padding: 0;
      margin: 0;
    }
  }
  .input-with-select {
    border-bottom: 1px solid #E4E7ED;
    > .el-input-group__prepend,
    > .el-input__inner,
    > .el-input-group__append {
      border: none;
      background: none;
    }
    > .el-input__inner {
      padding: 0 0 0 5px;
    }
    > .el-input-group__append {
      padding-left: 12px;
    }
  }
  &-item {
    margin-bottom: 20px;
    + .gallery-type-item {
      margin-top: 35px;
    }
  }
  &-item-img {
    height: 150px;
    background-color: lightgray;
    background-size: cover;
    background-position: center;
    &-cover {
      height: 100%;
      background: rgba(0,0,0,.5);
      display: none;
    }
    &:hover {
      .gallery-type-item-img-cover {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
