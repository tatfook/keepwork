<template>
  <div class="categroy-page">
    <!-- 列表一 -->
    <div class="styleOne">
      <div class="categroy-page-list" v-if="getStyleId === 0">
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
    <!-- 列表二 -->
    <div class="categroy-page-list" v-if="getStyleId === 1">
      <img class="categroy-page-list-left" src="https://user-images.githubusercontent.com/29323249/40962972-b1b431a0-68d9-11e8-9d3c-289b95956b04.png">
      <div class="categroy-page-list-right">
        <div class="categroy-page-list-right-font-size-one">2018年3月14日维护公告</div>
        <div class="categroy-page-list-right-font-size-two">
          《11111111111111111111111111111111111111111111
        </div>
        <div class="categroy-page-list-right-font-size-three">8102-03-13</div>
      </div>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiCategoryList',
  mixins: [compBaseMixin],
  methods: {},
  computed: {
    getStyleId() {
      return this.options.styleId || 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .categroy-page {
    width: 94%;
    border: #bbbaba 1px solid;
    padding:30px 2.5%;
    margin: 0 auto;
    .styleOne {
      .categroy-page-list {
        width: 90%;
        height: 135px;
        padding: 2.5%;
        margin: 0 auto;
        border-bottom: #000 1px dashed;
        .categroy-page-list-left {
          width: 240px;
          height: 135px;
          float: left;
          display: block;
          background-repeat: no-repeat;
          background-size: 100%;
        }
        .categroy-page-list-right {
          width: 70%;
          height: 135px;
          float: right;
          padding: 1px;
          div {
            width: 100%;
          }
          .categroy-page-list-right-font-size-one {
            height: 23px;
            overflow: hidden;
          }
          .categroy-page-list-right-font-size-two {
            font-size: 10px;
            height: 104px;
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
    @media (max-width:1000px) {
      .categroy-page {
        .styleOne {
          .categroy-page-list {
            .categroy-page-list-right {
              width: 60%;
              height: 135px;
              float: right;
              padding: 1px;
            }
          }
        }
      }
    }
    @media (max-width:760px) {
      .categroy-page {
        width: 94%;
        height: auto;
        border: #bbbaba 1px solid;
        padding: 30px 2.5%;
        .styleOne {
          .categroy-page-list {
            width: 90%;
            padding: 2.5%;
            height: auto;
            margin: 0 auto;
            border-bottom: #000 1px dashed;
            .categroy-page-list-left {
              width: 100%;
              height: 100%;
              margin: 0 auto;
              float: none;
            }
            .categroy-page-list-right {
              width: 100%;
              height: auto;
              float: none;
              padding: 1px;
              div {
                width: 100%;
              }
              .categroy-page-list-right-font-size-one {
                width: 100%;
                height: auto;
                overflow: visible;
                text-align: center;
              }
              .categroy-page-list-right-font-size-two {
                width: 100%;
                font-size: 10px;
                height: auto;
                overflow: visible;
                text-align: left;
              }
              .categroy-page-list-right-font-size-three {
                width: 100%;
                font-size: 10px;
                height: auto;
                text-align: center;
                overflow: visible;
              }
            }
          }
        }
      }
    }
  }
</style>