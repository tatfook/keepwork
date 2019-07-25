<template>
  <div class="org-forms">
    <div class="org-forms-header">表单管理
      <el-button v-if="isFormExist" type="primary" size="medium" @click="toNewFormPage">创建表单</el-button>
    </div>
    <el-table v-if="isFormExist" class="org-forms-table" :data="formsList" stripe>
      <el-table-column label="表单名称" class-name="org-forms-table-name-row">
        <template slot-scope="scope">
          <div class="org-forms-table-name">
            <span>{{scope.row.name}}</span>
            <i class="iconfont icon-edit1"></i>
          </div>
          <div class="org-forms-table-url" v-if="scope.row.state !== FormStateCode.unPublished">{{scope.row.url}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="175">
        <template slot-scope="scope">
          <span :class="scope.row.stateColClass">{{scope.row.stateText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈数" prop="callbackCount" width="120"></el-table-column>
      <el-table-column label="" class-name="org-forms-table-operate-row">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state === FormStateCode.unPublished" size="small">编辑</el-button>
          <el-button size="small">{{scope.row.buttonText}}</el-button>
          <el-dropdown trigger="click" @command="handleDropdownCommand">
            <span class="el-dropdown-link">
              <i class="iconfont icon-ellipsis"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{key: 'copy', detail: scope.row}">生成副本</el-dropdown-item>
              <el-dropdown-item :command="{key: 'print', detail: scope.row}">打印</el-dropdown-item>
              <el-dropdown-item :command="{key: 'delete', detail: scope.row}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!isFormExist" class="org-forms-empty">
      <div class="org-forms-empty-container">
        <p>你还没有表单哦，点击下方按钮去创建你的第一份表单吧！</p>
        <el-button type="primary" size="medium" @click="toNewFormPage">创建表单</el-button>
      </div>
    </div>
    <div v-if="!isFormExist" class="org-forms-templates">
      <div class="org-forms-templates-header">表单模板</div>
      <form-templates class="org-forms-templates-list" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import FormTemplates from './common/FormTemplates'
export default {
  name: 'OrgForms',
  data() {
    return {
      FormStateCode: {
        unPublished: 0,
        doing: 1,
        stop: 2
      }
    }
  },
  computed: {
    ...mapGetters({
      orgFormsList: 'org/formsList'
    }),
    isFormExist() {
      return Boolean(this.orgFormsList.length)
    },
    formsList() {
      return _.map(this.orgFormsList, form => {
        let { id, state, callbackCount } = form
        return {
          ...form,
          url: `${this.nowHost}/org/${this.orgLoginUrl}/${id}`,
          stateText: this.getStateText(state),
          stateColClass: this.getStateClass(state),
          buttonText: this.getButtonText(state),
          callbackCount: _.isNumber(callbackCount) ? callbackCount : '-'
        }
      })
    },
    orgLoginUrl() {
      return _.get(this.$route, 'params.orgLoginUrl', '')
    },
    nowHost() {
      return window.location.host
    }
  },
  methods: {
    toNewFormPage() {
      this.$router.push({
        name: 'NewForm'
      })
    },
    getStateText(state) {
      return state === this.FormStateCode.doing
        ? '收集中'
        : state === this.FormStateCode.stop
        ? '停止'
        : '未发布'
    },
    getStateClass(state) {
      return state === this.FormStateCode.doing
        ? 'is-doing'
        : state === this.FormStateCode.stop
        ? 'is-stop'
        : ''
    },
    getButtonText(state) {
      return state === this.FormStateCode.doing
        ? '停止收集'
        : state === this.FormStateCode.stop
        ? '开始收集'
        : '发布'
    },
    copyForm(formDetail) {
      console.log('copyForm', formDetail)
    },
    printForm(formDetail) {
      console.log('printForm', formDetail)
    },
    deleteForm(formDetail) {
      console.log('deleteForm', formDetail)
    },
    handleDropdownCommand(command) {
      let { key, detail } = command
      switch (key) {
        case 'copy':
          this.copyForm(detail)
          break
        case 'print':
          this.printForm(detail)
          break
        case 'delete':
          this.deleteForm(detail)
          break
        default:
          break
      }
    }
  },
  components: {
    FormTemplates
  }
}
</script>
<style lang="scss" scoped>
.org-forms {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  color: #303133;
  &-header {
    font-size: 16px;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
    .el-button {
      float: right;
      top: 10px;
      position: relative;
    }
  }
  &-table {
    margin-top: -1px;
    /deep/ table tr &-name-row {
      padding-left: 14px;
    }
    /deep/ &-operate-row {
      padding-right: 14px;
      text-align: right;
      .el-button {
        border-radius: 8px;
      }
      .el-dropdown {
        cursor: pointer;
        margin-left: 24px;
      }
    }
    &-name {
      display: flex;
      span {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .iconfont {
        flex: 1;
        color: #2397f3;
        margin-left: 8px;
      }
    }
    &-url {
      font-size: 12px;
      color: #c0c4cc;
    }
    /deep/ thead tr,
    /deep/ thead th {
      background-color: #ebf4ff;
    }
    /deep/ td,
    /deep/ th {
      border: none;
    }
    /deep/ th {
      padding: 0;
      height: 36px;
      line-height: 36px;
      color: #303133;
      font-weight: normal;
    }
    .is-doing {
      color: #f39823;
    }
    .is-stop {
      color: #f32d23;
    }
  }
  &-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    color: #999;
    p {
      margin: 0 0 20px 0;
    }
  }
  &-templates {
    border-top: 1px solid #e8e8e8;
    padding: 0 24px 16px;
    &-header {
      font-size: 16px;
      padding: 16px 0;
    }
    &-list {
      margin: 0 -8px;
    }
  }
}
</style>
