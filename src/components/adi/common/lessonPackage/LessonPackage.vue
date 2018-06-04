<template>
    <el-row class="index-page-lessons">
    <div class="lessons-container">
      <el-row type="flex" class="mod-full-width-0-0-65">
        <el-col class="lessons-cover" :style="loadCover()"></el-col>
        <el-col>
          <div class="lessonDesc">
            <div class="lessons-title">{{properties.data.title}}</div>
            <div class="lessons-include-title">
              <span class="lessons-content">
                <span class="lessons-include">Includes:</span> 
                <span class="lessons-count">{{properties.data.lessons ? properties.data.lessons.length : 0}}</span>
                lessons
              </span>
              <span>
                <span class="lessons-include">Ages:</span>
                <span class="lessons-age">{{properties.data.agesMin == 0 && properties.data.agesMax == 0 ? "suitable for all" : properties.data.agesMin +'-'+ properties.data.agesMax}}</span>
              </span>
            </div>
            <div class="lessons-skills">
              <span class="lessons-include">Skills:</span>
              <pre>{{properties.data.skills}}</pre>
            </div>
                 
            <div class="lessons-button">
              <span class="lessons-coins">
                <span class="lessons-cost">{{properties.data.cost}}</span>coins
              </span>
              <el-button @click="addClick" type="primary" id="btnAdd" v-if="!isLessonsBuy" >ADD</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="lessons-list">
      <div class="list-title">Catalogue：</div>
      <div class="list-content" v-for="lesson in properties.data.lessons">
        <div class="lesson-item">
          <el-row type="flex" class="mod-full-width-0-0-65">
            <el-col class="item-cover" :span="8">
              <a class="item-cover-img" @click="noBuyAlert" v-bind:href="lessonHref(lesson.lessonUrl)" :style="lessonCover(lesson.lessonCover)"></a>
            </el-col>
            <el-col>
              <div class="lesson-item-desc">
                <div class="lesson-title"><a @click="noBuyAlert" v-bind:href="lessonHref(lesson.lessonUrl)">{{lesson.lessonTitle}}</a></div>
                <div class="lesson-item-goals">
                  <span>Lesson Goals:</span>  
                  <pre>{{lesson.LessonGoals}}</pre>
                </div>
                <div class="lesson-item-dur">Duration:45min</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import axios from 'axios'
import qs from 'qs'

const lessonHost = 'http://localhost:3000'

export default {
  name: 'AdiLessonPackage',
  mixins: [compBaseMixin],
  data() {
    return {
      dialogVisible: false,
      isLessonsBuy: false
    }
  },
  methods: {
    //课程包封面
   loadCover() {
      return this.generateStyleString({
        background: 'url(' + this.properties.data.cover + ')',
        'background-position': 'center',
        'background-size': 'cover',
        'background-color': '#eee',
        'opacity':'0.8',
        'border-radius': '8px'
      })
    },
    //课程点击跳转
    lessonHref(href){
      if(this.isLessonsBuy ){
        return href;
      }
    },
    //未购买点击
    noBuyAlert(){
      if( !this.isLessonsBuy ){
        this.$alert('Please add the package first', {
          confirmButtonText: 'OK',
          center: true
        });
      }
    },
    //课程列表封面
    lessonCover(imgcover) {
      return this.generateStyleString({
        background: 'url(' + imgcover + ')',
        'background-position': 'center',
        'background-size': 'cover',
        'background-color': '#eee',
        'opacity':'0.8',
        'border-radius': '8px'
      })
    },
    // 购买课程包
    addClick() {
      this.$confirm('To learn lessons of this package, you have to invest '+ this.properties.data.cost +' coins', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          axios.post(lessonHost + '/api/subscribe/add', qs.stringify({packageId:this.properties.data.id}),
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          })
          .then(response => {
            if(response.data.err == 0){
              this.$message({
                type: 'success',
                message: 'Add lessons of this package success!'
              });
              this.isLessonsBuy = true;
            }else if(response.data.err == 101){
              this.$message.error('Operation failed please retry!');
            }else if( response.data.err == 102 ){
             this.$message.error('Sorry,please login!');
            }else if(response.data.err == 103){
                this.$message({
                type: warn,
                message: "You have already purchased!"
              });
            }
          })
        })
    }
  },
  created:function(){
    let packageId = this.properties.data.id;
    if (location.href.indexOf('editor.html') === -1 && location.href.indexOf('viewport.html') === -1) {
      axios.get(lessonHost + '/api/subscribe/state', {
        params: {
          packageId: packageId
        },
        withCredentials: true
      })
      .then(response => {
          console.log(response)
          if( response.data.err == 0 ){
            //已购买
            this.isLessonsBuy = true;
          }else if(response.data.err == 102){
            this.$message.error("Sorry,please login !");
          }else if( response.data.err == 400 ){
            //未购买
          }
        })
    }
  }
}
</script>
<style>
  [data-mod="ModLessonPackage"]{
    font-family: 'Microsoft YaHei'
  }
  .el-main.index-page-main {
    background-color: #fbfbfb;
  }
  .maxwidth-template .el-main {
    max-width:100%;
  }
  .lessons-container {
    background-color:#fff;
    padding: 40px 0;
  }
  .lessons-cover {
    height:340px;
    min-width: 400px;
    position: relative;
    cursor: pointer;
  }
  .lessonDesc {
    margin-left: 20px;
    position: relative;
    height: 100%;
  }
  .lessons-button {
    position: absolute;
    bottom: 0;
    z-index: 2;
  }
  .lessons-button .el-button {
    margin-right: 10px;
    margin-top: 10px;
    margin-left: 0;
  }
  .lessons-button .lessons-coins{
    margin-right: 20px;
    font-size: 18px;
    color: #4C4C4C;
  }
  .lessons-coins .lessons-cost{
    font-size: 24px;
    color: #FF414A;
    margin-right: 10px;
  }
  .lessons-title {
    margin-bottom: 18px;
    font-size:20px;
    color:#111111;
  }
  .lessons-include-title {
    font-size:18px;
    color:#818181;
    margin-bottom: 18px;
  }
  .lessons-content{
    margin-right: 10px;
  }
  .lessons-include{
    color: #4C4C4C;
    font-size:18px;
  }
  .lessons-count{
    color: #FF414A;
  }
  .lessons-skills pre{
    font-size: 16px;
    color: #4c4c4c;
  }
  .lessons-skills pre,.lesson-item .lesson-item-goals pre {
    margin-top: 15px;
    font-family: inherit;
    word-wrap: break-word;
    white-space: pre-wrap;
    line-height: 1.5;
    font-weight: lighter;
  }

  .lessons-skills pre li {
    color:#4C4C4C;
    line-height:24px;
    font-size:16px;
    margin-bottom: 10px;
  }
  .el-button:disabled {
    background:#D2D2D2;
    border: 1px solid #D2D2D2;
    cursor: not-allowed;
    color: white;
    pointer-events: none;
  }
  /* 课程列表 */
  .lessons-list{
    border: 1px solid #e5e5e5
  }
  .lessons-list .list-title{
    font-size: 16px;
    color: #333;
    padding: 15px ;
  }
  .list-content{
    background-color: #fff;
  }
  .lesson-item{
    margin-bottom: 15px;
    background-color: #FCFCFC;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    padding: 18px 10px;
    position: relative;
    height: 100%;
  }
  .lesson-item .item-cover{
    height: 145px;
    cursor: pointer;
  }
  .lesson-item .item-cover:hover{
    background:rgba(33,134,254,0.3);
    border-radius: 8px;
  }
  .lesson-item .item-cover:hover .item-cover-img::after{
    content: "";
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 2;
    background: url('/static/adi/lesson/play_btn_action.png') center center no-repeat;
    background-size: contain;
  }  
  .lesson-item .item-cover .item-cover-img{
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;
  }
  .lesson-item-desc{
    font-size: 14px;
    margin:0 20px 10px;
  }
  .lesson-item-desc .lesson-title{
    margin-bottom: 15px;
  }
  .lesson-item-desc .lesson-title a{
    font-size: 18px;
    color: #181818;
    text-decoration: none;
  }
  .lesson-item-desc .lesson-title a:hover{
    color: #409EFE;
    text-decoration: underline;
  }
  .lesson-item-desc .lesson-item-goals,.lesson-item-desc .lesson-item-dur{
    color: #999;
  }
  .lesson-item .lesson-item-goals pre{
    font-size: 14px;
    color: #333;
  }
  .lesson-item-desc .lesson-item-dur{
      position: absolute;
      bottom: 0;
      z-index: 2;
  }


</style>



