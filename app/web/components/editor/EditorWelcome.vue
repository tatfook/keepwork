<template>
  <div class="guid-content">
    <h1 class="welcomeText">{{ $t('common.welcomeToKeepwork') }}</h1>
    <div>
      <div class="welcomeButton" @click="openNewWebsiteDialog">
        {{ $t('common.createNewWebsite') }}
        <i class="iconfont icon-next"></i>
      </div>
    </div>
    <div class="historical-records">
      <div class="historical-records-text" @click="handleOpenedClick(item)" v-for="item in openedTreeData" :key="item">{{dataPrefix + item}}</div>
    </div>
    <div class="historical-hr"></div>
    <div class="tips-text">{{getText()}}</div>
    <div class="tips-img">
      <img :src='getImg()'>
    </div>
    <i class="iconfont icon-next changeButton-next" @click="hintTransformation"></i>
    <new-website-dialog :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog'></new-website-dialog>
    <div style="height: 100px;"></div>
  </div>
</template>

<script>
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import { mdToJson, jsonToMd } from '@/lib/mod/parser/mdParser/yaml'

export default {
  name: 'EditorWelcome',
  data() {
    return {
      isNewWebsiteDialogShow: false,
      tips: new Array(),
      tipsNumber: Number,
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName'
    }),
    openNewWebsiteDialog() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    },
    gotoPath(path) {
      this.$router.push(path)
    },
    hintTransformation(){
      let numberRepeatedJudgment = () => {
        let repeatedNumber = Math.floor(Math.random()*this.tips.length)
        if(repeatedNumber != this.tipsNumber) {
          this.tipsNumber = repeatedNumber
        } else {
          numberRepeatedJudgment()
        }
      }
      numberRepeatedJudgment()
    },
    getText(){
      if(this.tips[this.tipsNumber] && this.tips[this.tipsNumber].text){
        return this.tips[this.tipsNumber].text
      }
    },
    getImg(){
      if(this.tips[this.tipsNumber] && this.tips[this.tipsNumber].img){
        return this.tips[this.tipsNumber].img
      }
    },
    handleOpenedClick(index){
      if(!index){
        return false
      }
      this.$router.push(index)
    }
  },
  computed:{
    ...mapGetters({
      isRealNamed: 'user/isRealNamed',
      recentOpenedList: 'recentOpenedList',
      showOpenedFiles: 'showOpenedFiles',
    }),
    openedTreeData() {
      let clonedopenedFiles = _.clone(this.showOpenedFiles)
      let treeDatas = []
      let that = this
      _.forOwn(clonedopenedFiles, function(value, key) {
        if(typeof key != 'string'){
          return false
        }
        let pathArr = key.split('/')
        let pathLen = pathArr.length
        let pageName = pathArr[pathLen - 1].replace(/.md$/, '')
        let userName = pathArr[0]
        let siteName = pathArr[1]
        let nodeData = `/${userName}/${siteName}/${pageName}`
        treeDatas.push(nodeData)
      })
      return treeDatas
    },
    dataPrefix() {
      return location.origin
    },
    tipsData(){
      if(!process.env.EDITOR_WELCOME){
        return false
      }
      axios.get(process.env.EDITOR_WELCOME)
      .then((response) => {
        if(!response || !response.data || typeof (response.data.content) != 'string'){
          return false
        }
        this.tips = mdToJson(response.data.content)
        if(!Array.isArray(this.tips)){
          return false
        }
        this.tipsNumber = Math.floor(Math.random()*this.tips.length)
      })
      .catch((error) => {
        this.tips = []
      });
    }
  },
  created(){
    this.tipsData
  },
  components: {
    NewWebsiteDialog
  }
}
</script>
<style lang="scss" scoped>
.guid-content{
  .welcomeText{
    color: #000;
    font-size: 46px;
  }
  div{
    .welcomeButton {
      border-radius: 5px;
      letter-spacing: 4px;
      color: #fff;
      font-size: 18px;
      text-align: center;
      padding: 10px;
      background-color: #48a3ff;
      width: 180px;
      height: 20px;
      line-height: 21px;
      cursor:pointer;
    }
    .icon-next {
      float: right;
      color: #fff;
      font-size: 16px;
    }
  }
  .historical-hr {
    width: 439px;
    height: 1px;
    border-bottom: 1px dashed #ebebeb;
  }
  .recordsWeb{
    border-left: 2px solid #dc75cd;
    margin: 40px 0;
    ul
    {
      margin: 0;
      padding: 0 22px;
       li{
      list-style: none;
      margin: 8px 0;
      a{
        text-decoration: none;
        color:#535353;
      }
    }
    }
  }
  .tips-text{
    padding-top: 20px;
    font-size: 16px;
    padding-bottom: 10px;
    font-weight: 600;
    color: #777;
    max-width: 306px;
    white-space: normal;
  }
  .tips-img{
    width: 300px;
    height: 150px;
    border: 3px solid #ebebeb;
    img{
      width: 100%;
      height: 100%;
      object-fit:cover;
    }
  }
  .changeButton-next {
    width: 14px;
    height: 14px;
    font-size: 18px;
    color: #fff;
    display: block;
    line-height: 17px;
    padding: 6px;
    background-color: #a6a09e;
    border-radius: 50%;
    opacity:0.8;
    margin-top: -35px;
    margin-left: 270px;
    cursor:pointer;
  }
  .changeButton-next:hover {
    background-color: #48a3ff;
  }
  .historical-records {
    margin-top: 20px;
    margin-bottom: 15px;
    height: 150px;
    overflow-y:auto;
    .historical-records-text {
      font-size: 14px;
      display: block;
      color: #48a3ff;
      cursor:pointer;
      width: 350px;
    }
  }
}
@media only screen and (max-width: 1366px){
  .guid-content{
    .tips-text{
      font-size: 14px;
      max-width: 206px;
    }
    .tips-img{
      width: 200px;
      height: 100px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .changeButton-next {
      width: 13px;
      height: 13px;
      font-size: 12px;
      color: #fff;
      display: block;
      line-height: 15px;
      padding: 2px;
      margin-top: -25px;
      margin-left: 180px;
    }
  }
}
</style>
