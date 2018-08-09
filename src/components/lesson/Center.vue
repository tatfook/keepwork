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
          <div class="purchase-lesson-package">
            <p class="purchase-tip">Return 100 coins after purchase</p>
            <div><el-button class="purchase-button" plain>RMB: ￥100.00</el-button></div>
            <div><el-button class="purchase-button" plain>Coins: 1000 coins</el-button></div>
          </div>
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
  max-width: 1200px;
  margin: 0 auto;
  .lesson-packages-subject .subject-desc {
    width: 287px;
    padding: 34px 34px 0;
    margin:20px auto;
    border: solid 2px #d2d2d2;
    border-radius: 1px;
    .subject-cover {
      width: 287px;
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
    .purchase-lesson-package{
      margin: 10px 0;
      border-top: 1px solid #e3e3e3;
      .purchase-tip{
        margin:14px 0 2px 0;
      }
      .purchase-button{
        width: 159px;
        height: 31px;
        padding: 0;
        line-height: 30px;
        border-radius: 15px;
        margin: 5px 0;
      }
    }
    
  }
}
</style>
