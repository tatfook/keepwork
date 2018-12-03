<template>
  <div class="eductors-tab">
    <div class="eductors-tab-title">
      <span class="eductors-tab-title-line"></span>
      <span class="eductors-tab-title-text">{{$t('lesson.teachingContent')}}</span>
      <span class="eductors-tab-title-line"></span>
    </div>
    <div class="eductors-tab-operations">
      <span
        :class="['eductors-tab-operations-button', {'selected': currentTab === 0 }]"
        @click="switchTab(0)"
      >{{$t('lesson.onlineLessons')}}</span>
      <span
        :class="['eductors-tab-operations-button', {'selected': currentTab === 1 }]"
        @click="switchTab(1)"
      >{{$t('lesson.offlineGuidingLessons')}}</span>
      <span
        :class="['eductors-tab-operations-button', {'selected': currentTab === 2 }]"
        @click="switchTab(2)"
      >{{$t('lesson.instructionalVideos_2')}}</span>
    </div>

    <div class="eductors-tab-main">
      <div
        class="eductors-tab-main-item eductors-tab-main-item-online"
        v-show="currentTab === 0"
      >
        <div class="eductors-tab-main-title">{{$t('lesson.about.hottestLessons')}}</div>
        <div class="eductors-tab-main-item-wrap">
          <div
            class="eductors-tab-main-item-wrap-cell"
            v-for="(item, index) in lessons"
            :key="index"
          >
            <img
              class="eductors-tab-main-item-wrap-cell-img"
              :src="item.extra.coverUrl"
              :alt="item.packageName"
              @click="goLessonPackage(item)"
            >
            <div class="eductors-tab-main-item-wrap-cell-text-title" @click="goLessonPackage(item)">{{item.packageName}}</div>
            <div class="eductors-tab-main-item-wrap-cell-text">{{$t('lesson.include')}}: {{item.lessons.length}}{{$t('lesson.lessonsCount')}}</div>
            <div class="eductors-tab-main-item-wrap-cell-text"> {{$t('lesson.ages')}}: {{getPackageSuitableAge(item)}}</div>
            <div class="eductors-tab-main-item-wrap-cell-text-desc">{{$t('lesson.intro')}}: {{item.intro}}</div>
          </div>
        </div>
      </div>

      <div
        class="eductors-tab-main-item eductors-tab-main-item-offline"
        v-show="currentTab === 1"
      >
        <div class="eductors-tab-main-item-offline-wrap">
          <combo-box
            projectName="official/paracraft"
            filePath="learn/parent_tab_offline"
          ></combo-box>
        </div>
      </div>

      <div
        class="eductors-tab-main-item eductors-tab-main-item-video"
        v-show="currentTab === 2"
      >
        <div
          class="eductors-tab-main-item-video-tab"
          @click="handleMore"
        >
          <img
            src="@/assets/lessonImg/teaching-video_1.png"
            alt=""
          >
          <p>{{$t('lesson.animationsLesson')}}</p>
        </div>
        <div
          class="eductors-tab-main-item-video-tab"
          @click="handleMore"
        >
          <img
            src="@/assets/lessonImg/teaching-video_2.png"
            alt=""
          >
          <p>{{$t('lesson.programmingLesson')}}</p>
        </div>
        <div
          class="eductors-tab-main-item-video-tab"
          @click="handleMore"
        >
          <div>
            <img
              src="@/assets/lessonImg/teaching-video_3.png"
              alt=""
            >
          </div>
          <div>{{$t('lesson.CADLesson')}}</div>
        </div>
      </div>
    </div>
    <div class="eductors-tab-footer">
      <div
        class="eductors-tab-footer-more"
        @click="handleMore"
      >
        {{$t('lesson.viewMore')}}
      </div>
    </div>
  </div>

</template>

<script>
import { lesson } from '@/api'
import ComboBox from '@/components/combo/ComboBox'
export default {
  name: 'EductorsTab',
  components: {
    ComboBox
  },
  data() {
    return {
      currentTab: 0,
      lessons: []
    }
  },
  async mounted() {
    let res = await lesson.packages.getHotsPackages()
    res.length = 3
    this.lessons = res
  },
  methods: {
    switchTab(index) {
      this.currentTab = index
    },
    goLessonPackage(lessonPackage) {
      window.open(`/l/student/package/${lessonPackage.id}`)
    },
    getPackageSuitableAge(lessonPackage) {
      let { maxAge, minAge } = lessonPackage
      if (maxAge == 0 && minAge == 0) {
        return this.$t('lesson.packageManage.SuitableForAll')
      }
      return `${minAge}-${maxAge}`
    },
    goLesson() {
      this.$router.push(`/student/allteachingvideo`)
    },
    handleMore() {
      if (this.currentTab === 1) {
        return this.$router.push('/student/moreResources/offline')
      }
      if (this.currentTab === 2) {
        return this.$router.push('/student/allteachingvideo/animate')
      }
      this.$router.push(`/student/center`)
    }
  }
}
</script>


<style lang="scss">
.eductors-tab {
  max-width: 1200px;
  min-height: 605px;
  margin: auto;
  position: relative;
  &-title {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    &-line {
      width: 100px;
      height: 5px;
      background: #bcbcbc;
    }
    &-text {
      font-size: 36px;
      margin: 0 50px;
    }
  }
  &-operations {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 46px;
    &-button {
      cursor: pointer;
      margin: 0 15px;
      width: 240px;
      height: 39px;
      line-height: 39px;
      border: solid 1px #bcbcbc;
      border-radius: 19px;
      text-align: center;
      &.selected {
        background: #409eff;
        color: #fff;
        border: none;
      }
    }
  }
  &-main {
    &-title {
      font-size: 18px;
      color: #333;
      margin: 20px;
    }
    &-item-wrap {
      display: flex;
      justify-content: space-around;
      &-cell {
        &-img {
          height: 207px;
          width: 381px;
          border-radius: 6px;
          object-fit: cover;
          cursor: pointer;
        }
        &-text {
          color: #818181;
          font-size: 14px;
          line-height: 23px;
          width: 350px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 5px;
          &-title {
            color: #333;
            margin: 5px;
            font-weight: bold;
            cursor: pointer;
          }
          &-desc {
            margin: 5px;
            color: #818181;
            font-size: 14px;
            height: 40px;
            width: 350px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-height: 20px;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    &-item-offline {
      height: 450px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-item-video {
      margin-top: 62px;
      display: flex;
      justify-content: space-around;
      &-tab {
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        img {
          width: 382px;
          height: 212px;
          object-fit: cover;
        }
      }
    }
  }
  &-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    &-more {
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      padding: 0 130px;
      border-radius: 4px;
      font-size: 14px;
      color: #409eff;
      border-radius: 4px;
      border: solid 2px #409efe;
    }
  }
}

@media (max-width: 768px) {
  .eductors-tab {
    min-width: auto;
    min-height: auto;
    padding-bottom: 60px;
    &-main {
      &-title {
        display: none;
      }
      &-item {
        &-wrap {
          margin-top: 10px;
          flex-direction: column;
          &-cell {
            &-img {
              width: 100%;
            }
            &-text {
              width: 95%;
              &-desc {
                width: 95%;
              }
            }
          }
        }

        &-offline {
          height: auto;
          margin-top: 10px;
          &-wrap {
            background-color: #ffffff;
            border-radius: 4px;
            border: solid 2px #ffc46c;
            margin: 10px;
            padding: 10px 15px;
          }
        }

        &-video {
          flex-direction: column;
          margin-top: 0;
          &-tab {
            img {
              width: 100%;
              object-fit: contain;
            }
            p {
              margin: 0;
            }
          }
        }
      }
    }
    &-title {
      justify-content: flex-start;
      &-text {
        font-size: 16px;
        margin: 11px;
      }
      &-line {
        display: none;
      }
    }
    &-operations {
      margin-top: 0px;
      &-button {
        border-radius: 0px;
        flex: 1;
        margin: 0;
        border: none;
        font-size: 14px;
        color: #777;
        background: #f5f5f5;
      }
    }
    &-footer {
      &-more {
        width: 90%;
        margin: 0 auto;
        padding: 0;
        text-align: center;
      }
    }
  }
}
</style>


