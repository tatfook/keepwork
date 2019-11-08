<template>
  <div class="name-renamer">
    <div v-if="!isEditing" class="name-renamer-old">
      <span>{{name}}</span>
      <i class="name-renamer-icon-button el-icon-edit-outline" @click="toEdit"></i>
    </div>
    <div v-else class="name-renamer-editing">
      <el-input ref="nameRenamerInputRef" clearable v-model.trim="editingName" size="mini"></el-input>
      <i class="name-renamer-icon-button el-icon-check" @click="saveName"></i>
      <i class="name-renamer-icon-button el-icon-close" @click="cancel"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NameRenamer',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      editingName: ''
    }
  },
  methods: {
    toEdit() {
      this.editingName = this.name
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.nameRenamerInputRef.focus()
      })
    },
    cancel() {
      this.isEditing = false
    },
    saveName() {
      if (!this.editingName)
        return this.$message({
          type: 'error',
          message: '请输入项目名'
        })
      this.$emit('save', this.editingName)
      this.isEditing = false
    }
  }
}
</script>
<style lang="scss" scoped>
.name-renamer {
  display: inline-block;
  height: 28px;
  .el-icon-edit-outline {
    color: #409eff;
  }
  &-icon-button {
    cursor: pointer;
    &:hover {
      color: #2397f3;
    }
  }
  .el-input {
    width: 160px;
  }
}
</style>
