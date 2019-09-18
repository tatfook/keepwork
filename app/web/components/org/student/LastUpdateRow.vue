<template>
  <div class="last-update-row">
    <div class="user-info">
      <img class="user-info-portrait" :src="portrait" :alt="realName">
      <span class="user-info-realname">
        {{ realName}}
      </span>
    </div>
    <div class="project-list">
      <el-row>
        <el-col :sm="12" :md="12" :xs="12" v-for="project in projects" :key="project.id">
          <project-cell :project="project"></project-cell>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ProjectCell from '@/components/common/ProjectCell'
import _ from 'lodash'
export default {
  name: 'LastUpdateRow',
  components: {
    ProjectCell
  },
  props: {
    userData: Object
  },
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png')
    }
  },
  computed: {
    realName() {
      return _.get(this.userData, 'realname')
    },
    portrait() {
      return _.get(this.userData, 'users.portrait') || this.defaultPortrait
    },
    projects() {
      return _.get(this.userData, 'projects', [])
    }
  }
}
</script>

<style lang="scss" scoped>
.last-update-row {
  background: #fff;
  border-radius: 8px;
  height: 306px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  .user-info {
    width: 250px;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    &-portrait {
      object-fit: cover;
      width: 125px;
      height: 125px;
      border-radius: 50%;
    }
    &-realname {
      font-size: 20px;
      color: #303133;
      margin-top: 32px;
    }
  }
  .project-list {
    flex: 1;
  }
}
</style>

