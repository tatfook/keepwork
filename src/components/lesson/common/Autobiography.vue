<template>
  <div class="here-page">
    <div class="here-page-content">
      <div class="here-page-content-title">
        <img class="rectangle1" src="@/assets/lessonImg/aboutPageImg/rounded_rectangle.png" alt="">
        <span class="topic">{{$t('lesson.herePageText.title')}}</span>
        <img class="rectangle2" src="@/assets/lessonImg/aboutPageImg/rounded_rectangle.png" alt="">
      </div>
      <div class="here-page-content-sub-title">{{$t('lesson.herePageText.subTitle')}}</div>

      <div class="here-page-content-opening-words">
        <p>{{$t('lesson.herePageText.openingWords1')}}</P>
        <p>{{$t('lesson.herePageText.openingWords2')}}</p>
        <p>{{$t('lesson.herePageText.openingWords3')}}</p>
      </div>

      <div class="here-page-content-key-point point1">
        <div class="here-page-content-key-point-title"><img class="title-img" src="@/assets/lessonImg/aboutPageImg/star.png" alt="">{{$t('lesson.herePageText.core1')}}</div>
        <div class="here-page-content-key-point-part1">
          <p>{{$t('lesson.herePageText.keyPoint1-part1')}}</p>
        </div>
        <div class="here-page-content-key-point-part2">
          <h4>{{$t('lesson.herePageText.coreContent1')}}</h4>
          <p>{{$t('lesson.herePageText.keyPoint1-part2')}}</p>
        </div>
      </div>

      <div class="here-page-content-img">
        <img class="pic" src="@/assets/lessonImg/aboutPageImg/here_page_img1.png" alt="">
      </div>

      <div class="here-page-content-key-point point2">
        <div class="here-page-content-key-point-title"><img class="title-img" src="@/assets/lessonImg/aboutPageImg/star.png" alt="">{{$t('lesson.herePageText.core2')}}</div>
        <div class="here-page-content-key-point-part1">
          <p>{{$t('lesson.herePageText.keyPoint2-part1')}}</p>
        </div>
        <div class="here-page-content-key-point-part2">
          <h4>{{$t('lesson.herePageText.coreContent2')}}</h4>
          <p>{{$t('lesson.herePageText.keyPoint2-part2')}}</p>
        </div>
      </div>

      <div class="here-page-content-key-point point3">
        <div class="here-page-content-key-point-title"><img class="title-img" src="@/assets/lessonImg/aboutPageImg/star.png" alt="">{{$t('lesson.herePageText.core3')}}</div>
        <div class="here-page-content-key-point-part1">
          <p>{{$t('lesson.herePageText.keyPoint3-part1')}}</p>
        </div>
        <div class="here-page-content-key-point-part2">
          <h4>{{$t('lesson.herePageText.coreContent3')}}</h4>
          <p>{{$t('lesson.herePageText.keyPoint3-part2')}}</p>
        </div>
      </div>

      <div class="here-page-content-key-point point4">
        <div class="here-page-content-key-point-title"><img class="title-img" src="@/assets/lessonImg/aboutPageImg/star.png" alt="">{{$t('lesson.herePageText.core4')}}</div>
        <div class="here-page-content-key-point-part1">
          <p>{{$t('lesson.herePageText.keyPoint4-part1')}}</p>
        </div>
        <div class="here-page-content-key-point-part2">
          <h4>{{$t('lesson.herePageText.coreContent4')}}</h4>
          <p>{{$t('lesson.herePageText.keyPoint4-part2')}}</p>
        </div>
      </div>

      <div class="here-page-content-img">
        <img class="pic" src="@/assets/lessonImg/aboutPageImg/here_page_img2.png" alt="">
      </div>

      <div class="here-page-content-key-point point5">
        <div class="here-page-content-key-point-title"><img class="title-img" src="@/assets/lessonImg/aboutPageImg/star.png" alt="">{{$t('lesson.herePageText.core5')}}</div>
        <div class="here-page-content-key-point-part1">
          <p>{{$t('lesson.herePageText.keyPoint5-part1')}}</p>
        </div>
        <div class="here-page-content-key-point-part2">
          <h4>{{$t('lesson.herePageText.coreContent5')}}</h4>
          <p>{{$t('lesson.herePageText.keyPoint5-part2')}}</p>
        </div>
      </div>

      <div class="here-page-content-key-point point6">
        <div class="here-page-content-key-point-title"><img class="title-img" src="@/assets/lessonImg/aboutPageImg/star.png" alt="">{{$t('lesson.herePageText.core6')}}</div>
        <div class="here-page-content-key-point-part1">
          <p>{{$t('lesson.herePageText.keyPoint6-part1')}}</p>
        </div>
        <div class="here-page-content-key-point-part2">
          <h4>{{$t('lesson.herePageText.coreContent6')}}</h4>
          <p>{{$t('lesson.herePageText.keyPoint6-part2')}}</p>
        </div>
      </div>

      <div class="here-page-content-key-point point7">
        <div class="here-page-content-key-point-title"><img class="title-img" src="@/assets/lessonImg/aboutPageImg/star.png" alt="">{{$t('lesson.herePageText.core7')}}</div>
        <div class="here-page-content-key-point-part1">
          <p>{{$t('lesson.herePageText.keyPoint7-part1')}}</p>
        </div>
        <div class="here-page-content-key-point-part2">
          <h4>{{$t('lesson.herePageText.coreContent7')}}</h4>
          <p>{{$t('lesson.herePageText.keyPoint7-part2')}}</p>
        </div>
      </div>

      <div class="here-page-content-img">
        <img class="pic" src="@/assets/lessonImg/aboutPageImg/here_page_img3.png" alt="">
      </div>

      <div class="here-page-content-conclusions">
        <h3>{{$t('lesson.herePageText.conclusions')}}</h3>
        <p>{{$t('lesson.herePageText.conclusionsOpeningWords')}}</p>
        <p>{{$t('lesson.herePageText.contrast')}}</p>
        <table  border="1" cellpadding="6" cellspacing="0" borderColor="#f5f7fa">
          <tr class="header" align="center">
            <td width="190"></td>
            <td>{{$t('lesson.herePageText.contrastTitle1')}}</td>
            <td>{{$t('lesson.herePageText.contrastTitle2')}}</td>
          </tr>
          <tr>
            <td>{{$t('lesson.herePageText.catalog1')}}</td>
            <td>{{$t('lesson.herePageText.catalog1-qiankun')}}</td>
            <td>{{$t('lesson.herePageText.catalog1-other')}}</td>
          </tr>
          <tr>
            <td>{{$t('lesson.herePageText.catalog2')}}</td>
            <td>{{$t('lesson.herePageText.catalog2-qiankun')}}</td>
            <td>{{$t('lesson.herePageText.catalog2-other')}}</td>
          </tr>
          <tr>
            <td>{{$t('lesson.herePageText.catalog3')}}</td>
            <td>{{$t('lesson.herePageText.catalog3-qiankun')}}</td>
            <td>{{$t('lesson.herePageText.catalog3-other')}}</td>
          </tr>
          <tr>
            <td>{{$t('lesson.herePageText.catalog4')}}</td>
            <td>{{$t('lesson.herePageText.catalog4-qiankun')}}</td>
            <td>{{$t('lesson.herePageText.catalog4-other')}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Autobiography",
  data() {
    return {}
  },
  created(){
    this.fromTopToShow()
  },
  methods:{
    fromTopToShow(){
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss">
.here-page {
  &-content {
    max-width: 860px;
    margin: 0 auto 26px;
    padding: 50px 20px;
    background: #fff;
    line-height: 26px;
    .pic{
      width: 100%;
      object-fit: contain;
    }
    &-title {
      margin: 0 auto;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .topic {
        padding: 0 30px;
        font-size: 30px;
        letter-spacing: 2px;
        color: #333333;
      }
      .rectangle2 {
        transform: rotateY(-180deg);
        height: 100%;
        line-height: 100%;
      }
    }
    &-sub-title {
      text-align: center;
      margin: 18px 0 50px;
    }
    &-key-point {
      margin: 25px 0;
      &-title {
        padding: 15px 0;
        display: flex;
        justify-content: center;
        align-items: Center;
        .title-img {
          width: 38px;
          margin-right: 15px;
        }
      }
      &-part2 {
        padding: 10px 18px;
        border-left: 10px #50bfff solid;
        border-radius: 5px;
        background: #ecf8ff;
      }
    }
    &-conclusions{
      .header{
        height: 50px;
        background: #f5f7fa;
      }
    }
  }
}
</style>


