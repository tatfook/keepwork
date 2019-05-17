<template>
  <div class="textbook-page">
    <div class="textbook-page-book">
      <div class="textbook-page-book-left">
        <product-zoom class="textbook-page-book-left-zoom" :imageUrl="currentImg"></product-zoom>
        <div class="textbook-page-book-left-images">
          <img v-for="(i,index) in books" :key="index" :class="['textbook-page-book-left-images-img', {'img-selected': index === currentSelectedImg}]" :src="i.imgUrl" alt="" @click="selectImg(i,index)">
        </div>
        <el-carousel class="textbook-page-book-left-carousel" :interval="5000" arrow="always">
          <el-carousel-item v-for="(i,index) in booksCoverPhone" :key="index">
            <img :src="i.imgUrl" alt="" width="100%">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="textbook-page-book-right">
        <h3 class="textbook-page-book-right-title">Paracraft编程入门</h3>
        <p class="textbook-page-book-right-hint">成为3D动画与编程能手</p>
        <p class="textbook-page-book-right-suggest">学生、家长教师的AI与编程入门教材，适合7岁以上用户使用</p>
        <div class="textbook-page-book-right-text">
          <div class="textbook-page-book-right-text-label">作者：</div>
          <div class="textbook-page-book-right-text-content">李西峙</div>
        </div>
        <div class="textbook-page-book-right-text">
          <div class="textbook-page-book-right-text-label">出版日期：</div>
          <div class="textbook-page-book-right-text-content">2019-09-12</div>
        </div>
        <div class="textbook-page-book-right-text">
          <div class="textbook-page-book-right-text-label">页数：</div>
          <div class="textbook-page-book-right-text-content">301（彩色印刷）</div>
        </div>
        <div class="textbook-page-book-right-text">
          <div class="textbook-page-book-right-text-label">说明：</div>
          <div class="textbook-page-book-right-text-content">目前图书还没有正式出版，发给您的版本为彩色印刷内部版，印刷质量可能没有正式版好，但我们会赠送您价值500元的在线课程包激活码。</div>
        </div>
        <div class="textbook-page-book-right-price">
          <span class="textbook-page-book-right-price-icon">￥</span>
          <span class="textbook-page-book-right-price-count">96</span>
          <span class="textbook-page-book-right-price-purchase" @click="goPurchase('https://item.taobao.com/item.htm?spm=a1z10.1-c-s.w4004-21675647078.2.40326b5eXGKqAM&id=594558350038')">购买</span>
        </div>
      </div>
    </div>
    <div class="textbook-page-foreword">
      <h3 class="textbook-page-foreword-title">内容介绍</h3>
      <div class="textbook-page-foreword-intro">
        <h2>前言</h2>
        <p class="textbook-page-foreword-intro-text">"编程一直被误解为一件很难的事情。一个原因是几乎所有编程语言（工具，文档，开发者社区）都是英语文化圈下的产物，如果你英语不好，就无法真正融入其中。另一个原因是编程语言没有被教育者真正当成一种人类的语言去对待。</p>
        <p class="textbook-page-foreword-intro-text">本书希望能够作为编程的入门教材，将正确的工具，学习方法介绍给希望真正掌握编程的你。本书的目标是通过我们原创的Paracraft工具，让你可以随心所欲的创作出任意复杂的3D动画与游戏。当你具备这种入门能力时，你仍然可以继续使用Paracraft开发专业的计算机软件或自学任何其它语言。</p>
        <p class="textbook-page-foreword-intro-text">学习编程和学习外语很像，需要大量的打字练习。动手打字就如同学习外语中的发音一样重要。回忆一下，从出生开始，我们就在学习母语的发音，然后我们每天还要去使用它，长大后又系统的学习它。一个4岁的小孩已经能够用母语的发音表达自己的任何想法。相似的，本书希望营造一个类似的学习环境，让你可以在计算机世界中表达自己的任何想法。这也是当代希望从事科学与创造性工作的人的一项必备技能。拥有编程的入门能力并不困难，但也需要4年的时间或打5000行以上的代码。</p>
        <p class="textbook-page-foreword-intro-text">1989年，7岁的我照着一本我父亲给我的书编写了我人生中第一个程序，并从此喜欢上了编程，小学期间我完成了大量个人作品，到了随心所欲的入门状态，这要感谢我的老师。本书也希望和大家分享我的学习经历。</p>
        <p class="textbook-page-foreword-intro-name">李西峙</p>
        <p class="textbook-page-foreword-intro-text">2018.2.5</p>
        <p class="textbook-page-foreword-intro-text">创作于深圳大富配天集团NPL语言研发中心</p>
        <p class="textbook-page-foreword-intro-address"><a href="lixizhi@paraengine.com">lixizhi@paraengine.com</a></p>
        <p class="textbook-page-foreword-intro-address"><a href="https://keepwork.com/">https://keepwork.com/</a></p>
      </div>
      <div class="textbook-page-foreword-long-words" v-show="showMoreInfo">
        <combo-box projectName="official/keepwork" filePath="Purchasetextbookpagecontent"></combo-box>
      </div>
      <div class="textbook-page-foreword-long-words" v-show="showMoreInfo_2">
        <combo-box projectName="official/keepwork" filePath="Purchasetextbookpagecontent"></combo-box>
      </div>
      <div class="textbook-page-foreword-intro-more" @click="viewMoreInfo">{{showMoreInfo_2 ? '收起':'阅读更多'}}</div>
    </div>
    <div class="textbook-page-information">
      <div class="textbook-page-information-box">
        <h3 class="textbook-page-information-box-title">相关视频</h3>
        <div class="textbook-page-information-box-cover">
          <div class="textbook-page-information-box-cover-img">
            <div class="textbook-page-information-box-cover-img-wrap">
              <img class="textbook-page-information-box-cover-img-wrap-play" src="@/assets/lessonImg/play2.png" alt="">
              <img class="textbook-page-information-box-cover-img-image" src="@/assets/org/Paracraft创意空间安装与基础教学.png" alt="" @click="goPurchase('https://v.qq.com/x/page/d08632md4lo.html')">
            </div>
            <p class="textbook-page-information-box-cover-img-title" @click="goPurchase('https://v.qq.com/x/page/d08632md4lo.html')">Paracraft创意空间安装与基础教学</p>
          </div>
          <div class="textbook-page-information-box-cover-img">
            <div class="textbook-page-information-box-cover-img-wrap">
              <img class="textbook-page-information-box-cover-img-wrap-play" src="@/assets/lessonImg/play2.png" alt="">
              <img class="textbook-page-information-box-cover-img-image" src="@/assets/org/paracraft_video.png" alt="" @click="goPurchase('https://api.keepwork.com/storage/v0/siteFiles/770/raw#宣传视频01.mp4')">
            </div>
            <p class="textbook-page-information-box-cover-img-title" @click="goPurchase('https://api.keepwork.com/storage/v0/siteFiles/770/raw#宣传视频01.mp4')">Paracraft2分钟视频</p>
          </div>
        </div>
      </div>
      <div class="textbook-page-information-box">
        <h3 class="textbook-page-information-box-title">相关书籍</h3>
        <div class="textbook-page-information-box-cover">
          <div class="textbook-page-information-box-cover-img">
            <img class="textbook-page-information-box-cover-img-image" src="@/assets/org/Paracraft创意空间入门.png" alt="" @click="showPurchaseDialog(1)">
            <p class="textbook-page-information-box-cover-img-title" @click="showPurchaseDialog(1)">Paracraft创意空间入门<span class="textbook-page-information-box-cover-img-title-buy">点击购买</span></p>
          </div>
          <div class="textbook-page-information-box-cover-img">
            <img class="textbook-page-information-box-cover-img-image" src="@/assets/org/相似性与相似原理.png" alt="" @click="showPurchaseDialog(2)">
            <p class="textbook-page-information-box-cover-img-title" @click="showPurchaseDialog(2)">相似性与相似原理<span class="textbook-page-information-box-cover-img-title-buy">点击购买</span></p>
          </div>
        </div>
      </div>
    </div>
    <div class="textbook-page-teachers">
      <div class="textbook-page-teachers-desc">
        <h4 class="textbook-page-teachers-desc-title">Paracraft编程入门</h4>
        <p class="textbook-page-teachers-desc-subtitle">成为3d动画与编程能手</p>
        <span class="textbook-page-teachers-desc-rectangle"></span>
        <p class="textbook-page-teachers-desc-text">学生、家长、教师的AI与编程入门教材，适合7岁以上用户使用。<br>
          学习《paracraft编程入门》，用编程创造世界。</p>
        <span class="textbook-page-teachers-desc-more" @click="goPurchase('https://item.taobao.com/item.htm?spm=a1z10.1-c-s.w4004-21675647078.2.40326b5eXGKqAM&id=594558350038')">马上订购</span>
      </div>
    </div>
    <el-dialog class="purchase-dialog" title="购买页面" :visible.sync="isShowPurchase" width="520px" center>
      <div class="purchase-dialog-book">
        <div class="purchase-dialog-book-cover">
          <img :src="purchaseMethodsImages" alt="">
        </div>
        <div class="purchase-dialog-book-info">
          <h5 class="purchase-dialog-book-info-name">{{purchaseMethodsImagesBookName}}</h5>
          <p class="purchase-dialog-book-info-author">{{purchaseMethodsImagesBookAuthor}}</p>
        </div>
      </div>
      <div class="purchase-dialog-methods">
        <a v-for="(i,index) in purchaseMethods" :key="index" class="purchase-dialog-methods-method" :href="i.purchaseUrl" target="_blank">{{i.label}}</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ProductZoom from './common/ProductZoom'
import ComboBox from '@/components/combo/ComboBox'

export default {
  name: 'Textbook',
  data() {
    return {
      currentSelectedImg: 0,
      books: [
        {
          imgUrl: require('@/assets/org/0.png')
        },
        {
          imgUrl: require('@/assets/org/1.png')
        },
        {
          imgUrl: require('@/assets/org/2.png')
        },
        {
          imgUrl: require('@/assets/org/3.png')
        }
      ],
      booksCoverPhone: [
        {
          imgUrl: require('@/assets/org/0_phone.png')
        },
        {
          imgUrl: require('@/assets/org/1_phone.png')
        },
        {
          imgUrl: require('@/assets/org/2_phone.png')
        },
        {
          imgUrl: require('@/assets/org/3_phone.png')
        }
      ],
      isShowPurchase: false,
      purchaseMethodsImages: '',
      purchaseMethodsImagesBookName: '',
      purchaseMethodsImagesBookAuthor: '',
      purchaseMethods: [],
      currentImg: require('@/assets/org/0.png'),
      showMoreInfo: false,
      showMoreInfo_2: false
    }
  },
  components: {
    ProductZoom,
    ComboBox
  },
  methods: {
    goPurchase(url) {
      window.open(url)
    },
    showPurchaseDialog(index) {
      switch (index) {
        case 1:
          ;(this.purchaseMethodsImages = require('@/assets/org/Paracraft创意空间入门.png')),
            (this.purchaseMethodsImagesBookName = 'Paracaraft创意空间入门'),
            (this.purchaseMethodsImagesBookAuthor =
              '作者：于平、李玉霞、鞠慧敏'),
            (this.purchaseMethods = [
              {
                label: '去京东购买',
                purchaseUrl:
                  'https://search.jd.com/Search?keyword=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&enc=utf-8&wq=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&pvid=9e8b9bb5cce747b2aa60594645623257'
              },
              {
                label: '去当当购买',
                purchaseUrl:
                  'http://search.dangdang.com/?key=Paracraft%B4%B4%D2%E2%B6%AF%BB%AD%C8%EB%C3%C5&act=input'
              },
              {
                label: '去亚马逊购买',
                purchaseUrl:
                  'https://www.amazon.cn/gp/offer-listing/B076M9MG9Q/ref=sr_1_1_olp?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&keywords=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&qid=1557217364&s=gateway&sr=8-1'
              },
              {
                label: '去淘宝购买',
                purchaseUrl:
                  'https://s.taobao.com/search?q=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20190507&ie=utf8'
              },
              {
                label: '去清华大学出版社官网购买',
                purchaseUrl:
                  'http://www.tup.tsinghua.edu.cn/booksCenter/BOOK_07646101.html'
              },
              {
                label: '去中国图书网购买',
                purchaseUrl:
                  'http://www.bookschina.com/book_find2/?stp=Paracraft%u521B%u610F%u52A8%u753B%u5165%u95E8&sCate=0'
              },
              {
                label: '去孔夫子旧书网购买',
                purchaseUrl:
                  'http://search.kongfz.com/product_result/?key=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&status=0&_stpmt=eyJzZWFyY2hfdHlwZSI6ImFjdGl2ZSJ9'
              }
            ])
          this.isShowPurchase = true
          break
        case 2:
          this.purchaseMethodsImages = require('@/assets/org/相似性与相似原理.png')
          ;(this.purchaseMethodsImagesBookName = '相似性和相似原理'),
            (this.purchaseMethodsImagesBookAuthor = '作者：李铁才、李西峙')
          this.purchaseMethods = [
            {
              label: '去京东购买',
              purchaseUrl:
                'https://search.jd.com/Search?keyword=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&enc=utf-8&wq=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&pvid=9e8b9bb5cce747b2aa60594645623257'
            },
            {
              label: '去当当购买',
              purchaseUrl:
                'http://search.dangdang.com/?key=Paracraft%B4%B4%D2%E2%B6%AF%BB%AD%C8%EB%C3%C5&act=input'
            },
            {
              label: '去淘宝购买',
              purchaseUrl:
                'https://s.taobao.com/search?q=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20190507&ie=utf8'
            },
            {
              label: '去孔夫子旧书网购买',
              purchaseUrl:
                'http://search.kongfz.com/product_result/?key=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&status=0&_stpmt=eyJzZWFyY2hfdHlwZSI6ImFjdGl2ZSJ9'
            }
          ]
          this.isShowPurchase = true
          break
      }
    },
    selectImg(i, index) {
      this.currentImg = i.imgUrl
      this.currentSelectedImg = index
    },
    viewMoreInfo() {
      if (!this.showMoreInfo) {
        this.showMoreInfo = true
        return
      }
      if (this.showMoreInfo && !this.showMoreInfo_2) {
        this.showMoreInfo_2 = true
        return
      }
      if (this.showMoreInfo && this.showMoreInfo_2) {
        this.showMoreInfo = false
        this.showMoreInfo_2 = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.textbook-page {
  &-book {
    background-color: #ffffff;
    border-radius: 10px;
    max-width: 1200px;
    margin: 0 auto 20px;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    &-left {
      width: 500px;
      border-radius: 10px;
      &-carousel {
        display: none;
      }
      &-images {
        text-align: center;
        padding-top: 12px;
        &-img {
          width: 80px;
          height: 50px;
          margin: 10px;
          object-fit: cover;
          cursor: pointer;
          border-radius: 5px;
          box-sizing: border-box;
          &.img-selected {
            border: 2px solid #409eff;
          }
        }
      }
    }
    &-right {
      flex: 1;
      padding: 40px 0 0 24px;
      &-title {
        color: #303133;
        font-size: 24px;
        margin: 0;
      }
      &-hint {
        color: #b0b4bb;
        font-size: 12px;
        margin: 2px 0 23px;
      }
      &-suggest {
        color: #2397f3;
        font-size: 14px;
        margin: 0 0 20px;
      }
      &-text {
        display: flex;
        font-size: 14px;
        margin: 3px 0;
        &-label {
          color: #303133;
          width: 72px;
        }
        &-content {
          color: #909399;
          flex: 1;
        }
      }
      &-price {
        padding: 14px 0 0 0;
        &-icon {
          color: #fcb713;
          font-size: 14px;
        }
        &-count {
          color: #fcb713;
          font-size: 24px;
        }
        &-purchase {
          cursor: pointer;
          margin: 0 30px;
          background: #2397f3;
          color: #fff;
          padding: 8px 30px;
          border-radius: 20px;
          font-size: 14px;
        }
      }
    }
  }
  &-foreword {
    max-width: 1200px;
    margin: 20px auto;
    background: #fff;
    border-radius: 10px;
    padding-bottom: 10px;
    &-title {
      border-bottom: 1px solid #f5f5f5;
      padding: 16px;
      color: #2397f3;
      margin: 0;
    }
    &-intro {
      padding: 18px 60px;
      &-text {
        margin: 0;
        color: #303133;
        font-size: 14px;
        line-height: 24px;
      }
      &-name {
        font-size: 14px;
        color: #303133;
        line-height: 24px;
        margin: 20px 0 0;
      }
      &-time {
        color: #909199;
        font-size: 12px;
        margin: 0;
        line-height: 24px;
      }
      &-address {
        color: #303133;
        line-height: 24px;
        margin: 0;
        font-size: 14px;
        a {
          color: #0366d6;
          text-decoration: none;
        }
      }
      &-more {
        background: #2397f3;
        text-align: center;
        color: #fff;
        padding: 8px;
        border-radius: 18px;
        font-size: 14px;
        margin-top: 20px;
        cursor: pointer;
        margin: 20px;
      }
    }
    &-long-words {
      // display: none;
    }
  }
  &-information {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 20px auto;
    &-box {
      width: 590px;
      background-color: #ffffff;
      border-radius: 10px;
      &-title {
        color: #2397f3;
        font-size: 16px;
        padding: 15px;
        border-bottom: 1px solid #f5f5f5;
        box-sizing: border-box;
        margin: 0;
      }
      &-cover {
        display: flex;
        padding: 16px;
        justify-content: space-between;
        &-img {
          border-radius: 8px;
          width: 271px;
          &-wrap {
            position: relative;
            &-play {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 80px;
            }
          }
          &-image {
            object-fit: cover;
            height: 153px;
            width: 100%;
            cursor: pointer;
          }
          &-title {
            margin: 0;
            font-size: 14px;
            cursor: pointer;
            margin: 4px 4px;
            &-buy {
              color: #409eff;
              padding-left: 5px;
              display: inline-block;
            }
          }
        }
      }
    }
  }
  &-teachers {
    max-width: 1200px;
    margin: 20px auto;
    min-height: 300px;
    background: url(../../assets/org/long.png) center top no-repeat;
    &-desc {
      max-width: 532px;
      color: #fff;
      padding: 10px 0 0 30px;
      &-title {
        font-size: 24px;
        margin: 30px 0 0;
      }
      &-subtitle {
        color: #ffffff;
        opacity: 0.5;
        font-size: 12px;
        margin: 8px 0 11px;
      }
      &-rectangle {
        display: block;
        width: 29px;
        height: 5px;
        background-color: #2397f3;
        border-radius: 3px;
      }
      &-text {
        font-size: 14px;
        line-height: 30px;
        margin-top: 25px;
      }
      &-more {
        display: inline-block;
        padding: 6px 22px;
        // border: 1px solid #fff;
        border-radius: 18px;
        font-size: 14px;
        margin-top: 20px;
        cursor: pointer;
        background: #f5dc31;
        color: #3617a4;
      }
    }
  }
  .purchase-dialog {
    &-book {
      width: 96%;
      margin: 0 auto;
      background: #f5f5f5;
      display: flex;
      padding: 8px;
      border-radius: 8px;
      &-cover {
        width: 233px;
        height: 125px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      &-info {
        flex: 1;
        padding-left: 12px;
        &-name {
          margin: 0;
          color: #303133;
          font-size: 16px;
        }
        &-author {
          color: #909399;
          font-size: 12px;
        }
      }
    }
    &-methods {
      width: 96%;
      margin: 12px auto;
      display: flex;
      flex-wrap: wrap;
      text-align: center;
      &-method {
        border: solid 1px #2397f3;
        padding: 0 24px;
        color: #2397f3;
        display: block;
        display: flex;
        align-items: center;
        border-radius: 24px;
        margin: 10px 2px;
        width: 142px;
        height: 50px;
        box-sizing: border-box;
        text-decoration: none;
        justify-content: center;
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .textbook-page {
    &-book {
      padding: 0;
      &-left {
        width: 100%;
        &-zoom {
          display: none;
        }
        &-images {
          display: none;
          &-img {
            margin: 4px;
            border-radius: 8px;
          }
        }
        &-carousel {
          display: block;
        }
        /deep/ .el-carousel {
          .el-carousel__container {
            height: calc(100vw) !important;
          }
        }
      }
      &-right {
        padding: 20px;
        width: 100%;
        &-price {
          &-purchase {
            display: inline-block;
            width: 40%;
            margin: 0 0 0 20px;
            text-align: center;
          }
        }
      }
    }
    &-information {
      &-box {
        width: 100%;
        &-cover {
          &-img {
            width: 50%;
            &-image {
              width: 96%;
              height: 120px;
              border-radius: 10px;
            }
            &-title {
              &-buy {
                display: block;
              }
            }
          }
        }
      }
    }
    &-foreword {
      &-intro {
        padding: 18px 20px;
      }
    }
    &-teachers {
      background: url(../../assets/org/图.png) center top no-repeat;
      background-size: 100%;
      min-height: 520px;
      padding: 10px 30px 0;
      margin: 0;
      &-desc {
        text-align: center;
        // padding: 0 40px;
        padding: 0;
        width: 100%;
        max-width: 100%;
        &-rectangle {
          display: block;
          margin: 0 auto;
        }
        &-text {
          margin: 10px 0;
        }
        &-more {
          display: block;
          width: 30%;
          text-align: center;
          margin: 0 auto;
        }
      }
    }
    .purchase-dialog {
      &-book {
        display: block;
        text-align: center;
        &-cover {
          text-align: center;
          display: flex;
          width: 100%;
          justify-content: center;
          padding: 12px;
          box-sizing: border-box;
          img {
            width: 80%;
          }
        }
      }
      &-methods {
        // display: block;
      }
      /deep/ {
        .el-dialog {
          width: 90% !important;
        }
      }
    }
  }
}
@media screen and (max-width: 362px) {
  .textbook-page {
    &-teachers {
      min-height: 500px;
      &-desc {
      }
    }
  }
}
</style>

