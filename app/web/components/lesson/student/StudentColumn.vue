<template>
  <div class="Learning-center">
    <el-row class="student">
      <el-col :md="6" class="aside">
        <div class="aside-content">
          <div class="profile">
            <img :src='userProfile.portrait || avatar' alt="portrait">
          </div>
          <div class="nickname">{{username}}</div>
          <div class="beans"><span>{{beansCount}}{{$t('lesson.beans')}}</span><span class="detail" @click="goBeanDetail">{{$t('lesson.packageManage.detailLabel')}} →</span></div>
          <div class="skillpoints">{{skillpointsCount}} {{$t('lesson.skillPoints')}} :</div>
          <div class="skills" :loading="loadingSkillsPoint">
            <ul class="skills-list">
              <li v-for="(skill,index) in skillsList" :key="index"><span class="skill-name">{{skillName(skill)}}：</span>
                <span>{{skill.score}}</span>
              </li>
            </ul>
          </div>
          <span v-for="(option,index) in optionArr" :key="index" :class="['options', {'selected': currOption == index}]" @click="switchSelect(index)">{{option.name}}</span>
        </div>
      </el-col>
      <el-col :md="18" class="main">
        <router-view></router-view>
      </el-col>
    </el-row>
    <div class="be-in-class" v-show="beInClassDialog">
      <el-dialog title="" center :visible.sync="beInClassDialog" width="30%" :before-close="handleClose">
        <div class="hint">
          <i class="el-icon-warning redIcon"></i>{{$t('lesson.beInClass')}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="backCurrentClass">{{$t('lesson.resumeOldClass')}}</el-button>
          <el-button type="primary" @click="enterNewClass">{{$t('lesson.enterNewClass')}}</el-button>
        </span>
      </el-dialog>
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
      classID: '',
      skillsList: [],
      loadingSkillsPoint: true,
      beInClassDialog: false,
      currOption: 0,
      optionArr: [
        {name: '线上课程'},
        {name: '线下导引课'},
        {name: '教学视频'}
      ]
    }
  },
  async mounted() {
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
    },
    
  },
  methods: {
    goBeanDetail() {
      // this.$router.push('/student/bean')
      this.$message.warning('程序员小姐姐努力开发中')
    },
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    handleClose() {
      this.beInClassDialog = false
    },
    skillName(skill) {
      return colI18n.getLangValue(skill, 'skillName')
    },
    switchSelect(index){
      this.currOption = index
      let routerName = ''
      switch(index){
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
  .student {
    margin: 0 auto;
    max-width: 1150px;
    .aside {
      background: #f8f8f8;
      padding: 0 16px;
      overflow: hidden;
      text-align: center;
      &-content {
        background: #fff;
        padding: 30px 10px 50px;
        margin: 0 auto;
      }
      .profile {
        width: 99px;
        height: 99px;
        margin: 0 auto;
        border-radius: 50%;
        border: solid 1px #ced0d2;
        margin-top: 37px;
        margin-bottom: 20px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .nickname {
        font-size: 24px;
        line-height: 34px;
        color: #333333;
        font-family: 'ArialMT';
      }
      .beans {
        border-bottom: 1px solid #909399;
        margin: 5px 8px 15px;
        padding-bottom: 20px;
        color: #181818;
        font-size: 14px;
        .detail {
          color: #409eff;
          padding-left: 20px;
          cursor: pointer;
        }
      }
      .skillpoints {
        width: 233px;
        font-size: 14px;
        margin: 10px auto;
        text-align: left;
        color: #333;
      }

      .skills {
        margin: 0 auto 35px;
        width: 233px;
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
      .options {
        display: block;
        height: 38px;
        line-height: 38px;
        margin-bottom: 16px;
        background-color: #f5f5f5;
        border-radius: 4px;
        border: solid 1px #bcbcbc;
        font-size: 16px;
        color: #333;
        cursor: pointer;
        &.selected{
          background: #409efe;
          color: #fff;
        }
      }
    }
    .main {
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
    .be-in-class {
      .el-dialog {
        width: 90% !important;
      }
    }
  }
}
</style>
