<template>
  <div class="project-editing" v-loading='isLoading'>
    <div class='project-editing-item'>
      <label class="project-editing-item-label">{{$t('project.projectStatus')}}</label>
      <el-radio-group v-model="projectVisibility" @change="handleSwitchProjectVisibility">
        <el-radio :label="0">{{$t('project.publicProject')}}</el-radio>
        <el-radio :label="1">{{$t('project.privateProject')}}</el-radio>
      </el-radio-group>
    </div>
    <div class='project-editing-item' v-for="(privilege, index) in privilegeOptions" :key='index'>
      <label class="project-editing-item-label">{{privilege.label}}</label>
      <el-radio-group v-model="projectPrivileges[privilege.dataKey]" :disabled="privilege.dataKey === 'boardEdit' && isMemberView || privilege.dataKey === 'boardView' && isPrivilegeProject" @change="handleChange">
        <el-radio v-for="(option, index) in privilege.options" :key='index' :label="option.value" :disabled="option.value === 4 && isPrivilegeProject" >{{option.label}}</el-radio>
      </el-radio-group>
    </div>
    <div class="project-editing-operate">
      <el-button type="primary" size="medium" :disabled="!isModified" @click='updatePrivilege'>{{$t("common.Save")}}</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProjectEditing',
  props: {
    originalProjectDetail: {
      type: Object,
      required: true,
      validator: function (value) {
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
      privilegeOptions: {
        comment: {
          label: this.$t('project.commentBy'),
          dataKey: 'comment',
          options: [
            { value: 4, label: this.$t('project.anyone') },
            { value: 8, label: this.$t('project.membersOnly') },
            { value: 16, label: this.$t('project.commentsOff') }
          ]
        },
        boardView: {
          label: this.$t('project.boardViewBy'),
          dataKey: 'boardView',
          options: [{ value: 32, label: this.$t('project.anyone') }, { value: 64, label: this.$t('project.membersOnly') }]
        },
        boardEdit: {
          label: this.$t('project.boardEditBy'),
          dataKey: 'boardEdit',
          options: [
            { value: 128, label: this.$t('project.anyone') },
            { value: 256, label: this.$t('project.membersOnly') }
          ]
        },
        recruit: {
          label: this.$t('project.recruitingStatus'),
          dataKey: 'recruit',
          options: [{ value: 1, label: this.$t('project.onRecruiting') }, { value: 2, label: this.$t('project.offRecruiting') }]
        }
      },
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
    isPrivilegeProject() {
      return this.projectVisibility === 1
    }
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
            message: this.$t('project.successfullyUpdated')
          })
          this.isLoading = false
        })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    handleSwitchProjectVisibility(value) {
      if(value === 1) {
        this.projectPrivileges['comment'] = 8
        this.projectPrivileges['boardView'] = 64
        this.projectPrivileges['boardEdit'] = 256
      }
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
