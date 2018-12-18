<template>
  <div class="learning-center">
    <div class="learning-center-content">
      <div class="aside">
        <div class="profile-intro">
          <div class="profile">
            <img :src='userProfile.portrait || avatar' alt="portrait">
          </div>
          <div class="nickname-wrap">
            <div class="nickname">{{username}}</div>
            <div class="learning-center-tutor">
              <img v-if="isHaveTotur" src="@/assets/lessonImg/tutor_icon.png" alt="">
              {{isHaveTotur ? $t('lesson.mentorService') : $t('lesson.findMentor')}}
            </div>
            <div class="learning-center-skill-info">
              <span>{{skillpointsCount}} {{$t('lesson.skillPoints')}}</span>
              <span class="learning-center-skill-info-link" v-loading='isLoadingSkills' @click="isSkillDetailShow = true">{{$t('lesson.packageManage.detailLabel')}}<i class="el-icon-back"></i></span>
            </div>
          </div>
        </div>
        <div class="options-wrap">
          <span v-for="(option,index) in optionArr" :key="index" :class="['options', {'selected': currOption == index}]" @click="switchSelect(index)">{{option.name}}</span>
        </div>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
      <el-dialog class="learning-center-skill-dialog" :class="{'learning-center-skill-dialog-en': isEn}" title="技能点详情" :visible.sync="isSkillDetailShow">
        <div class="learning-center-skill-dialog-info">{{skillpointsCount}} {{$t('lesson.skillPoints')}}:</div>
        <ul class="learning-center-skill-dialog-skills">
          <li class="learning-center-skill-dialog-skills-item" v-for="(skill,index) in skillsList" :key="index">
            {{skillName(skill)}}：<span class="learning-center-skill-dialog-skills-count">{{skill.score}}</span>
          </li>
        </ul>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { locale } from '@/lib/utils/i18n'
import { mapGetters, mapActions } from 'vuex'
import { lesson } from '@/api'
import _ from 'lodash'
import colI18n from '@/lib/utils/i18n/column'
import avatar from '@/assets/img/default_portrait.png'

export default {
  name: 'StudentColumn',
  data() {
    return {
      avatar,
      skillsList: [],
      isLoadingSkills: false,
      loadingSkillsPoint: true,
      isSkillDetailShow: false,
      currOption: 0,
      optionArr: [
        { name: this.$t('lesson.onlineLesson') },
        { name: this.$t('lesson.offlineGuidingLesson') },
        { name: this.$t('lesson.instructionalVideos') }
      ]
    }
  },
  async mounted() {
    this.setActiveItem()
    await lesson.users
      .userSkills({ userId: this.userId })
      .then(res => {
        this.skillsList = res
        this.loadingSkillsPoint = false
      })
      .catch(() => {
      })
  },
  computed: {
    ...mapGetters({
      userId: 'user/userId',
      userProfile: 'user/profile',
      username: 'user/username',
      userinfo: 'lesson/userinfo',
      lessonUserTutor: 'lesson/userTutor',
    }),
    isHaveTotur() {
      return Boolean(this.lessonUserTutor && this.lessonUserTutor.tutorId)
    },
    beansCount() {
      return _.get(this.userinfo, 'bean', 0)
    },
    skillpointsCount() {
      let sum = 0
      if (this.skillsList.length === 0) {
        sum = 0
      } else {
        this.skillsList.every(skill => (sum += skill.score * 1))
      }
      return sum
    },
    isEn() {
      return locale === 'en-US' ? true : false
    }
  },
  methods: {
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    skillName(skill) {
      return colI18n.getLangValue(skill, 'skillName')
    },
    setActiveItem() {
      const SWITCH_TAG = {
        'LearningCenterPackages': '0',
        'OfflineGuidanceCourse': '1',
        'TeachingVideo': '2'
      }
      const { name } = this.$route
      this.currOption = SWITCH_TAG[name] || '0'
    },
    switchSelect(index) {
      this.currOption = index
      let routerName = ''
      switch (index) {
        case 0:
          routerName = 'LearningCenterPackages'
          break
        case 1:
          routerName = 'OfflineGuidanceCourse'
          break
        case 2:
          routerName = 'TeachingVideo'
          break
        default:
          break
      }
      this.$router.push({
        name: routerName
      })
    }
  }
}
</script>

<style lang="scss">
.learning-center {
  &-content {
    display: flex;
    margin: 10px auto;
    max-width: 1200px;
    .aside {
      width: 274px;
      margin-right: 16px;
      background: #fff;
      padding: 35px 0;
      overflow: hidden;
      text-align: center;
      &-content {
        background: #fff;
        padding: 30px 10px 50px;
        margin: 0 auto;
      }
      .profile-intro {
        .profile {
          width: 99px;
          height: 99px;
          margin: 0 auto;
          border-radius: 50%;
          border: solid 1px #ced0d2;
          margin-bottom: 20px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .nickname-wrap {
          .nickname {
            font-size: 24px;
            line-height: 34px;
            color: #333333;
            font-family: "ArialMT";
          }
          .beans {
            margin: 5px 8px;
            padding-bottom: 10px;
            color: #181818;
            font-size: 14px;
            .detail {
              color: #409eff;
              padding-left: 20px;
              cursor: pointer;
            }
          }
        }
      }
      .skillpoints {
        border-top: 1px solid #909399;
        font-size: 14px;
        margin: 0 20px;
        text-align: left;
        color: #333;
        padding-top: 15px;
      }

      .skills {
        margin: 0 20px 35px 20px;
        text-align: left;
        &-list {
          margin: 0;
          list-style: none;
          padding: 0;
          li {
            height: 34px;
            background: #f5f7f9;
            margin: 2px 0;
            line-height: 34px;
            padding: 0 4px;
            font-size: 14px;
            color: #333333;
            .skill-name {
              color: #707174;
            }
          }
        }
      }
      .options-wrap {
        margin: 20px;
        padding-top: 20px;
        border-top: 1px solid #e8e8e8;
        .options {
          display: block;
          height: 38px;
          line-height: 38px;
          margin: 0 0 20px;
          background-color: #f5f5f5;
          border-radius: 4px;
          border: solid 1px #bcbcbc;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          &.selected {
            background: #409efe;
            color: #fff;
          }
        }
      }
    }
    .main {
      flex: 1;
      padding: 0;
      background: #fff;
      overflow: hidden;
    }
  }
  &-tutor {
    cursor: pointer;
    font-size: 14px;
    color: #409efe;
    margin: 4px 0;
  }
  &-skill-info {
    font-size: 14px;
    color: #818181;
    &-link {
      color: #409efe;
      cursor: pointer;
    }
    .el-icon-back {
      transform: rotate(180deg);
      margin-left: 3px;
    }
  }
  &-skill-dialog {
    .el-dialog {
      width: 396px;
      max-width: 100%;
    }
    .el-dialog__header {
      padding: 0;
      text-align: center;
      height: 40px;
      line-height: 40px;
      background-color: #309efe;
    }
    .el-dialog__title {
      color: #fff;
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 14px;
      right: 16px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
      font-weight: bold;
    }
    .el-dialog__body {
      padding: 24px 42px 36px 42px;
    }
    &-skills {
      &-count {
        color: #303133;
      }
    }
    &-info {
      font-size: 14px;
      color: #777;
      margin-bottom: 16px;
    }
    ul {
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    li {
      list-style: none;
      width: 145px;
      border-bottom: 1px solid #ececec;
      font-size: 14px;
      color: #818181;
      height: 32px;
      line-height: 32px;
      &:nth-child(1),
      &:nth-child(2) {
        border-top: 1px solid #ececec;
      }
    }
    &-en {
      .el-dialog {
        width: 566px;
      }
      li {
        width: 230px;
      }
    }
  }

  .be-in-class {
    .el-dialog__body {
      .hint {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: rgb(229, 65, 4);
        .redIcon {
          margin-right: 10px;
          font-size: 30px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .Learning-center {
    &-content {
      display: block;
      .aside {
        width: 100%;
        box-sizing: border-box;
        .profile-intro {
          display: flex;
          .profile {
            width: 99px;
            margin-left: 22px;
          }
          .nickname-wrap {
            flex: 1;
            padding: 12px 60px 12px 0;
            text-align: right;
          }
        }
        .options-wrap {
          border-top: 12px solid #f6f7f8;
          padding-top: 32px;
          display: flex;
          .options {
            flex: 1;
            border: none;
            margin: 0;
            border-radius: 0;
          }
        }
      }
    }
    .be-in-class {
      .el-dialog {
        width: 90% !important;
      }
    }
  }
}
</style>
