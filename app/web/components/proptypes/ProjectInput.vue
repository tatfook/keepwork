<template>
  <div class="project-input-container">
    <el-input
      class="project-input"
      v-model="projectId"
      :placeholder="$t('card.projectId')"
      @input="changeProjectId"
    >
      <template slot="suffix">
        <el-dropdown
          v-show="isHasProject"
          size="small"
          placement="bottom"
          @command="handleSelect"
        >
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            class="project-input-dropdown"
            slot="dropdown"
          >
            <el-dropdown-item
              v-for="(item, index) in userProjectList"
              :key="index"
              :command="item.id"
            >{{item.id}}  {{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-input>
  </div>
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  mixins: [protypesBaseMixin],
  props: {
    originValue: String
  },
  data() {
    return {
      projectId: '',
      timer: null,
    }
  },
  watch: {
    inputTypeValue(value) {
      this.projectId = value
      // this.getProjects()
    }
  },
  computed: {
    ...mapGetters({
      userId: 'user/userId',
      isLogined: 'user/isLogined',
      userProjects: 'pbl/userProjects'
    }),
    isHasProject() {
      return this.userProjects.length > 0
    },
    userProjectList() {
      return _.get(this.userProjects({ userId: this.userId }), 'rows', [])
    },
  },
  mounted() {
    this.projectId = this.inputTypeValue
    this.getProjects()
  },
  methods: {
    ...mapActions({
      getUserProjects: 'pbl/getUserProjects'
    }),
    async getProjects() {
      if (this.isLogined) {
        await this.getUserProjects({ userId: this.userId })
      }
    },
    changeProjectId(id) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() =>
        this.updateMarkdown({ projectId: id })
        , 800)
    },
    handleSelect(id) {
      this.projectId = id
      this.updateMarkdown({ projectId: id })
    },
    updateMarkdown(payload) {
      this.$emit('onPropertyChange', payload)
    }
  },
}
</script>

<style lang="scss">
.project-input-container {
  .project {
    &-input {
      .el-input__inner {
        border: none;
        border-radius: 0;
        border-bottom: 1px solid #dcdfe6;
        padding: 0;
      }
      .el-input__suffix-inner {
        line-height: 40px;
      }
    }
  }
}
.project-input-dropdown {
  overflow-y: auto ;
  max-height: 90%;
  display: block;
}
</style>
