<template>
  <div>
    <div @click="backToTop" class="quickToTop" v-if="showQuickToTop">
      <div class="toTopIcon"></div>
      <div class="topText">TOP</div>
      <div class="hoverWrap"><div class="hoverText">{{$t('common.quickToTop')}}</div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuickToTop",
  data(){
    return{
      showQuickToTop: false
    }
  },
  methods:{
    currentPageYOffset(){
      window.pageYOffset > 2160 ? this.showQuickToTop = true : this.showQuickToTop = false
    },
    backToTop(){
      window.scrollTo(0,0)
    }
  },
  created(){
    window.addEventListener('scroll', _.debounce(this.currentPageYOffset, 200))
  },
  beforeDestroy(){
    window.removeEventListener('scroll',this.currentPageYOffset)
  }
}
</script>

<style lang="scss" scoped>
.quickToTop{
  height: 56px;
  width: 56px;
  box-shadow: 0px 0px 2px #fff,0px 0px 2px #fff;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
  text-align: center;
  background-color: #fff;
  text-decoration: none;
  color: #303133;
  cursor: pointer;
  .toTopIcon{
    width: 12px;
    height: 12px;
    border: 2px solid ;
    border-right-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(45deg);
    position: absolute;
    left: 20px;
    top: 8px;
  }
  .topText{
    margin-top: 28px;
  }
  .hoverWrap{
    display: none;
    .hoverText{
    width: 100%;
    height: 100%;
    color: #fff;
    position: absolute;
    left: 10px;
    width: 35px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  }
  &:hover{
    background-color: #0075b4;
    box-shadow: 0px 0px 2px #0075b4,0px 0px 2px #0075b4;
    .toTopIcon{
      display: none;
    }
    .topText{
      display: none;
    }
    .hoverWrap{
      display: block;
    }
  }
}
@media print {
  .quickToTop {
    display: none;
  }
}
</style>


