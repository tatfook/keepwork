<template>
  <div class="org-student-class-last-update">
    <div class="last-update-header">
      <span class="last-update-header-title">
        最近更新
      </span>
      <span class="last-update-header-back" @click="onBack">
        返回 >
      </span>
    </div>
    <div class="last-update-main">
      <last-update-row class="last-update-main-item" v-for="item in lastUpdateList" :key="item.memberId" :userData="item"></last-update-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LastUpdateRow from './LastUpdateRow'
export default {
  name: 'OrgStudentClassLastUpdate',
  components: {
    LastUpdateRow
  },
  data() {
    return {
      isLoading: false
    }
  },
  async created() {
    try {
      await Promise.all([
        this.getMoreLastUpdateProjects(this.classId),
        this.getTeacherAndClassmate(this.classId)
      ])
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    ...mapActions({
      getMoreLastUpdateProjects: 'org/student/getMoreLastUpdateProjects',
      getTeacherAndClassmate: 'org/student/getTeacherAndClassmate'
    }),
    onBack() {
      this.$router.push({
        name: 'OrgStudentClassDetail',
        classId: this.classId
      })
    }
  },
  computed: {
    ...mapGetters({
      moreLastUpdateProjects: 'org/student/moreLastUpdateProjects'
    }),
    lastUpdateList() {
      const arr = _.filter(
        this.moreLastUpdateProjects,
        item => item.projects.length > 0
      )
      return arr
    },
    classId() {
      return _.get(this.$route, 'params.classId')
    }
  }
}
</script>

<style lang="scss" scoped>
.org-student-class-last-update {
  .last-update-header {
    display: flex;
    justify-content: space-between;
    height: 40px;
    &-title {
      color: #303133;
    }

    &-back {
      cursor: pointer;
      color: #999;
      font-size: 14px;
    }
  }

  .last-update-main {
    &-item {
      margin-bottom: 16px;
    }
  }
}
</style>