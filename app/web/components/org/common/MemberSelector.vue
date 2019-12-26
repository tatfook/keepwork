<template>
  <div class="member-selector">
    <el-tree ref="memberTree" class="member-selector-tree" v-loading="isTreeLoading" :data="memberData" :props="treeProps" :expand-on-click-node="false" show-checkbox accordion check-on-click-node node-key="nodeKey" :default-expanded-keys="['all']"></el-tree>
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
    selectedMembers: {
      type: Array,
      default: [],
    },
  },
  async mounted() {
    this.isTreeLoading = true
    try {
      await this.getClassesWithMember(this.roleId)
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
    roleId() {
      let nowPathArr = this.$route.path.split('/')
      if (nowPathArr.length > 2) {
        let nowRoleText = nowPathArr[2]
        return nowRoleText == 'teacher' ? 2 : null
      }
    },
    classMemberData() {
      return _.map(this.allClassesWithMember, classItem => {
        let { className, classId, teacherList, studentList } = classItem
        let teacherData = this.formatMemberTreeData(teacherList, 2, classId, className)
        let studentData = this.formatMemberTreeData(studentList, 1, classId, className)
        let children = _.concat(teacherData, studentData) || []
        return {
          label: className,
          nodeKey: classId,
          disabled: children.length > 0 ? false : true,
          children,
        }
      })
    },
    memberData() {
      return this.classMemberData.length > 0
        ? [
            {
              label: this.roleId == 2 ? '全选' : '全校',
              nodeKey: 'all',
              children: this.classMemberData,
            },
          ]
        : []
    },
  },
  methods: {
    ...mapActions({
      getClassesWithMember: 'org/getClassesWithMember',
    }),
    formatMemberTreeData(memberData, roleId, classId, className) {
      return _.map(memberData, memberItem => {
        let { userId, realname } = memberItem
        return {
          ...memberItem,
          label: roleId == 2 ? `${realname}老师` : realname,
          roleId,
          userId,
          nodeKey: `${roleId}-${classId}-${userId}`,
          classId,
          className,
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    confirmSelected() {
      this.$emit('save', this.$refs.memberTree.getCheckedNodes(true))
    },
  },
  watch: {
    selectedMembers(selected) {
      this.$refs.memberTree && this.$refs.memberTree.setCheckedNodes(selected)
    },
  },
}
</script>
<style lang="scss" scoped>
.member-selector {
  position: relative;
  padding-bottom: 80px;
  &-tree {
    max-height: 500px;
    overflow: auto;
  }
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
