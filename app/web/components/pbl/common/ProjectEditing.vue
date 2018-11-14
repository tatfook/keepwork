<template>
  <div class="project-editing" v-loading='isLoading'>
    <div class='project-editing-item'>
      <label class="project-editing-item-label">项目状态</label>
      <el-radio-group v-model="projectVisibility">
        <el-radio :label="0">公开项目</el-radio>
        <el-radio :label="1">私有项目</el-radio>
      </el-radio-group>
    </div>
    <div class='project-editing-item' v-for="(privilege, index) in privilegeOptions" :key='index'>
      <label class="project-editing-item-label">{{privilege.label}}</label>
      <el-radio-group v-model="projectPrivileges[privilege.dataKey]" :disabled="privilege.dataKey === 'boardEdit' && isMemberView" @change="handleChange">
        <el-radio v-for="(option, index) in privilege.options" :key='index' :label="option.value">{{option.label}}</el-radio>
      </el-radio-group>
    </div>
    <div class="project-editing-operate">
      <el-button type="primary" size="medium" :disabled="!isModified" @click='updatePrivilege'>保存</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
const PRIVILEGE = {
  comment: {
    label: '评论权限',
    dataKey: 'comment',
    options: [
      { value: 4, label: '任何人' },
      { value: 8, label: '仅限成员' },
      { value: 16, label: '关闭评论' }
    ]
  },
  boardView: {
    label: '白板查看',
    dataKey: 'boardView',
    options: [{ value: 32, label: '任何人' }, { value: 64, label: '仅限成员' }]
  },
  boardEdit: {
    label: '白板编辑',
    dataKey: 'boardEdit',
    options: [
      { value: 128, label: '任何人' },
      { value: 256, label: '仅限成员' }
    ]
  },
  recruit: {
    label: '招募状态',
    dataKey: 'recruit',
    options: [{ value: 1, label: '开启招募' }, { value: 2, label: '停止招募' }]
  }
}
export default {
  name: 'ProjectEditing',
  props: {
    originalProjectDetail: {
      type: Object,
      required: true,
      validator: function(value) {
        let { visibility, privilege } = value
        return [0, 1].indexOf(visibility) !== -1 && _.isNumber(privilege)
      }
    }
  },
  mounted() {
    this.projectVisibility = this.originVisibility
    this.initPrivileges()
  },
  data() {
    return {
      isLoading: false,
      privilegeOptions: PRIVILEGE,
      projectVisibility: 0,
      projectPrivileges: {
        recruit: undefined,
        comment: undefined,
        boardView: undefined,
        boardEdit: undefined
      }
    }
  },
  computed: {
    editingProjectId() {
      return _.get(this.originalProjectDetail, 'id')
    },
    originPrivilege() {
      return _.get(this.originalProjectDetail, 'privilege')
    },
    originVisibility() {
      return _.get(this.originalProjectDetail, 'visibility')
    },
    newPrivilege() {
      let privilegeNumber = _.reduce(
        this.projectPrivileges,
        (sum, value) => {
          return sum + value
        },
        0
      )
      return privilegeNumber
    },
    isModified() {
      let isVisibilityModified = !_.isEqual(
        this.projectVisibility,
        this.originVisibility
      )
      let isPrivilegeModified = !_.isEqual(
        this.newPrivilege,
        this.originPrivilege
      )
      return isVisibilityModified || isPrivilegeModified
    },
    isMemberView() {
      return this.projectPrivileges['boardView'] === 64
    },
  },
  methods: {
    ...mapActions({
      pblUpdateProject: 'pbl/updateProject'
    }),
    handleChange(value) {
      if (value === 64) {
        this.projectPrivileges['boardEdit'] = 256
      }
    },
    initPrivileges() {
      const privilegesNumber = this.originPrivilege
      _.forEach(this.privilegeOptions, (value, key) => {
        let { dataKey, options } = value
        for (let index = 0; index < options.length; index++) {
          const option = options[index]
          let optionValue = option.value
          if ((privilegesNumber & optionValue) > 0) {
            this.projectPrivileges[dataKey] = optionValue
            return
          }
        }
      })
    },
    async updatePrivilege() {
      let { name, type, description } = this.originalProjectDetail
      let updatingProjectData = {
        name,
        type,
        description,
        visibility: this.projectVisibility,
        privilege: this.newPrivilege
      }
      this.isLoading = true
      await this.pblUpdateProject({
        projectId: this.editingProjectId,
        updatingProjectData
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.isLoading = false
        })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    }
  }
}
</script>
<style lang="scss">
.project-editing {
  font-size: 14px;
  color: #909399;
  padding: 10px 50px;
  &-item {
    margin-bottom: 20px;
    &-label {
      margin-right: 20px;
    }
  }
  &-operate {
    padding-left: 80px;
    .el-button--medium {
      padding: 10px 28px;
    }
  }
  .el-radio + .el-radio {
    margin-left: 24px;
  }
  .el-radio__label {
    padding-left: 6px;
  }
  .el-radio__inner {
    width: 16px;
    height: 16px;
  }
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
    background-color: #2296f3;
  }
  .el-radio__label,
  .el-radio__input.is-checked + .el-radio__label {
    color: #303133;
  }
  .el-radio__input.is-checked {
    .el-radio__inner {
      background-color: transparent;
    }
  }
}
</style>
