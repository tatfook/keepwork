<template>
  <div class="creativity-page">
    <div class="creativity-page-create">
      <div class="creativity-page-create-center">
        <h3>创造，从项目开始</h3>
        <p class="open-word">项目，是一个作品的开始。</p>
        <p class="open-word">它将让你在学习中成长，让你体会到团结协作的快乐，让你成为优秀的管理者！</p>
        <el-button class="create" type="primary" @click="createMyProject">＋创建我的项目</el-button>
        <div class="project-type" v-if="!hasProjects">
          <el-row>
            <el-col :span="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_paracraft.png" alt="">
                <div class="project-type-item-title">Paracraft</div>
                <div class="project-type-item-brief">创造3D交互动画和游戏</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_web.png" alt="">
                <div class="project-type-item-title">网站</div>
                <div class="project-type-item-brief">创造属于你的网站</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="project-type-item">
                <img src="@/assets/img/create_knowledge.png" alt="">
                <div class="project-type-item-title">个人知识</div>
                <div class="project-type-item-brief">敬请期待！</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="learn-to-build" v-if="!hasProjects">
          <i class="el-icon-warning"></i>不太了解项目？马上学习如何创建项目</div>
      </div>
    </div>
    <div class="creativity-page-projects">
      <div class="creativity-page-projects-center">
        <div class="my-projects" v-if="hasProjects">
          <h4 class="browse-title">我的项目</h4>
          <el-row>
            <el-col :span="6" v-for="(project,index) in myProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="my-contribute-projects" v-if="hasProjects">
          <h4 class="browse-title">我参与的项目</h4>
          <el-row>
            <el-col :span="6" v-for="(project,index) in myContributeProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="others-projects">
          <h4 class="browse-title">看看其他人的项目</h4>
          <el-row>
            <el-col :span="6" v-for="(project,index) in allProjects" :key="index">
              <project-cell :project="project"></project-cell>
            </el-col>
          </el-row>
        </div>
        <div class="explore-more">
          <el-button class="more" type="primary">去探索更多好玩的项目 →</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from './ProjectCell'
import { keepwork } from '@/api'
import _ from 'lodash'
import { mapActions,mapGetters } from 'vuex'

export default {
  name: 'CreativityPage',
  data() {
    return {
      hasProjects: false,
      myProjects: [],
      myContributeProjects: [],
      visitOthersProjects: []
    }
  },
  components: {
    ProjectCell
  },
  async mounted(){
    this.setAllProjects()
    await Promise.all([
      keepwork.projects.getPersonalProjects(),
      keepwork.projects.getContributeProjects(),
    ]).then(res => {
      this.myProjects = res[0],
      this.myContributeProjects = res[1]
    }).catch(err => console.error(err))
    this.myProjects = [
          {
            choicenessNo: 62,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 1252,
            extra: {
              coverUrl:
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538218843433&di=57c0eb1ae527dd3d2ca5a456d7ac01f5&imgtype=0&src=http%3A%2F%2Fwww.xingzuoba.cn%2Ffile%2Fupload%2F2000%2F20170430%2F201704301494854563122.jpg'
            },
            hotNo: 0,
            id: 1,
            name: '笑傲江湖',
            privilege: 197,
            siteId: null,
            star: 58,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 32,
            user: {
              description: null,
              nickname: '哈哈哈',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: 'kevinxft'
            }
          },
          {
            choicenessNo: 70,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 125258,
            extra: {
              coverUrl:
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538227073141&di=c5dd3c7604513aefe125b0c1401b129c&imgtype=0&src=http%3A%2F%2Fimg1.sc115.com%2Fuploads%2Fsc%2Fjpg%2F144%2F18383.jpg'
            },
            hotNo: 0,
            id: 2,
            name: '神雕侠侣',
            privilege: 197,
            siteId: null,
            star: 189,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 10,
            user: {
              description: null,
              nickname: '香香',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: '香香'
            }
          },
          {
            choicenessNo: 58,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 12,
            extra: {
              coverUrl:
                'http://dik.img.lgdsy.com/pic/5/3255/6c792afdc6db20bb.jpg'
            },
            hotNo: 0,
            id: 3,
            name: '锦绣未央',
            privilege: 197,
            siteId: null,
            star: 269,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 40,
            user: {
              description: null,
              nickname: '3号牛肚',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: 'kevinxft'
            }
          },
          {
            choicenessNo: 12,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 122,
            extra: {
              coverUrl:
                'http://b.zol-img.com.cn/desk/bizhi/image/2/960x600/1362383591876.jpg'
            },
            hotNo: 0,
            id: 4,
            name: '大富科技',
            privilege: 197,
            siteId: null,
            star: 255,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 0,
            user: {
              description: null,
              nickname: '大天亮',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: '大天亮'
            }
          },
          {
            choicenessNo: 12,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 252,
            extra: {
              coverUrl:
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538219058252&di=22546ecd50dc263271f0ffe44074c38a&imgtype=0&src=http%3A%2F%2Fimg.tupianzj.com%2Fuploads%2Fallimg%2F20170514%2F0G4ae4NwY5443.jpeg'
            },
            hotNo: 0,
            id: 7,
            name: '嘿嘿哈哈',
            privilege: 197,
            siteId: null,
            star: 255,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 0,
            user: {
              description: null,
              nickname: '田螺一号',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: 'kevinxft'
            }
          }
        ]
    this.myContributeProjects = _.concat(this.myProjects)
    // this.visitOthersProjects = _.concat(this.myProjects)
  },
  computed:{
    ...mapGetters({
      allProjects: 'pbl/allProjects'
    }),
  },
  methods:{
    ...mapActions({
      setAllProjects: 'pbl/setAllProjects'
    }),
    createMyProject(){
      this.$router.push('/pbl/project/new')
    }
  }
}
</script>
<style lang='scss'>
.creativity-page {
  &-create {
    padding: 20px;
    background: #fff;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      .open-word {
        font-size: 14px;
        color: #909399;
        margin: 0;
      }
      .create {
        height: 36px;
        margin: 36px 0 60px;
      }
      .project-type {
        &-item {
          img {
            // width: 218px;
            height: 144px;
            object-fit: cover;
          }
          &-title {
            margin-top: 30px;
            font-size: 18px;
            color: #333;
          }
          &-brief {
            font-size: 13px;
            color: #999;
          }
        }
      }
      .learn-to-build {
        height: 36px;
        line-height: 36px;
        background: #f5f5f5;
        border: 1px solid #e8e8e8;
        font-size: 14px;
        margin: 40px 0;
        color: #909399;
      }
    }
  }
  &-projects {
    background: #f6f7f8;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      .my-projects {
      }
      .my-contribute-projects {
      }
      .others-projects {
      }
      .browse-title {
        font-size: 16px;
        color: #303133;
        margin: 0;
        padding: 24px 0;
      }
      .explore-more{
        text-align: center;
        .more{
          margin: 60px 0 80px 0;
          height: 36px;
          line-height: 36px;
          border-radius: 18px;
          font-size: 14px;
          padding: 0 16px;
        }
      }
    }
  }
}
</style>


