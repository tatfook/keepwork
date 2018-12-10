<template>
  <div class="about">
    <div class="about-carousel">
      <el-carousel
        @change="getImgIndex"
        @click.native="downloadTool"
      >
        <el-carousel-item
          v-for="(img,index) in imgUrls"
          :key="index"
        >
          <img
            class="about-carousel-img"
            :src="img.url"
            alt=""
          >
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="about-title">
      <img
        class="rectangle1"
        src="@/assets/lessonImg/aboutPageImg/rounded_rectangle.png"
        alt=""
      >
      <span class="topic">{{$t('lesson.about.hottestLessons')}}</span>
      <img
        class="rectangle2"
        src="@/assets/lessonImg/aboutPageImg/rounded_rectangle.png"
        alt=""
      >
    </div>
    <div class="about-video">
      <el-row :gutter="20">
        <el-col
          :sm="24"
          :md="8"
          v-for="(coursePackage,index) in hotsPackages"
          v-if="index < 3"
          :key="coursePackage.id"
        >
          <div class="subject-desc">
            <div
              class="img-wrap"
              @click="enterPackageDetailPage(coursePackage.id)"
            ><img
                class="subject-cover"
                :src="coursePackage.extra.coverUrl"
                alt=""
              ></div>
            <h4
              :title="coursePackage.packageName"
              :class="['subject-title']"
              @click="enterPackageDetailPage(coursePackage.id)"
            >{{coursePackage.packageName}}</h4>
            <span>{{$t('lesson.include')}}: {{coursePackage.lessons.length}} {{$t('lesson.lessonsCount')}}</span>
            <span>{{$t('lesson.ages')}}: {{getCoursePackageSuitableAge(coursePackage)}}</span>
            <span :title="coursePackage.intro">{{$t('lesson.intro')}}: {{coursePackage.intro}}</span>
            <div class="purchase-lesson-package">
              <div
                :class="['purchase-tip',{'hidden': coursePackage.rmb == 0}]"
                v-html="$t('lesson.backInfo', { backCoinCount: `<span class='red'>${coursePackage.rmb}</span>` })"
              ></div>
              <div :class="['purchase-money',{'hidden': coursePackage.rmb == 0}]">
                <span class="money">
                  {{$t('lesson.rmbPrice')}}:
                  <span class="red">￥{{coursePackage.rmb}}</span>
                </span>
              </div>
              <div class="purchase-money">
                <span
                  class="money free"
                  v-if="coursePackage.rmb == 0"
                >{{$t('lesson.free')}}</span>
                <span
                  class="money"
                  v-else
                >
                  {{$t('lesson.coinsPrice')}}:
                  <span class="red">{{coursePackage.coin}}</span> {{$t('lesson.coins')}}
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="about-view-more">
      <div
        class="about-view-more-btn"
        @click="gotoLessons"
      >
        <span class="tip">{{$t('lesson.about.viewMoreLessons')}}</span>
        <img
          class="next next-1"
          src="@/assets/lessonImg/aboutPageImg/next.png"
          alt=""
        >
        <img
          class="next next-2"
          src="@/assets/lessonImg/aboutPageImg/next.png"
          alt=""
        >
        <img
          class="next next-3"
          src="@/assets/lessonImg/aboutPageImg/next.png"
          alt=""
        >
      </div>
    </div>
    <div class="about-teacher-student">
      <div class="content">
        <el-row>
          <el-col
            class="right-line"
            :sm="12"
            :xs="24"
          >
            <div class="content-img"><img
                src="@/assets/lessonImg/aboutPageImg/teacher.png"
                alt=""
              ></div>
            <h1>{{$t('lesson.about.teacher')}}</h1>
            <h5 style="font-size:24px;">{{$t('lesson.about.engageStudents')}}</h5>
            <p>{{$t('lesson.about.teacherTalk')}}</p>
          </el-col>
          <el-col
            :sm="12"
            :xs="24"
          >
            <div class="content-img"><img
                src="@/assets/lessonImg/aboutPageImg/student.png"
                alt=""
              ></div>
            <h1>{{$t('lesson.about.student')}}</h1>
            <h5 style="font-size:24px;">{{$t('lesson.about.playGame')}}</h5>
            <p>{{$t('lesson.about.studentTalk')}}</p>
          </el-col>
        </el-row>
        <div class="line hidden-xs-only"></div>
      </div>
    </div>
    <div class="about-title">
      <img
        class="rectangle1"
        src="@/assets/lessonImg/aboutPageImg/rounded_rectangle.png"
        alt=""
      >
      <span class="topic">{{$t('lesson.about.aboutLessons')}}</span>
      <img
        class="rectangle2"
        src="@/assets/lessonImg/aboutPageImg/rounded_rectangle.png"
        alt=""
      >
    </div>
    <div class="about-lesson">
      <el-row>
        <el-col
          :md="12"
          :xs="24"
        >
          <el-row>
            <el-col :span="6">
              <div class="desc-img"><img
                  src="@/assets/lessonImg/aboutPageImg/animation.png"
                  alt=""
                ></div>
            </el-col>
            <el-col :span="18">
              <div class="desc-text">
                <h2>{{$t('lesson.about.animations')}}</h2>
                <p>{{$t('lesson.about.animationsTalk')}}</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col
          :md="12"
          :xs="24"
        >
          <el-row>
            <el-col :span="6">
              <div class="desc-img"><img
                  src="@/assets/lessonImg/aboutPageImg/solve_problem.png"
                  alt=""
                ></div>
            </el-col>
            <el-col :span="18">
              <div class="desc-text">
                <h2>{{$t('lesson.about.usage')}}</h2>
                <p>{{$t('lesson.about.usageTalk')}}</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col
          :md="12"
          :xs="24"
        >
          <el-row>
            <el-col :span="6">
              <div class="desc-img"><img
                  src="@/assets/lessonImg/aboutPageImg/convenient_service.png"
                  alt=""
                ></div>
            </el-col>
            <el-col :span="18">
              <div class="desc-text">
                <h2>{{$t('lesson.about.teachProgramming')}}</h2>
                <p>{{$t('lesson.about.teachProgrammingTalk')}}</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col
          :md="12"
          :xs="24"
        >
          <el-row>
            <el-col :span="6">
              <div class="desc-img price-pic"><img
                  src="@/assets/lessonImg/aboutPageImg/friendly_prices.png"
                  alt=""
                ></div>
            </el-col>
            <el-col :span="18">
              <div class="desc-text">
                <h2>{{$t('lesson.about.expensive')}}</h2>
                <p>{{$t('lesson.about.expensiveTalk')}}</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div
      class="about-letter"
      v-if="isEn"
    >
      <div class="about-letter-border">
        <div class="about-letter-content">
          <div class="about-letter-content-title">
            <span>A Letter to Parents and Teachers</span>
            <span><img
                class="letter"
                src="@/assets/lessonImg/aboutPageImg/letter.png"
                alt=""
              ></span>
          </div>
          <p>Hi, Parents and Teachers,</p>
          <p>I am Xizhi, the developer of
            <a href="https://keepwork.com/intro/keepwork/NPL">Neural Parallel Language</a> and the 3d animation & game making tool called
            <a href="https://keepwork.com/intro/keepwork/paracraft">Paracraft</a>. In 1989, at the age of 7, I wrote my first program on a IBM PC in my father’s lab. From March 2018, I made a decision to create one computer science lesson every week using Paracraft and NPL. Throughout the lessons, I want to share my first 12 years of programming life with all kids around the world including my own. Click
            <a
              href="#"
              @click.stop.prevent="gotoHere"
            >here</a> to read my autobiography on programming.</p>
          <p>All software used in the lessons are free and open source, including paracraft and NPL. All lessons we sell are also free to read online, and we only charge you a small subscription fee in order for your kids to read the source code of the animation or game while they play it. We encourage you to see the
            <a
              href="#"
              @click.stop.prevent="gotoLessons"
            >lessons</a> yourself and read together with your kids, as I would do the same thing with my own child.</p>
          <p>I have a small International team that is doing Artificial Intelligence research using NPL and paracraft. The software and language that is taught in our lessons is the same set of tools we use for our serious research in AI. Our NPL research center at Tatfook has open sourced over
            <a href="https://github.com/LiXizhi/NPLRuntime/wiki">2 million lines of code</a> written by
            <a href="https://github.com/tatfook">ourselves on github</a>. Your payment or donation will greatly help us to continue our work with more and more talented programmers and scientists.</p>
          <p>Finally, if you or your kids want to join us one day, please email me: lixizhi@yeah.net</p>

          Best<br> Xizhi, Li<br> CTO of Tatfook Network Co.<br>
        </div>
      </div>
    </div>
    <div
      class="about-letter"
      v-else
    >
      <div class="about-letter-border">
        <div class="about-letter-content">
          <div class="about-letter-content-title">
            <span>致家长和老师的一封信</span>
            <span><img
                class="letter"
                src="@/assets/lessonImg/aboutPageImg/letter.png"
                alt=""
              ></span>
          </div>
          <p>各位家长和老师，你们好！</p>
          <p>我是西峙，NPL语言
            <a href="https://keepwork.com/intro/keepwork/NPL">Neural Parallel Language</a>和3D动画游戏制作软件Paracraft的开发者。 在1989年，我七岁的时候就利用IBM计算机在我父亲的实验室编写了我的第一个程序。 从2018年3月起，我决定利用
            <a href="https://keepwork.com/intro/keepwork/paracraft">Paracraft</a>和NPL语言在每周都创建一节计算机课程。 我想通过课程向全世界所有的儿童包括我自己来分享我十二年的编程生活。点击
            <a
              href="#"
              @click.stop.prevent="gotoHere"
            >这里</a>来阅读我的编程生涯自传。</p>
          <p>在课程中所有的软件都是免费并且开源的，包括paracraft和NPL。 我们的所有课程都可以在线免费阅读，我们只收取你一小部分订阅费用为了帮助你的孩子在玩的过程中阅读动画或者游戏的源代码。 我们鼓励你自己去看
            <a
              href="#"
              @click.stop.prevent="gotoLessons"
            >课程</a>并和你的孩子一起阅读，因为我也在和我自己的孩子在做同样的事情。</p>
          <p>我有一个小的国际团队在用NPL和paracraft做人工智能。 我们课程中的软件和语言是和我们应用在人工智能研究中同样一套工具。 我们的大富科技NPL研究中心已经开源了
            <a href="https://github.com/LiXizhi/NPLRuntime/wiki">两百万行代码</a>可以在
            <a href="https://github.com/tatfook">我们的github</a>中查看。你的付款或者捐赠将极大的帮助我们与更多的有天赋的程序员或者科学家工作。</p>
          <p>最后，如果你的孩子有一天想加入我们，可以联系我 ：lixizhi@yeah.net</p>
          大富网络科技有限公司技术总监<br> 李西峙
          <br>
        </div>
      </div>
    </div>
    <div class="about-title">
      <img
        class="rectangle1"
        src="@/assets/lessonImg/aboutPageImg/rounded_rectangle.png"
        alt=""
      >
      <span class="topic">{{$t('lesson.about.Partners')}}</span>
      <img
        class="rectangle2"
        src="@/assets/lessonImg/aboutPageImg/rounded_rectangle.png"
        alt=""
      >
    </div>
    <div class="about-badge">
      <el-row>
        <el-col :span="4">
          <div class="img-wrap"><img
              src="@/assets/lessonImg/aboutPageImg/beijing_open_university.png"
              alt=""
            ></div>
          <div>{{$t('lesson.about.beijingOpenUniversity')}}</div>
        </el-col>
        <el-col :span="4">
          <div class="img-wrap"><img
              src="@/assets/lessonImg/aboutPageImg/zhejiang_university_logo.png"
              alt=""
            ></div>
          <div>{{$t('lesson.about.zhejiangUniversity')}}</div>
        </el-col>
        <el-col :span="4">
          <div class="img-wrap"><img
              src="@/assets/lessonImg/aboutPageImg/harbin_institute_of_technology.png"
              alt=""
            ></div>
          <div>{{$t('lesson.about.harbinInstituteOfTechnology')}}</div>
        </el-col>
        <el-col :span="4">
          <div class="img-wrap"><img
              src="@/assets/lessonImg/aboutPageImg/anhui_polytechnic_university.png"
              alt=""
            ></div>
          <div>{{$t('lesson.about.anhuiPolytechnicUniversity')}}</div>
        </el-col>
        <el-col :span="4">
          <div class="img-wrap"><img
              src="@/assets/lessonImg/aboutPageImg/beijing_union_university.png"
              alt=""
            ></div>
          <div>{{$t('lesson.about.beijingUnionUniversity')}}</div>
        </el-col>
        <el-col :span="4">
          <div class="img-wrap"><img
              class="tatfook"
              src="@/assets/lessonImg/aboutPageImg/tatfook.png"
              alt=""
            ></div>
          <div>{{$t('lesson.about.tatfook')}}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import "element-ui/lib/theme-chalk/display.css";
import { locale } from "@/lib/utils/i18n";
import { lesson } from "@/api";
import img1 from "@/assets/lessonImg/aboutPageImg/top_banner1.png";
import img2 from "@/assets/lessonImg/aboutPageImg/top_banner2.png";
import img3 from "@/assets/lessonImg/aboutPageImg/top_banner3.png";
import img4 from "@/assets/lessonImg/aboutPageImg/top_banner4.png";

const TeacherPageReg = /^\/teacher/;
const StudentPageReg = /^\/student/;
export default {
  name: "About",
  data() {
    return {
      isEn: locale === "en-US",
      imgUrls1: [{ url: img1 }, { url: img2 }],
      imgUrls2: [{ url: img3 }, { url: img4 }],
      imgIndex: 0,
      hotsPackages: [],
      animation: ""
    };
  },
  async mounted() {
    this.hotsPackages = await lesson.packages.getHotsPackages();
  },
  computed: {
    imgUrls() {
      return this.isEn ? this.imgUrls1 : this.imgUrls2;
    },
    nowFullPath() {
      return this.$route.fullPath;
    },
    isTeacherPage() {
      return TeacherPageReg.test(this.nowFullPath);
    },
    isStudentPage() {
      return StudentPageReg.test(this.nowFullPath);
    }
  },
  methods: {
    getImgIndex(index) {
      this.imgIndex = index;
    },
    downloadTool() {
      if (this.imgIndex === 1) {
        window.location.href = "http://www.paracraft.cn/download?lang=zh";
      }
    },
    gotoLessons() {
      if (this.isStudentPage) {
        this.$router.push({
          path: `/student/center`
        });
      } else {
        this.$router.push({
          path: `/teacher/center`
        });
      }
    },
    gotoHere() {
      if (this.isStudentPage) {
        this.$router.push({
          path: `/student/autobiography`
        });
      } else {
        this.$router.push({
          path: `/teacher/autobiography`
        });
      }
    },
    enterPackageDetailPage(packageId) {
      this.$router.push({
        path: `package/${packageId}`
      });
    },
    getCoursePackageSuitableAge(packageDetail) {
      let { minAge, maxAge } = packageDetail;
      if (minAge == 0 && maxAge == 0) {
        return this.$t("lesson.packageManage.SuitableForAll");
      }
      return `${minAge}-${maxAge}`;
    }
  }
};
</script>

<style lang="scss">
.about {
  &-carousel {
    .el-carousel__container {
      height: 500px !important;
    }
    &-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      cursor: pointer;
    }
  }
  &-title {
    margin: 40px auto;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .topic {
      padding: 0 30px;
      font-size: 40px;
      letter-spacing: 2px;
      color: #333333;
    }
    .rectangle2 {
      transform: rotateY(-180deg);
      height: 100%;
      line-height: 100%;
    }
  }
  &-video {
    max-width: 1200px;
    margin: 0 auto;
    .subject-desc {
      width: 287px;
      height: 415px;
      padding: 34px 34px 6px;
      margin: 20px auto;
      border: solid 2px #d2d2d2;
      border-radius: 1px;
      background: #fff;
      .img-wrap {
        width: 287px;
        height: 160px;
        border-radius: 6px;
        margin: 0 auto;
        cursor: pointer;
        .subject-cover {
          width: 287px;
          height: 160px;
          object-fit: cover;
          border-radius: 6px;
        }
      }
      .subject-title {
        font-size: 18px;
        margin-bottom: 10px;
        height: 24px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333333;
      }
      span {
        display: block;
        font-size: 14px;
        line-height: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #777;
      }
      .purchase-lesson-package {
        margin: 10px 0;
        border-top: 1px solid #e3e3e3;
        .hidden {
          visibility: hidden;
        }
        .red {
          color: #e4461f;
          display: inline;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .purchase-tip {
          color: #3491f0;
          margin: 14px 0 5px 0;
          font-size: 14px;
        }
        .purchase-money {
          margin: 2px 0;
          cursor: default;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .free {
            color: #67c23a;
          }
          .money {
            font-size: 14px;
            display: inline-block;
            padding: 0 12px;
            height: 27px;
            border: solid 2px #f3f3f3;
            text-align: left;
            line-height: 27px;
            border-radius: 15px;
            max-width: 255px;
            min-width: 132px;
            text-align: center;
          }
        }
      }
    }
  }
  &-view-more {
    &-btn {
      width: 322px;
      margin: 30px auto;
      position: relative;
      cursor: pointer;
      height: 77px;
      background: url("../../../assets/lessonImg/aboutPageImg/view_more_lesson.png")
        no-repeat;
      background-size: cover;
      padding-left: 20px;
      .tip {
        text-align: center;
        line-height: 70px;
        font-size: 18px;
        color: #ffffff;
        display: inline-block;
        width: 200px;
      }
      .next {
        position: absolute;
        top: 28px;
        left: 230px;
        &-2 {
          left: 240px;
        }
        &-3 {
          left: 250px;
        }
      }
    }
  }
  &-teacher-student {
    background: #f8edd9;
    padding: 50px;
    margin: 40px 0;
    .content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      &-img {
        width: 396px;
        height: 383px;
        margin: 0 auto;
      }
      p {
        text-align: left;
        padding-left: 10px;
      }
      .el-row {
        .el-col {
          padding: 0 50px;
        }
      }
      .line {
        width: 2px;
        height: 100%;
        background: #fff;
        position: absolute;
        top: 20px;
        left: 50%;
      }
    }
  }
  &-lesson {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px;
    .desc-img {
      width: 100%;
      padding: 20px 0;
      text-align: center;
      img {
        width: 100%;
        max-width: 165px;
        object-fit: contain;
      }
    }
    .price-pic {
      width: 80%;
    }
    .desc-text {
      flex: 1;
      padding-left: 20px;
      min-height: 256px;
    }
    .el-row .el-col .el-row {
      padding: 0 30px;
    }
  }
  &-letter {
    background: #f8edd9;
    margin: 80px 0;
    padding: 80px;
    &-border {
      max-width: 1200px;
      margin: 0 auto;
      padding: 46px;
      background: repeating-linear-gradient(
        -45deg,
        rgb(240, 50, 92) 0,
        rgb(240, 50, 92) 30px,
        #fff 30px,
        #fff 60px,
        rgb(33, 39, 82) 60px,
        rgb(33, 39, 82) 90px,
        #fff 0,
        #fff 120px
      );
    }
    &-content {
      padding: 110px 190px;
      background-color: #fff;
      &-title {
        text-align: center;
        span {
          font-size: 40px;
        }
      }
    }
  }
  &-badge {
    margin: 0 auto 160px;
    max-width: 1200px;
    text-align: center;
    .tatfook {
      margin: 20px 0;
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .about {
    &-carousel {
      .el-carousel__container {
        height: 200px !important;
      }
    }
    &-teacher-student {
      .content {
        &-img {
          width: 200px;
          height: 200px;
          img {
            width: 100%;
          }
        }
      }
    }
    &-lesson {
      margin: 0 auto;
      padding: 10px;
      &-desc {
        display: block;
        .desc-img {
          margin: 0 auto;
          padding: 20px 0;
        }
        .desc-text {
          padding-left: 20px;
          min-height: 220px;
        }
      }
    }
    &-view-more {
      &-btn {
        width: 222px;
        height: 50px;
        margin: 0 auto;
        position: relative;
        .tip {
          color: #ffffff;
          display: inline-block;
          width: 180px;
          line-height: 45px;
          font-size: 14px;
        }
        .next {
          width: 12px;
          position: absolute;
          top: 18px;
          left: 180px;
          &-2 {
            left: 190px;
          }
          &-3 {
            left: 200px;
          }
        }
      }
    }
    &-letter {
      background: #f8edd9;
      margin: 40px 0;
      padding: 20px;
      &-border {
        margin: 0 auto;
        padding: 26px;
      }
      &-content {
        padding: 10px;
        &-title {
          text-align: center;
          span {
            font-size: 20px;
          }
          .letter {
            width: 40px;
          }
        }
      }
    }
    &-badge {
      margin: 0 auto;
      text-align: center;
      font-size: 14px;
      .img-wrap {
        height: 50px;
        max-width: 86px;
        text-align: center;
        img {
          width: 40px;
        }
      }
      .tatfook {
        margin: 20px 0;
      }
    }
  }
}
</style>