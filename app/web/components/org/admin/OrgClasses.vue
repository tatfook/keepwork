<template>
  <div class="org-classes">
    <div class="org-classes-header">
      <div class="org-classes-menu">
        <div class="org-classes-menu-item" :class="{'org-classes-menu-item-active': isMenuItemActive(menu)}" v-for="(menu, index) in menuData" :key="index">
          <router-link class="org-classes-menu-link" :to='{name: menu.indexPageName}'>{{menu.text}}</router-link>
        </div>
      </div>
      <div class="org-classes-reminder">
        <p class="org-classes-reminder-text">{{$t('org.viewOverdueClass')}}<span class="org-classes-reminder-text-history" @click="goToHistory"> {{$t('org.historicalData')}}</span></p>
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
            'OrgClassMembers',
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
          pageNames: ['OrgStudentList', 'OrgEditStudent'],
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
      getOrgClassesById: 'org/getOrgClassesById',
      currentOrgHaveExpired: 'org/currentOrgHaveExpired'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgRestUserCount() {
      if (this.currentOrgHaveExpired) return 0
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
    goToHistory() {
      this.$router.push({ name: 'HistoricalData' })
    },
    isMenuItemActive(menuItem) {
      return _.indexOf(menuItem.pageNames, this.currentPageName) !== -1
    }
  }
}
</script>
<style lang="scss" scoped>
.org-classes {
  background-color: #fff;
  border-radius: 8px;
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
    width: 234px;
    padding: 0 16px;
    &-item {
      display: inline-block;
      font-size: 16px;
      color: #999;
      border-color: transparent;
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
  &-reminder {
    flex: 1;
    &-text {
      line-height: 56px;
      margin: 0;
      text-align: left;
      color: #999;
      font-size: 14px;
      &-history {
        color: #2397f3;
        cursor: pointer;
      }
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

