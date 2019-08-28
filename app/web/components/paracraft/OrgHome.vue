<template>
  <div class="org-home-container">
    <div class="org-home">
      <div class="org-home-header">
        <div class="org-home-header-center">
          <div class="org-home-header-name">
            姓名 <el-input v-model.trim="name" class="org-home-header-input"></el-input>
          </div>
          <div class="org-home-header-code">
            激活码 <el-input v-model="key" class="org-home-header-input"></el-input>
            <el-button @click="handleJoinOrg" :loading="isLoading" class="org-home-header-code-button">提交</el-button>
          </div>
          <div class="org-home-header-back">
            <!-- <el-button @click="handleBack" class="org-home-header-back-button" icon="iconfont icon-recall">返回</el-button> -->
          </div>
        </div>
      </div>
      <div class="org-home-joined">
        <div class="org-home-joined-title">已加入的机构</div>
        <el-row v-if="isHasOrg" class="org-home-joined-list" type="flex">
          <el-col class="org-home-joined-list-item" :span="12" v-for="item in userOrgList" :key="item.id">
            <Org-Cell :orgData="item"></Org-Cell>
          </el-col>
        </el-row>
        <div class="org-home-empty" v-else>
          <div class="org-home-empty-tips">成为机构学员，学习keepwork在线课程</div>
          <div @click="handleToOrgList" class="org-home-empty-more" round="">了解更多机构信息</div>
        </div>
      </div>
      <div class="org-home-more">
        <div class="org-home-more-title">
          更多学习资源
        </div>
        <div class="org-home-more-list">
          <div class="study-more-box" v-for="item in moreList" :key="item.title">
            <img class="study-more-box-img" :src="item.imgUrl" :alt="item.title">
            <div class="study-more-box-title">{{item.title}}</div>
            <div class="study-more-box-intro">
              <div class="study-more-box-intro-left">
                <div class="study-more-box-intro-left-text">{{item.text_1}}</div>
                <div class="study-more-box-intro-left-text">{{item.text_2}}</div>
              </div>
              <div class="study-more-box-intro-more">
                <el-button @click="handleToMore(item.moreLink)" class="study-more-box-intro-button" round>了解更多</el-button>
              </div>
            </div>
          </div>
          <div class="team-box">
            <div class="team-box-title">师资团队</div>
            <div class="team-box-text">我们的师资团队由拥有丰富教学经验和多年开发经验的职业程序员组成，致力于拓展编程教育愿景，希望能够帮助中国培养下一代优秀的程序员，也帮助更广大家庭的孩子们学会自主学习的方法。</div>
            <span class="team-box-more" @click="handleToMore(teamLink)">了解更多</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrgCell from './common/OrgCell'
import { paracraft } from '@/api'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'PracraftOrg',
  components: {
    OrgCell
  },
  async created() {
    await this.getUserOrgList()
  },
  data() {
    return {
      isLoading: false,
      name: '',
      key: ''
    }
  },
  methods: {
    ...mapActions({
      joinOrg: 'paracraft/joinOrg',
      getUserOrgList: 'paracraft/getUserOrgList',
      openLink: 'paracraft/openLink'
    }),
    handleToMore(link) {
      this.openLink(link)
    },
    handleToOrgList() {
      this.openLink('https://keepwork.com/s/lesson/organizationCooperation')
    },
    handleBack() {
      this.$notify({
        title: '返回',
        offset: 80
      })
    },
    async handleJoinOrg() {
      if (!this.name) {
        return this.$message({
          type: 'warning',
          message: '请输入姓名',
          offset: 80
        })
      }
      const key = this.key.replace(/ /g, '')
      if (!key) {
        return this.$message({
          type: 'warning',
          message: '请输入激活码',
          offset: 80
        })
      }
      this.isLoading = true
      const flag = await this.joinOrg({ realname: this.name, key })
      if (flag) {
        this.key = ''
        this.name = ''
      }
      this.isLoading = false
    }
  },
  computed: {
    ...mapGetters({
      userOrgList: 'paracraft/userOrgList',
      paracraftPORT: 'paracraft/paracraftPORT'
    }),
    isHasOrg() {
      return this.userOrgList.length > 0
    },
    moreList() {
      return [
        {
          imgUrl: require('@/assets/paracraft/textbookX.png'),
          title: '教材购买',
          text_1: 'Paracraft编程入门',
          text_2: '学生、家长、教师的AI与编程入门教材，适合7岁以上用户使用',
          moreLink: `https://keepwork.com/s/textbook`
        },
        {
          imgUrl: require('@/assets/paracraft/documentX.png'),
          title: '免费文档',
          text_1: '免费在线资料',
          text_2: '通过免费的在线资料进行学习，涵盖动画、编程、CAD',
          moreLink: `https://keepwork.com/official/docs/index`
        },
        {
          imgUrl: require('@/assets/paracraft/lessonX.png'),
          title: '在线课程',
          text_1: '通过一流的在线课程学习编程',
          text_2:
            'Keepwork官方认证课程可在线进行自主学习并提供系统的学习路径。',
          moreLink: `https://keepwork.com/s/lesson`
        },
        {
          imgUrl: require('@/assets/paracraft/teachingX.png'),
          title: '学校和培训机构',
          text_1: '赋予学生创造力',
          text_2: '为学校、培训机构提供优惠的教学资源。',
          moreLink: 'https://biz.keepwork.com/'
        }
      ]
    },
    teamLink() {
      return 'https://keepwork.com/s/teachingGroup'
    }
  }
}
</script>

<style lang="scss" scoped>
$yellow: #ffdf66;
$width: 820px;
.org-home-container {
  background: #393939;
}
.org-home {
  color: #fff;
  min-height: 100vh;
  margin: 0 auto;
  &-header {
    background: #232223;
    &-center {
      height: 74px;
      display: flex;
      width: $width;
      margin: 0 auto;
    }
    &-input {
      width: 204px;
      margin: 0 8px;
      /deep/ .el-input__inner {
        background: #232223;
        height: 32px;
        color: #fff;
        &:focus {
          border-color: $yellow;
        }
      }
    }

    &-name,
    &-code {
      display: flex;
      align-items: center;
      padding: 0 20px;
      &-button {
        background: #737373;
        color: #fff;
        padding: 9px 33px;
        &:hover {
          border-color: $yellow;
          background: #1c1c1c;
        }
      }
    }

    &-back {
      display: flex;
      align-items: center;
      &-button {
        background: #1c1c1c;
        color: #fff;
        padding: 9px 6px;
        margin-left: 36px;
        /deep/.iconfont {
          margin-right: 5px;
        }
        &:hover {
          border-color: $yellow;
        }
      }
    }
  }

  &-joined {
    width: $width;
    margin: 0 auto;
    &-title {
      height: 63px;
      line-height: 63px;
      padding-left: 20px;
    }
    &-list {
      flex-wrap: wrap;
      &-item {
        text-align: center;
        margin-bottom: 26px;
      }
    }
  }

  &-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    &-tips {
      color: #999;
    }
    &-more {
      display: inline-block;
      border: 1px solid #fff;
      padding: 4px 16px;
      margin-top: 20px;
      border-radius: 20px;
      cursor: pointer;
      &:hover {
        color: #232223;
        background: #fff;
      }
    }
  }

  &-more {
    width: $width;
    margin: 0 auto;
    &-title {
      padding-left: 20px;
    }

    &-list {
      padding-bottom: 40px;
      .study-more-box {
        margin: 0 auto;
        width: 786px;
        padding: 21px;
        box-sizing: border-box;
        background: #4d4d4d;
        border-radius: 10px;
        margin-top: 26px;
        &-img {
          width: 100%;
          object-fit: none;
        }

        &-title {
          font-size: 24px;
          margin: 20px 16px;
        }

        &-intro {
          display: flex;
          margin-top: 20px;
          color: #999999;
          &-left {
            flex: 1;
            margin-left: 16px;
            &-text {
              line-height: 24px;
              font-size: 16px;
            }
          }

          &-button {
            background: #4d4d4d;
            border-color: #409eff;
            color: #409eff;
            &:hover {
              background: #409eff;
              color: #fff;
            }
          }
        }
      }

      .team-box {
        width: 786px;
        height: 366px;
        margin: 26px auto;
        background: url('../../assets/paracraft/team.png') center top no-repeat;
        padding: 30px;
        box-sizing: border-box;
        &-title {
          font-size: 24px;
          margin-top: 40px;
          position: relative;
          &::after {
            content: ' ';
            display: inline-block;
            background: #2397f3;
            width: 24px;
            height: 4px;
            border-radius: 2px;
            position: absolute;
            left: 0;
            bottom: 0;
            margin-bottom: -15px;
          }
        }
        &-text {
          font-size: 14px;
          width: 60%;
          margin-top: 30px;
          line-height: 26px;
        }

        &-more {
          display: inline-block;
          padding: 6px 20px;
          border: 1px solid #fff;
          border-radius: 30px;
          margin-top: 80px;
          cursor: pointer;
          &:hover {
            background: #fff;
            color: #572fea;
          }
        }
      }
    }
  }
}
</style>