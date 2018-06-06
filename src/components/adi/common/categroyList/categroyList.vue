<template>
  <div class="categroy-page">
    <!-- 列表一 -->
    <div class="categroy-page-list">
      <img class="categroy-page-list-left" src="https://user-images.githubusercontent.com/29323249/40962972-b1b431a0-68d9-11e8-9d3c-289b95956b04.png">
      <div class="categroy-page-list-right">
        <div class="categroy-page-list-right-font-size-one">2018年3月14日维护公告</div>
        <div class="categroy-page-list-right-font-size-two">
          《创意空间》是由配天研发的一款全新品类游戏，玩家在游戏中扮演召唤师，自
          由搭配各式各样的生物、法术、神器等卡牌，通过不同卡牌之间的跨回合连锁效
          果，来战胜强大的秘境首领或竞技场对手。
        </div>
        <div class="categroy-page-list-right-font-size-three">8102-03-13</div>
      </div>
    </div>
    <!-- 列表二 -->
    <div class="categroy-page-list">
      <img class="categroy-page-list-left" src="https://user-images.githubusercontent.com/29323249/40962972-b1b431a0-68d9-11e8-9d3c-289b95956b04.png">
      <div class="categroy-page-list-right">
        <div class="categroy-page-list-right-font-size-one">2018年3月14日维护公告</div>
        <div class="categroy-page-list-right-font-size-two">
          《创意空间》是由配天研发的一款全新品类游戏，玩家在游戏中扮演召唤师，自
          由搭配各式各样的生物、法术、神器等卡牌，通过不同卡牌之间的跨回合连锁效
          果，来战胜强大的秘境首领或竞技场对手。
        </div>
        <div class="categroy-page-list-right-font-size-three">8102-03-13</div>
      </div>
    </div>
  </div> 
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiCategroyList',
  mixins: [compBaseMixin],
  methods: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
  .categroy-page {
    width: 100%;
    border: #bbbaba 1px solid;
    padding-top: 30px;
    padding-bottom: 30px;
    .categroy-page-list {
      width: 650px;
      height: 102px;
      padding: 10px;
      margin: 0 auto;
      border-bottom: #000 1px dashed;
      .categroy-page-list-left {
        width: 162px;
        height: 92px;
        float: left;
        display: block;
        background-repeat: no-repeat;
        background-size: 100%;
      }
      .categroy-page-list-right {
        width: 465px;
        height: 92px;
        float: right;
        padding: 1px;
        div {
          width: 100%;
        }
        .categroy-page-list-right-font-size-one {
          height: 22px;
          overflow: hidden;
        }
        .categroy-page-list-right-font-size-two {
          font-size: 10px;
          height: 51px;
          overflow: hidden;
        }
        .categroy-page-list-right-font-size-three {
          font-size: 10px;
          text-align: right;
          height: 17px;
          overflow: hidden;
        }
      }
    }
  }
  @media (max-width:760px) {
    .categroy-page {
      width: 100%;
      height: auto;
      border: #bbbaba 1px solid;
      padding-top: 30px;
      padding-bottom: 30px;
      .categroy-page-list {
        width: 80%;
        height: auto;
        padding: 10px;
        margin: 0 auto;
        border-bottom: #000 1px dashed;
        .categroy-page-list-left {
          width: 100%;
          height: 100%;
          margin: 0 auto;
          float: none;
        }
        .categroy-page-list-right {
          width: 80%;
          margin: 0 auto;
          height: auto;
          float: none;
          padding: 1px;
          div {
            width: 100%;
          }
          .categroy-page-list-right-font-size-one {
            width: 80%;
            height: auto;
            margin: 0 auto;
            overflow: visible;
            text-align: center;
          }
          .categroy-page-list-right-font-size-two {
            width: 80%;
            font-size: 10px;
            height: auto;
            margin: 0 auto;
            overflow: visible;
            text-align: left;
          }
          .categroy-page-list-right-font-size-three {
            width: 80%;
            font-size: 10px;
            height: auto;
            margin: 0 auto;
            text-align: center;
            overflow: visible;
          }
        }
      }
    }
  }
</style>