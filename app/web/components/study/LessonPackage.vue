<template>
  <div class="lesson-package-page">
    <div class="lesson-package-page-teachers">
      <div class="lesson-package-page-teachers-desc">
        <h4 class="lesson-package-page-teachers-desc-title">在线课程</h4>
        <span class="lesson-package-page-teachers-desc-rectangle"></span>
        <p class="lesson-package-page-teachers-desc-text">每个在线课程附带详细的分步指导和实践项目。<br>我们的在线课程已授权给学校和培训机构，请与我们的合作机构联系，选择适合你的课程，开始学习之旅吧。</p>
        <span class="lesson-package-page-teachers-desc-more" @click="toOrganizationCooperationPage">与合作机构联系</span>
      </div>
    </div>
    <div class="lesson-package-page-tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="i.tagname" :name="`${i.id}`" v-for="(i,index) in packageTagsData" :key="index">
          <div class="lesson-package-page-tab-packages">
            <el-row>
              <el-col class="hot-lesson" :sm="12" :md="6" :xs="12" v-for="(lessonPackage,index) in PackagesDataByTag" :key="index">
                <lesson-package-cell :lessonPackage="lessonPackage"></lesson-package-cell>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { keepwork } from '@/api'
import LessonPackageCell from '@/components/common/LessonPackageCell'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LessonPackage',
  data() {
    return {
      activeName: '0',
      packageTags: []
    }
  },
  async created() {
    this.packageTags = await this.getPackageSystemTags(2)
    this.activeName = _.toString(this.packageTagsData[0].id)
    await this.getPackageBySystemTags({ typeId: this.activeName })
  },
  computed: {
    ...mapGetters({
      PackagesByTag: 'lesson/PackagesByTag'
    }),
    packageTagsData() {
      let newData = _.map(this.packageTags, i => {
        return {
          ...i,
          sn: _.get(i, 'extra.sn', 99999)
        }
      })
      return newData.sort(this.sortBySn)
    },
    PackagesDataByTag() {
      let data = this.PackagesByTag({ typeId: this.activeName })
      let packageData = _.get(data, 'tag.packages', [])
      return _.map(packageData, i => {
        return {
          cover: i.extra.coverUrl,
          title: i.packageName,
          total_lessons: i.lessonCount,
          age_min: i.minAge,
          age_max: i.maxAge,
          description: i.intro,
          id: i.id
        }
      })
    }
  },
  methods: {
    ...mapActions({
      getPackageSystemTags: 'lesson/getPackageSystemTags',
      getPackageBySystemTags: 'lesson/getPackageBySystemTags'
    }),
    sortBySn(obj1, obj2) {
      return obj1.sn <= obj2.sn ? -1 : 1
    },
    async handleClick(tab) {
      this.activeName = tab.name
      await this.getPackageBySystemTags({ typeId: tab.name })
    },
    toOrganizationCooperationPage() {
      this.$router.push({ name: 'OrganizationCooperation'})
    }
  },
  components: {
    LessonPackageCell
  }
}
</script>

<style lang="scss" scoped>
.lesson-package-page {
  &-teachers {
    max-width: 1200px;
    margin: 0 auto 24px;
    min-height: 300px;
    background: url(../../assets/study/lesson_longer.png) center top no-repeat;
    &-desc {
      max-width: 532px;
      color: #fff;
      padding: 10px 0 0 30px;
      &-title {
        font-size: 24px;
        margin: 30px 0 18px;
      }
      &-rectangle {
        display: block;
        width: 29px;
        height: 5px;
        background-color: #2397f3;
        border-radius: 3px;
      }
      &-text {
        font-size: 14px;
        line-height: 30px;
        margin-top: 25px;
      }
      &-more {
        display: inline-block;
        padding: 6px 22px;
        border: 1px solid #fff;
        border-radius: 18px;
        font-size: 14px;
        margin-top: 20px;
        cursor: pointer;
        background: #fff;
        color: #1ab7f7;
      }
    }
  }
  &-tab {
    max-width: 1200px;
    margin: 0 auto 24px;
  }
}
</style>

