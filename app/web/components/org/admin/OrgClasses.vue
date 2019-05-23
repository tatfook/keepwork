<template>
  <div class="org-classes">
    <div class="org-classes-header">
      <div class="org-classes-menu">
        <div class="org-classes-menu-item" :class="{'org-classes-menu-item-active': isMenuItemActive(menu)}" v-for="(menu, index) in menuData" :key="index">
          <router-link class="org-classes-menu-link" :to='{name: menu.indexPageName}'>{{menu.text}}</router-link>
        </div>
      </div>
      <div class="org-classes-available">{{$t('org.RemainingPlaces')}}
        <span class="org-classes-available-warning">{{orgRestUserCount + $t('org.usersCount')}}</span>
        <el-popover popper-class="org-classes-popover" placement="bottom" title="" width="306" trigger="hover">
          {{$t('org.moreRemainClassContact')}}
          <span class="org-classes-stress">support@paraengine.com</span>
          <span slot="reference"><i class="iconfont icon-help"></i></span>
        </el-popover>
      </div>
    </div>
    <router-view v-if="!isLoadPreset"></router-view>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrgClasses',
  async mounted() {
    await this.getOrgClassList({
      organizationId: this.orgId
    })
    this.isLoadPreset = false
  },
  data() {
    return {
      isLoadPreset: true,
      menuData: [
        {
          pageNames: [
            'OrgClassList',
            'OrgNewClass',
            'OrgEditClass',
            'OrgClassDetail'
          ],
          indexPageName: 'OrgClassList',
          text: this.$t('org.ClassesLabel')
        },
        {
          pageNames: ['OrgTeacherList', 'OrgNewTeacher', 'OrgEditTeacher'],
          indexPageName: 'OrgTeacherList',
          text: this.$t('org.TeachersLabel')
        },
        {
          pageNames: ['OrgStudentList', 'OrgNewStudent', 'OrgEditStudent'],
          indexPageName: 'OrgStudentList',
          text: this.$t('org.StudentsLabel')
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgRestCount: 'org/getOrgRestCount',
      getOrgClassesById: 'org/getOrgClassesById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgRestUserCount() {
      return this.getOrgRestCount({ id: this.orgId })
    },
    currentPageName() {
      return _.get(this.$route, 'name')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    orgClassesLength() {
      return this.orgClasses.length
    }
  },
  methods: {
    ...mapActions({
      getOrgClassList: 'org/getOrgClassList'
    }),
    isMenuItemActive(menuItem) {
      return _.indexOf(menuItem.pageNames, this.currentPageName) !== -1
    }
  }
}
</script>
<style lang="scss" scoped>
.org-classes {
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  &-header {
    display: flex;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    z-index: 1;
    position: relative;
    &-empty-title {
      padding-left: 24px;
    }
  }
  &-menu {
    flex: 1;
    padding: 0 16px;
    &-item {
      display: inline-block;
      font-size: 16px;
      color: #999;
      border-color: transparent;
      margin-right: 16px;
      &-active {
        color: #2397f2;
        border-color: #2397f3;
      }
    }
    &-link {
      color: inherit;
      text-decoration: none;
      padding: 8px;
      border-bottom: 3px solid;
      border-color: inherit;
    }
  }
  &-available {
    padding: 0 24px;
    font-size: 12px;
    color: #333;
    &-warning {
      color: #f4b744;
    }
    .icon-help {
      color: #2397f3;
      cursor: pointer;
      vertical-align: text-bottom;
      line-height: 1;
      margin-left: 4px;
    }
  }
  &-popover {
    text-align: left;
  }
  &-stress {
    white-space: nowrap;
    color: #2397f3;
  }
}
</style>

