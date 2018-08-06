<template>
<div class="student-wrap">
<el-container class="student">
  <el-aside width="274px">
    <div class="profile">
      <img src="@/assets/lessonImg/cover1.png" alt="">
    </div>
    <div class="nickname">Aimee</div>
    <div class="skillpoints">10 skillpoints</div>
    <div class="skills">
      <ul class="skills-list">
        <li>技能名称1：<span>12</span></li>
        <li>技能名称1：<span>12</span></li>
        <li>技能名称1：<span>12</span></li>
        <li>技能名称1：<span>12</span></li>
        <li>技能名称1：<span>12</span></li>
        <li>技能名称1：<span>12</span></li>
      </ul>
    </div>
  </el-aside>
  <el-main>
    <div class="search">
      <span class="bell"><img src="@/assets/lessonImg/bell.png" alt=""></span>
      <span class="tip">Enter the class from here</span>
      <span class="search-input"><el-input id="searchClass" size="medium" v-model="classID" placeholder="TYPE YOUR CLASS ID"></el-input></span>
      <span class="search-btn"><el-button :disabled="!classID" size="medium" type="primary"><label for="searchClass">Enter</label></el-button></span>
    </div>
    <div class="total-packages">Includes: <span>3</span> packages</div>
    <div class="packages">
      <el-row>
        <el-col :span="8">
          <div class="packages-intro">
            <img class="cover" src="@/assets/lessonImg/cover1.png" alt="">
            <h3>Computer Science</h3>
            <p>Include: <span>10</span> lessons</p>
            <p>Ages: 0-99</p>
            <p>Intro: Installation,movement</p>
            <div class="progress">
              <div>
                <el-progress :stroke-width="10" :percentage="80" status="success" color="#66cd2e"></el-progress>
                <p>Have learned 2 lessons</p>
              </div>
            </div>
            <div><el-button size="medium" type="primary">Continue/Start to learn</el-button></div>
            <div class="finished"><img src="@/assets/lessonImg/finished.png" alt=""><span class="finished-tip">Finished</span></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-main>
</el-container>
</div>
</template>

<script>
export default {
  name: "student",
  data(){
    return{
      classID: ''
    }
  }

}
</script>

<style lang="scss">
.student-wrap{
  background: #fbfbfb;
.student{
  margin: 0 auto;
  max-width: 1150px;
  // border: 1px solid red;
  .el-aside{
    background: #ffffff;
    margin-right: 29px;
    overflow: hidden;
    text-align: center;
    .profile{
      width: 99px;
      height: 99px;
      margin: 0 auto;
      border-radius: 50%;
      border: solid 1px #ced0d2;
      margin-top: 37px;
      margin-bottom: 20px;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .nickname{
      font-size: 24px;
      line-height: 34px;
      color: #333333;
      font-family: 'ArialMT';
    }
    .skillpoints{
      height: 40px;
      color: #818181;
      margin: 0 auto;
      width: 233px;
      border-bottom: 2px solid  #cfd8dc;
      font-size: 14px;
    }
    .skills{
      margin: 17px auto;
      width: 233px;
      text-align: left;
      &-list{
        list-style: none;
        padding: 0;
        li{
          height: 34px;
          background: #f5f7f9;
          margin: 2px 0;
          line-height: 34px;
          padding: 0 4px;
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }
  .el-main{
    padding: 0;
    background: #fff;
    .search{
      height: 63px;
      background: rgba(64,158,254,.1);
      position: relative;
      .bell{
        display: inline-block;
        padding: 22px 0 18px 39px;
      }
      .tip{
        display: inline-block;
        height: 63px;
        line-height: 63px;
        position: absolute;
        left: 65px;
        font-size: 14px;
      }
      &-input{
        display: inline-block;
        position: absolute;
        left: 267px;
        top: 14px;
        width: 384px;
      }
      &-btn{
        position: absolute;
        right: 111px;
        top: 14px;
      }
    }
    .total-packages{
      padding: 40px 0 15px;
      height: 16px;
      border-bottom: 2px solid #d2d2d2;
      width: 788px;
      margin: 0 auto;
    }
    .packages{
      margin: 44px 0 0;
      // border: 1px solid blue;
      .el-row{
        .el-col{
          // border: 1px solid red;
          .packages-intro{
            width: 230px;
            margin: 0 auto;
            .cover{
              width: 230px;
              height: 128px;
              margin: 0 auto;
              object-fit: cover;
            }
            p{
              margin: 0;
              line-height: 30px;
              font-size: 14px;
            }
            .progress{
              height: 45px;
              // border: 1px solid black;
              .el-progress{
                .el-icon-circle-check{
                  display: none;
                }
              }
            }
            .finished{
              margin: 10px 0;
              color: #66cd2e;
              position: relative;
              &-tip{
                position: absolute;
                left: 30px;
                top: 2px;
              }
            }
          }
        }
      }
    }
  }
}
}

</style>
