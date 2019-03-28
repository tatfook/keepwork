<template>
  <div class="org-classes">
    <div class="org-classes-header">
      <div class="org-classes-menu" v-if="orgClassesLength > 0">
        <div class="org-classes-menu-item" :class="{'org-classes-menu-item-active': isMenuItemActive(menu)}" v-for="(menu, index) in menuData" :key="index">
          <router-link class="org-classes-menu-link" :to='{name: menu.indexPageName}'>{{menu.text}}</router-link>
        </div>
      </div>
      <div class="org-classes-available" v-if="orgClassesLength > 0">{{$t('org.RemainingPlaces')}}<span class="org-classes-available-warning">{{orgRestUserCount + $t('org.usersCount')}}</span></div>
      <span class="org-classes-header-empty-title" v-if="orgClassesLength == 0">{{$t('org.classInformationLabel')}}</span>
    </div>
    <router-view></router-view>
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
  },
  data() {
    return {
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
  }
}
</style>

