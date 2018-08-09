<template>
<div class="lesson-packages">
  <el-row :gutter="20" class="lesson-packages-subject">
    <el-col v-for="coursePackage in sortedPackagesList" :key="coursePackage.id" :sm="12" :md="8">
        <div class="subject-desc">
          <img @click="enterPackageDetailPage(coursePackage.id)" class="subject-cover" :src="coursePackage.extra.coverUrl" alt="">
          <h4 :class="['subject-title',false ? 'beLearning':'']">{{coursePackage.packageName}}</h4>
          <span>Includes: {{coursePackage.cost}} lessons</span>
          <span>Ages: {{coursePackage.minAge}}~{{coursePackage.maxAge}}</span>
          <span>Intro : {{coursePackage.intro}}</span>
        </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Center',
  data(){
    return {
    }
  },
  computed: {
    ...mapGetters({
      packages: 'lesson/center/packagesList'
    }),
    packagesList() {
      return _.get(this.packages, 'rows',[])
    },
    sortedPackagesList(){
      return this.packagesList.sort((obj1, obj2) => obj1.updatedAt < obj2.updatedAt)
    }
  },
  async mounted(){
    await this.getPackagesList()
    console.log('packages',this.packages)
  },
  methods:{
    ...mapActions({
      getPackagesList: 'lesson/center/getPackagesList'
    }),
    enterPackageDetailPage(packageId){
      this.$router.push({
        path: `package/${packageId}`,
      })
    }
  }
}
</script>

<style lang="scss">
.lesson-packages {
  max-width: 1140px;
  margin: 0 auto;
  border: 1px solid #ccc;
  .lesson-packages-subject .subject-desc {
    width: 278px;
    margin:20px auto;
    .subject-cover {
      width: 278px;
      height: 160px;
      object-fit: cover;
      margin: 0 auto;
      border-radius: 6px;
      cursor: pointer;
    }
    .subject-title{
      margin-bottom: 10px;
      cursor: pointer;
    }
    .beLearning{
      color: #409eff;
    }
    span {
      display: block;
      font-size: 14px;
      line-height: 22px;
    }
    .learning {
      display: flex;
      border: 1px solid transparent;
      .learning-progress-wrap {
        flex: 1;
        .learning-progress {
          .el-progress-bar {
            padding-right: 10px !important;
          }
          .el-icon-circle-check {
            display: none;
          }
        }
        .progress-reminder{
          color: #00e200;
        }
      }
      .continue-learning {
        width: 72px;
        padding-left: 6px;
        margin: 0;
        .learning-continue-btn {
          width: 100%;
          padding:0 6px ;
          height: 28px;
          font-size: 12px;
          margin-top: 5px;
        }
      }
    }
    .start-to-learning{
      border: 1px solid transparent;
      .start-to-learn-btn{
        padding:0 6px ;
        height: 28px;
        font-size: 12px;
        margin: 5px auto;
        display: block;
      }
    }
    .finished-learning{
      border: 1px solid transparent;
      &-tip{
        display: block;
        margin: 5px auto;
        text-align: center;
        line-height: 28px;
        color: #00e200;
      }
    }
  }
}
</style>
