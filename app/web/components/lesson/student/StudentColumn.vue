<template>
  <div class="Learning-center">
    <div class="Learning-center-content">
      <div class="aside">
        <div class="profile-intro">
          <div class="profile">
            <img
              :src='userProfile.portrait || avatar'
              alt="portrait"
            >
          </div>
          <div class="nickname-wrap">
            <div class="nickname">{{username}}</div>
            <div class="beans"><span>{{beansCount}}{{$t('lesson.beans')}}</span><span
                class="detail"
                @click="goBeanDetail"
              >{{$t('lesson.packageManage.detailLabel')}} →</span></div>
          </div>
        </div>
        <div class="skillpoints">{{skillpointsCount}} {{$t('lesson.skillPoints')}} :</div>
        <div
          class="skills"
          :loading="loadingSkillsPoint"
        >
          <ul class="skills-list">
            <li
              v-for="(skill,index) in skillsList"
              :key="index"
            ><span class="skill-name">{{skillName(skill)}}：</span>
              <span>{{skill.score}}</span>
            </li>
          </ul>
        </div>
        <div class="options-wrap">
          <span
            v-for="(option,index) in optionArr"
            :key="index"
            :class="['options', {'selected': currOption == index}]"
            @click="switchSelect(index)"
          >{{option.name}}</span>
        </div>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
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
      loadingSkillsPoint: true,
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
    let payload = { userId: this.userId }
    await lesson.users
      .userSkills(payload)
      .then(res => {
        this.skillsList = res
        this.loadingSkillsPoint = false
      })
      .catch(error => console.log(error))
  },
  computed: {
    ...mapGetters({
      userId: 'user/userId',
      userProfile: 'user/profile',
      username: 'user/username',
      userinfo: 'lesson/userinfo'
    }),
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
    }
  },
  methods: {
    goBeanDetail() {
      this.$router.push('/student/bean')
      // this.$message.warning('程序员小姐姐努力开发中')
    },
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
.Learning-center {
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
        .options {
          display: block;
          height: 38px;
          line-height: 38px;
          margin: 16px 20px;
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
