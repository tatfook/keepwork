<template>
  <div class="form-file">
    <div class="content">
      <img v-if="fileType=='images'" class="image-content" :src="itemData.url" :alt="itemData.filename">
      <a v-else :href="itemData.url" class="link-content" target="_blank">{{itemData.filename}}</a>
    </div>
    <div class="operates" v-if="isEditable">
      <i class="iconfont icon-edit--" @click="editComp"></i>
      <i class="iconfont icon-delete" @click="deleteComp"></i>
    </div>
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow="false" :isNoMediaFileShow="true" :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
export default {
  name: 'FormFile',
  props: {
    itemData: {
      type: Object,
      default: {},
    },
    itemIndex: {
      type: Number,
      required: true,
    },
    isEditable: Boolean,
  },
  data() {
    return {
      isMediaSkyDriveDialogShow: false,
    }
  },
  computed: {
    ...mapGetters({
      editingFormQuizzes: 'org/editingFormQuizzes',
    }),
    fileType() {
      return _.get(this.itemData, 'fileType')
    },
  },
  methods: {
    ...mapActions({ setEditingQuizzes: 'org/setEditingQuizzes' }),
    editComp() {
      this.isMediaSkyDriveDialogShow = true
    },
    closeSkyDriveManagerDialog({ file, url }) {
      this.isMediaSkyDriveDialogShow = false
      if (!url) return
      let { type: fileType, filename } = file
      let quizzes = _.cloneDeep(this.editingFormQuizzes)
      let originData = quizzes[this.itemIndex]
      quizzes[this.itemIndex] = {
        ...originData,
        filename,
        fileType,
        url,
      }
      this.setEditingQuizzes(quizzes)
    },
    deleteComp() {
      let quizzes = _.cloneDeep(this.editingFormQuizzes)
      quizzes.splice(this.itemIndex, 1)
      this.setEditingQuizzes(quizzes)
    },
  },
  components: {
    SkyDriveManagerDialog,
  },
}
</script>
<style lang="scss" scoped>
.form-file {
  padding-bottom: 16px;
  position: relative;
  &:hover {
    .operates {
      display: unset;
    }
  }
  .operates {
    display: none;
    position: absolute;
    right: 10px;
    top: 8px;
  }
  .iconfont {
    display: inline-block;
    width: 22px;
    height: 22px;
    line-height: 22px;
    border-radius: 50%;
    text-align: center;
    margin-left: 8px;
    color: #fff;
    cursor: pointer;
  }
  .icon-edit-- {
    background-color: #2397f3;
    font-size: 12px;
  }
  .icon-delete {
    background-color: #f56c6c;
  }
  .image-content {
    max-width: 100%;
  }
  .link-content {
    color: #2397f3;
    text-decoration: none;
  }
}
</style>
