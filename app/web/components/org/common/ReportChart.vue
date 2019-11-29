<template>
  <div class="report-chart">
    <div v-if="showReportTypeName" class="report-chart-type-name">
      {{reportName}}
    </div>
    <div v-if="showComment" class="report-chart-header">
      <user-portrait :user="userRepo" :width="110" class="report-chart-header-avatar" size="large"></user-portrait>
      <div class="report-chart-header-realname">
        {{ userRealname }}
      </div>
      <div class="report-chart-header-org-name">
        在 <span class="bold-font">{{ orgName }}</span>
      </div>
      <div class="report-chart-header-expression">
        的表现<span class="gold-experience">{{userExpression}}</span>
      </div>
    </div>
    <div class="report-chart-container">
      <template v-if="showComment">
        <div class="report-chart-star">
          <div class="trapezoidal-round">
            <span class="trapezoidal-round-name">
              总体评价
            </span>
          </div>
          <div class="final-star">
            <el-rate :value="ablityValue['star'].value" disabled :icon-classes="iconClasses">
            </el-rate>
          </div>
          <div class="ablity-value">
            <div class="ablity-value-left">
              <div class="ablity-value-item">
                {{ablityValue['spatial'].label}} <el-rate :value="ablityValue['spatial'].value" :icon-classes="iconClasses" disabled>
                </el-rate>
              </div>
              <div class="ablity-value-item">
                {{ablityValue['creative'].label}} <el-rate :value="ablityValue['creative'].value" :icon-classes="iconClasses" disabled>
                </el-rate>
              </div>
              <div class="ablity-value-item">
                {{ablityValue['compute'].label}} <el-rate :value="ablityValue['compute'].value" :icon-classes="iconClasses" disabled>
                </el-rate>
              </div>
            </div>
            <div class="ablity-value-divide">

            </div>
            <div class="ablity-value-right">
              <div class="ablity-value-item">
                {{ablityValue['collaborative'].label}} <el-rate :value="ablityValue['collaborative'].value" :icon-classes="iconClasses" disabled>
                </el-rate>
              </div>
              <div class="ablity-value-item">
                {{ablityValue['logical'].label}} <el-rate :value="ablityValue['logical'].value" :icon-classes="iconClasses" disabled>
                </el-rate>
              </div>
              <div class="ablity-value-item">
                {{ablityValue['coordinate'].label}} <el-rate :value="ablityValue['coordinate'].value" void-icon-class="iconfont icon-star" :icon-classes="iconClasses" disabled>
                </el-rate>
              </div>
            </div>
          </div>

        </div>
        <div class="report-chart-comment">
          <div class="trapezoidal-round">
            <span class="trapezoidal-round-name">
              老师评语
            </span>
          </div>

          <div class="report-chart-comment-text">
            {{ comment }}
          </div>

          <div class="report-chart-comment-media">
            <el-row :gutter="10">
              <el-col v-for="(item, index) in mediaUrlByImgIndex" :key="index" :span="span">
                <img @click="handleShowPhotoPreview(item.imgIndex)" v-if="item.type === 'images'" class="report-chart-comment-media-img" :src="item.url | miniPic" alt="" srcset="">
                <div @click="handleShowDialog(item)" class="report-chart-comment-media-video" v-else-if="item.type === 'videos'">
                  <video width="100%" height="100%" :src="item.url"></video>
                  <div class="play-masking">
                    <img class="play-masking-button" :src="playButtonIcon">
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
      <div v-if="showThisTimeRadar" class="report-chart-radar dont-break">
        <div class="trapezoidal-round report-chart-radar-title">
          <span class="trapezoidal-round-name">
            本次能力值分析
          </span>
        </div>
        <report-chart-radar :reportData="reportData" @completed="onRadarThisTimeChartCompleted" radarType="thisTime"></report-chart-radar>
      </div>
      <div v-if="isHistory" class="report-chart-radar dont-break">
        <div class="trapezoidal-round report-chart-radar-title">
          <span class="trapezoidal-round-name">
            历次能力值统计
          </span>
        </div>
        <report-chart-radar :reportData="reportData" radarType="history" @completed="onRadarHistoryChartCompleted"></report-chart-radar>
      </div>
      <div v-if="isHistory" class="report-chart-line">
        <div class="trapezoidal-round report-chart-line-title">
          <span class="trapezoidal-round-name">
            历次点评成长轨迹
          </span>
        </div>
        <template v-if="isShowHistogramChart">
          <div class="report-chart-line-item dont-break" v-for="item in growthTrackList" :key="`${item.key}-histogram`">
            <report-chart-histogram :data="item" :max="growthTrackMax" @completed="onTrackChartCompleted"></report-chart-histogram>
          </div>
        </template>
        <template v-else>
          <div class="report-chart-line-item dont-break" v-for="item in growthTrackList" :key="`${item.key}-line`">
            <report-chart-line :data="item" :max="growthTrackMax" :extend="item.extend" @completed="onTrackChartCompleted"></report-chart-line>
          </div>
        </template>
      </div>
      <div v-if="showFooter" class="report-chart-footer">
        <div class="report-chart-footer-date">
          <div class="report-chart-footer-date-top">{{commentDate}}</div>
          <div class="report-chart-footer-date-bottom">{{commentDay}}</div>
        </div>
        <div class="report-chart-footer-info">
          <div class="report-chart-footer-info-org-name">
            {{orgName}}
          </div>
          <div class="report-chart-footer-info-teacher-name">
            点评老师：{{teacherName}}
          </div>
          <div v-if="propaganda" class="report-chart-footer-info-slogan">
            {{propaganda}}
          </div>
        </div>
        <img v-if="QRCode" class="report-chart-footer-qrcode" :src="QRCode | miniPic">
      </div>
    </div>
    <photo-preview v-if="showPhotoPreview" :slides="imageList" :index="imgIndex" @close="handleHidePhotoPreview"></photo-preview>
    <el-dialog custom-class="show-item-dialog" :visible.sync="isShowDialog">
      <video-player ref="player" v-if="isShowDialog && showItem.type === 'videos'" :autoplay="true" :fullscreen="true" :src="showItem.url" />
    </el-dialog>
  </div>
</template>

<script>
import ReportChartRadar from './ReportChartRadar'
import ReportChartLine from './ReportChartLine'
import ReportChartHistogram from './ReportChartHistogram'
import videoPlayer from '@/components/common/VideoPlayer'
import UserPortrait from '@/components/common/UserPortrait'
import PhotoPreview from './PhotoPreview'
import moment from 'moment'
export default {
  name: 'ReportChart',
  components: {
    ReportChartRadar,
    ReportChartLine,
    ReportChartHistogram,
    videoPlayer,
    PhotoPreview,
    UserPortrait,
  },
  filters: {
    miniPic(url) {
      if (/#/.test(url)) {
        return `${url.replace(/#.+/, '')}?imageView2/2/w/300`
      }
      return `${url}&imageView2/2/w/300`
    },
  },
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      playButtonIcon: require('@/assets/org/play1.png'),
      isShowDialog: false,
      showItem: {},
      imgCount: 0,
      loadedImgList: [],
      radarThisTimeCompleted: false,
      radarHistoryCompleted: false,
      growthTrackChartCompletedCount: 0,
      showPhotoPreview: false,
      imgIndex: 0,
      timer: null,
      span: 8,
    }
  },
  props: {
    printMode: {
      type: Boolean,
      default: false,
    },
    reportData: {
      type: Object,
      default() {
        return {}
      },
    },
    reportType: {
      type: Number,
      default: 2,
    },
    showThisTimeRadar: {
      type: Boolean,
      default: true,
    },
    showReportTypeName: {
      type: Boolean,
      default: true,
    },
    showComment: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setSpan()
      window.addEventListener('resize', this.monitorResize)
      if (this.showComment) {
        this.addImgLoadEvent()
      }
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.monitorResize)
  },
  methods: {
    handleShowPhotoPreview(imgIndex) {
      this.imgIndex = imgIndex
      this.showPhotoPreview = true
    },
    handleHidePhotoPreview() {
      this.showPhotoPreview = false
    },
    monitorResize(evt) {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.setSize, 300)
    },
    setSize() {
      const clientWidth = document.body.clientWidth
      if (clientWidth < 768) {
        this.span = 12
      } else {
        this.portraitSize = 110
        this.span = 8
      }
    },
    handleShowDialog(item) {
      this.isShowDialog = true
      this.showItem = item
    },
    onTrackChartCompleted(instance) {
      this.growthTrackChartCompletedCount = this.growthTrackChartCompletedCount + 1
      this.checkCompleted()
    },
    onRadarThisTimeChartCompleted() {
      this.radarThisTimeCompleted = true
      if (!this.isHistory) {
        this.radarHistoryCompleted = true
      }
      this.checkCompleted()
    },
    onRadarHistoryChartCompleted() {
      this.radarHistoryCompleted = true
      this.checkCompleted()
    },
    checkCompleted() {
      if (this.isPageCompleted) {
        this.$emit('completed', true)
      }
    },
    addImgLoadEvent() {
      const imgEle = document.querySelectorAll('.report-chart-comment-media-img')
      this.imgCount = imgEle.length
      imgEle.forEach(ele => (ele.onload = evt => this.markedImg(ele, evt)))
    },
    markedImg(imgEle, evt) {
      this.loadedImgList.push(imgEle)
      this.checkCompleted()
    },
  },
  computed: {
    imgLoadCompleted() {
      if (!this.showComment) {
        return true
      }
      return this.imgCount === this.loadedImgList.length
    },
    trackChartCompleted() {
      return this.isHistory ? this.growthTrackChartCompletedCount >= 6 : true
    },
    isPageCompleted() {
      return this.imgLoadCompleted && this.trackChartCompleted && this.isRadarChartCompleted
    },
    isRadarChartCompleted() {
      return this.radarThisTimeCompleted && this.radarHistoryCompleted
    },
    iconClasses() {
      return ['iconfont icon-star-', 'iconfont icon-star-', 'iconfont icon-star-']
    },
    isShowHistogramChart() {
      return _.every(this.growthTrackList, item => item.chartData.rows.length === 1)
    },
    growthTrackMax() {
      const max = _.reduce(
        this.starGroupArray,
        (max, cur) => {
          const { classmateStar, userStar } = cur
          const classmateMax = _.max(_.map(this.growthTrackKey, item => classmateStar[`${item.key}Avg`]))
          const userMax = _.max(_.map(this.growthTrackKey, item => userStar[item.key]))
          max = _.max([classmateMax, userMax])
          return max
        },
        10,
      )
      return max
    },
    userRepo() {
      return _.get(this.reportData, 'userRepo', {})
    },
    uesrPortrait() {
      return _.get(this.userRepo, 'portrait', this.defaultPortrait)
    },
    teacherName() {
      return _.get(this.userRepo, 'teacherName', '')
    },
    QRCode() {
      return _.get(this.userRepo, 'QRCode', '')
    },
    propaganda() {
      return _.get(this.userRepo, 'propaganda', '')
    },
    createdAt() {
      return _.get(this.userRepo, 'createdAt', '')
    },
    commentDate() {
      return moment(this.createdAt).format('YYYY/MM')
    },
    commentDay() {
      return moment(this.createdAt).format('D')
    },
    userRealname() {
      return _.get(this.userRepo, 'realname', '')
    },
    orgName() {
      return _.get(this.userRepo, 'orgName', '')
    },
    userExpression() {
      const star = _.toNumber(_.get(this.userRepo, 'star', 1))
      return star > 3 ? '棒极了' : '还不错'
    },
    star() {
      return _.get(this.userRepo, 'star', 0)
    },
    comment() {
      return _.get(this.userRepo, 'comment', '')
    },
    mediaUrl() {
      return _.get(this.userRepo, 'mediaUrl', [])
    },
    mediaUrlByImgIndex() {
      let imgIndex = 0
      return _.map(this.mediaUrl, item => {
        if (item.type === 'images') {
          item.imgIndex = imgIndex
          imgIndex++
        }
        return item
      })
    },
    imageList() {
      const clientWidth = document.body.clientWidth
      const images = _.filter(this.mediaUrl, item => item.type === 'images')
      return _.map(images, item => ({
        src: item.url,
        h: 0,
        w: 0,
      }))
    },
    reportTypeName() {
      const type = _.toNumber(_.get(this.$route, 'query.type', 1))
      return type === 1 ? '课堂小评' : '阶段总结'
    },
    reportName() {
      return _.get(this.$route, 'query.reportName', this.reportTypeName)
    },
    ablityValue() {
      const { star, collaborative, compute, coordinate, logical, spatial, creative } = this.userRepo
      return {
        star: {
          value: star,
          label: '总分',
        },
        collaborative: {
          value: collaborative,
          label: '协作沟通能力',
        },
        compute: {
          value: compute,
          label: '计算思维能力',
        },
        coordinate: {
          value: coordinate,
          label: '统筹思维能力',
        },
        logical: {
          value: logical,
          label: '逻辑思考能力',
        },
        spatial: {
          value: spatial,
          label: '空间思维能力',
        },
        creative: {
          value: creative,
          label: '创新思维能力',
        },
      }
    },
    mediaUrl() {
      return _.get(this.userRepo, 'mediaUrl', [])
    },
    isHistory() {
      return _.toNumber(this.reportType) === 2
    },
    growthTrack() {
      return _.get(this.reportData, 'growthTrack', {})
    },
    growthTrackKey() {
      return [
        {
          key: 'spatial',
          name: '空间思维能力',
          color: ['#939d9f', '#409efe'],
        },
        {
          key: 'creative',
          name: '创新思维能力',
          color: ['#939d9f', '#20c9d4'],
        },
        {
          key: 'compute',
          name: '计算思维能力',
          color: ['#939d9f', '#f5c728'],
        },
        {
          key: 'collaborative',
          name: '协作沟通能力',
          color: ['#939d9f', '#5f75e4'],
        },
        {
          key: 'logical',
          name: '逻辑思考能力',
          color: ['#939d9f', '#f89039'],
        },
        {
          key: 'coordinate',
          name: '统筹思维能力',
          color: ['#939d9f', '#2cc791'],
        },
      ]
    },
    classmatesHistory() {
      return _.get(this.growthTrack, 'classmatesHistoryAvgStar2', [])
    },
    userHistory() {
      return _.get(this.growthTrack, 'userHistoryStar', [])
    },
    starGroupArray() {
      return _.map(this.userHistory, (user, index) => {
        return {
          userStar: user,
          classmateStar: _.find(this.classmatesHistory, classmate => classmate.reportId === user.reportId),
        }
      })
    },
    growthTrackList() {
      return _.map(this.growthTrackKey, growthTrack => {
        const columns = ['次数', '本班同学平均值', this.userRealname]
        const rows = _.map(this.starGroupArray, (item, index) => {
          return {
            次数: `${index + 1}`,
            本班同学平均值: item['classmateStar'][`${growthTrack.key}Avg`],
            [this.userRealname]: item['userStar'][growthTrack.key],
          }
        })
        return {
          ...growthTrack,
          chartData: {
            columns,
            rows,
          },
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$radius: 20px;
$width: 766px;
.report-chart {
  background: #fff;
  box-sizing: border-box;
  padding: 0;
  &-type-name {
    width: $width;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 auto;
    height: 57px;
    line-height: 57px;
    font-weight: bold;
    font-size: 18px;
    color: #303133;
    border: 1px solid #e8e8e8;
    box-sizing: border-box;
    border-bottom: none;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  &-header {
    height: 388px;
    width: $width;
    box-sizing: border-box;
    margin: 0 auto;
    background: url('../../../assets/org/report_header.jpg') no-repeat center top;
    text-align: center;
    &-avatar {
      margin-top: 34px;
    }
    &-realname {
      color: #fff;
      margin-top: 20px;
      font-size: 20px;
    }
    &-org-name {
      color: #fff;
      margin-top: 20px;
      font-size: 30px;
      .bold-font {
        font-weight: bold;
      }
    }

    &-expression {
      color: #fff;
      margin-top: 10px;
      font-size: 20px;
      .gold-experience {
        color: #fff000;
      }
    }
  }
  &-container {
    width: $width;
    box-sizing: border-box;
    margin: 0 auto;
    background: #b1dcff;
    padding: 29px;
  }

  &-star {
    background: #fff;
    border-radius: $radius;
    text-align: center;
    margin-bottom: 29px;
    padding-bottom: 20px;
    margin-top: -100px;
    .final-star {
      margin-top: 30px;
      /deep/.el-rate__icon {
        font-size: 46px;
      }
      /deep/ .el-icon-star-on {
        &::before {
          content: '\E717';
        }
      }
    }
    .ablity-value {
      display: flex;
      font-size: 14px;
      color: #666;
      margin-top: 50px;
      padding: 0 30px;
      justify-content: space-around;
      &-divide {
        width: 1px;
        height: inherit;
        background: #e0e4ee;
      }
      &-item {
        display: flex;
        align-items: center;
        line-height: 38px;
      }
      /deep/ .el-rate {
        height: 32px;
        margin-left: 10px;
      }
      /deep/ .el-rate__icon {
        font-size: 28px;
      }
      /deep/ .el-icon-star-on {
        &::before {
          content: '\E717';
        }
      }
    }
  }

  &-comment {
    background: #fff;
    text-align: center;
    border-radius: $radius;
    margin-bottom: 29px;
    padding-bottom: 20px;
    &-text {
      text-align: left;
      margin: 28px 22px;
      min-height: 88px;
      background: #f1f2f3;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 14px;
      padding: 20px 15px;
    }

    &-media {
      padding: 0 20px;
      &-img {
        width: 209px;
        height: 123px;
        object-fit: cover;
        cursor: pointer;
        margin-bottom: 3px;
      }
      &-video {
        width: 209px;
        height: 123px;
        object-fit: cover;
        background: rgb(73, 73, 73);
        margin: 0 auto 6px;
        cursor: pointer;
        position: relative;
        .play-masking {
          width: 100%;
          height: 100%;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(#000, 0.4);
          &-button {
            width: 60px;
            height: 60px;
          }
        }
      }
    }
  }
  &-radar {
    border-radius: $radius;
    margin-bottom: 29px;
    background: #fff;
    text-align: center;
    padding-bottom: 50px;
    &-title {
      margin-bottom: 50px;
    }
  }
  &-line {
    border-radius: $radius;
    background: #fff;
    text-align: center;
    box-sizing: border-box;
    &-title {
      margin-bottom: 50px;
    }

    &-item {
      border-bottom: 1px solid #e5e5e5;
      margin: 20px;
      box-sizing: border-box;
      margin-bottom: 50px;
      &:last-child {
        border: none;
      }
    }
  }

  &-footer {
    background: url('../../../assets/org/report_footer.jpg') center top no-repeat;
    height: 155px;
    position: relative;
    &-date {
      position: absolute;
      width: 100px;
      text-align: center;
      top: 40px;
      left: 38px;
      color: #333;
      &-top {
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        font-weight: bold;
      }
      &-bottom {
        height: 45px;
        line-height: 45px;
        font-size: 24px;
        font-weight: bold;
      }
    }

    &-info {
      margin-top: 30px;
      margin-left: 200px;
      height: 100px;
      width: 40%;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #fff;
      &-org-name {
        font-size: 18px;
        line-height: 34px;
        font-weight: bold;
      }
      &-teacher-name {
        font-size: 14px;
        margin-top: 6px;
      }
      &-slogan {
        font-size: 14px;
        margin-top: 18px;
        color: #ffed26;
      }
    }

    &-qrcode {
      width: 124px;
      height: 124px;
      object-fit: cover;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin-top: 17px;
      margin-right: 39px;
    }
  }
  .trapezoidal-round {
    height: 56px;
    line-height: 56px;
    text-align: center;
    display: inline-block;
    background: #66b0fb;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    border-radius: 0 0 60px 60px / 0 0 200px 200px;
    &-name {
      text-align: center;
      &::after,
      &::before {
        content: '';
        height: 8px;
        width: 8px;
        display: inline-block;
        border-radius: 50%;
        background: #ffffff;
        opacity: 0.5;
        margin-right: 20px;
        margin-left: 20px;
      }
    }
  }
  /deep/.show-item-dialog {
    width: 80%;
  }
}

@media screen and (max-width: 768px) {
  .report-chart {
    &-type-name {
      width: 100%;
      height: 44px;
      line-height: 44px;
    }
    &-header {
      height: 244px;
      width: 100%;
      background: url('../../../assets/org/report_header_mini.jpg') no-repeat center bottom;
      background-size: 100% 100%;
      &-avatar {
        /deep/.user-portrait-profile {
          max-width: 70px;
          max-height: 70px;
        }
        margin-top: 21px;
      }
      &-realname {
        font-size: 14px;
        margin-top: 6px;
      }
      &-org-name {
        font-size: 16px;
        margin-top: 10px;
      }

      &-expression {
        font-size: 14px;
      }
    }

    &-container {
      width: 100%;
      padding: 10px;
    }

    &-star {
      margin-top: -55px;
      border-radius: 10px;
      margin-bottom: 17px;
      .final-star {
        margin-top: 18px;
        height: 38px;
        line-height: 38px;
        /deep/.el-rate__icon {
          font-size: 38px;
        }
      }
      .ablity-value {
        display: flex;
        font-size: 14px;
        color: #666;
        margin-top: 16px;
        padding: 0 8px;
        align-items: center;
        justify-content: space-around;
        &-divide {
          width: 1px;
          height: 70px;
          background: #e0e4ee;
        }
        &-item {
          display: flex;
          align-items: center;
          line-height: 28px;
          font-size: 12px;
        }
        /deep/ .el-rate {
          height: 14px;
          margin-left: 4px;
        }
        /deep/ .el-rate__icon {
          font-size: 14px;
          margin-right: 1px;
        }
        /deep/ .el-icon-star-on {
          &::before {
            content: '\E717';
          }
        }
      }
    }

    &-comment {
      border-radius: 10px;
      margin-bottom: 17px;
      &-text {
        margin: 17px;
        padding: 16px;
      }
      &-media {
        &-img {
          width: 154px;
          height: 86px;
        }
        &-video {
          width: 154px;
          height: 86px;
          .play-masking {
            &-button {
              width: 40px;
              height: 40px;
            }
          }
        }
      }
    }

    &-radar {
      padding-bottom: 20px;
      margin-bottom: 20px;
      &-title {
        margin-bottom: 0px;
      }
    }
    &-line {
      &-title {
        margin-bottom: 30px;
      }

      &-item {
        margin: 0px;
        margin-bottom: 20px;
      }
    }

    &-footer {
      background: url('../../../assets/org/report_footer_mini.png') center top no-repeat;
      background-size: 100% 94px;
      height: 94px;
      display: flex;
      align-items: center;
      &-date {
        width: 56px;
        top: 20px;
        left: 12px;
        background: url('../../../assets/org/date.png') center top no-repeat;
        background-size: 56px auto;
        &-top {
          height: 23px;
          line-height: 23px;
          font-size: 12px;
          font-weight: bold;
        }
        &-bottom {
          height: 24px;
          line-height: 24px;
          font-size: 18px;
          font-weight: bold;
        }
      }

      &-info {
        margin-top: 0px;
        margin-left: 80px;
        width: 50%;
        color: #fff;
        &-org-name {
          font-size: 14px;
          line-height: 14px;
          font-weight: bold;
        }
        &-teacher-name {
          font-size: 12px;
          margin-top: 2px;
        }
        &-slogan {
          font-size: 12px;
          margin-top: 4px;
          color: #ffed26;
        }
      }

      &-qrcode {
        width: 65px;
        height: 65px;
        object-fit: cover;
        margin: auto;
        margin-right: 10px;
      }
    }
    .trapezoidal-round {
      font-size: 14px;
      height: 28px;
      line-height: 28px;
      &-name {
        &::after,
        &::before {
          content: '';
          margin-right: 8px;
          margin-left: 8px;
        }
      }
    }
    /deep/ .show-item-dialog {
      width: 100%;
      .el-dialog__body {
        padding: 10px;
      }
    }
  }
}

@media screen and (max-width: 320px) {
  .report-chart {
    $fontSize: 16px;
    &-star {
      color: red;
      .ablity-value {
        display: block;
        &-divide {
          display: none;
        }
        &-item {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 32px;
          font-size: $fontSize;
        }
        /deep/ .el-rate {
          height: $fontSize;
          margin-left: 10px;
        }
        /deep/ .el-rate__icon {
          font-size: $fontSize;
        }
      }
    }

    &-comment {
      &-media {
        &-img {
          width: 125px;
          height: 74px;
        }
        &-video {
          width: 125px;
          height: 74px;
        }
      }
    }

    &-footer {
      &-info {
        width: 45%;
      }
    }
  }
}

@media print {
  .report-chart {
    -webkit-print-color-adjust: exact;
  }
  .dont-break {
    page-break-inside: avoid;
  }
}
</style>
