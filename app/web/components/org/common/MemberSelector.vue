<template>
  <div class="member-selector">
    <el-tree ref="memberTree" class="member-selector" v-loading="isTreeLoading" :data="memberData" :props="treeProps" :expand-on-click-node="false" show-checkbox accordion check-on-click-node></el-tree>
    <div class="member-selector-operate">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirmSelected">确认</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'MemberSelector',
  props: {
    checkedUserIdsObj: {
      type: Array,
      default: [],
    },
  },
  async mounted() {
    this.isTreeLoading = true
    try {
      await this.getClassesWithMember()
    } catch (error) {}
    this.isTreeLoading = false
  },
  data() {
    return {
      isTreeLoading: false,
      treeProps: {
        label: 'label',
        children: 'children',
      },
    }
  },
  computed: {
    ...mapGetters({
      allClassesWithMember: 'org/allClassesWithMember',
    }),
    memberData() {
      return _.map(this.allClassesWithMember, classItem => {
        let { className, classId, teacherList, studentList } = classItem
        let teacherData = _.map(teacherList, teacherItem => {
          let userId = teacherItem.userId
          let roleId = 2
          return {
            label: teacherItem.realname,
            roleId,
            userId,
            nodeKey: `${roleId}-${classId}-${userId}`,
            classId,
            className,
          }
        })
        let studentData = _.map(studentList, teacherItem => {
          let userId = teacherItem.userId
          let roleId = 1
          return {
            label: teacherItem.realname,
            roleId,
            userId,
            nodeKey: `${roleId}-${classId}-${userId}`,
            classId,
            className,
          }
        })
        return {
          label: className,
          nodeKey: classId,
          children: _.concat(teacherData, studentData),
        }
      })
      return this.allClassesWithMember
    },
  },
  methods: {
    ...mapActions({
      getClassesWithMember: 'org/getClassesWithMember',
    }),
    cancel() {
      this.$emit('cancel')
    },
    confirmSelected() {
      this.$emit('save', this.$refs.memberTree.getCheckedNodes(true))
    },
  },
}
</script>
<style lang="scss" scoped>
.member-selector {
  position: relative;
  padding-bottom: 80px;
  max-height: 500px;
  &-operate {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    .el-button {
      width: 48px;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      padding: 0;
    }
  }
}
</style>
