<template>
  <div class="comp categroy-list-comp">
    <div class="style-0" v-if="getStyleId === 0">
      <div class="item" v-for="(item, index) in [{test: 1},{test: 2}]" :key="index">
        <el-row class="item-container" :gutter="5">
          <el-col :span="6" :xs="24">
            <img class="cover" src="https://user-images.githubusercontent.com/29323249/40962972-b1b431a0-68d9-11e8-9d3c-289b95956b04.png">
          </el-col>
          <el-col :span="18" :xs="24">
            <div class="desc">
              <div class="title">2018年3月14日维护公告</div>
              <div class="summary">
                《创意空间》是由配天研发的一款全新品类游戏，玩家在游戏中扮演召唤师，自 由搭配各式各样的生物、法术、神器等卡牌，通过不同卡牌之间的跨回合连锁效 果，来战胜强大的秘境首领或竞技场对手。
              </div>
              <div class="date">2018-03-13</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="style-1" v-if="getStyleId === 1">
      <div class="item"  v-for="(item, index) in [{test: 1},{test: 2},{test: 2},{test: 2}]" :key="index">
        <img class="cover" src="https://user-images.githubusercontent.com/29323249/40962972-b1b431a0-68d9-11e8-9d3c-289b95956b04.png">
        <div class="desc">
          <div class="title">2018年3月14日维护公告</div>
          <div class="summary">作者：xxxxxxx</div>
        </div>
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
.categroy-list-comp {
  width: 100%;
  box-shadow: 0px 1px 25px #00000036;
  padding: 30px 0;
  margin: 0 auto;

  .style-0 {
    .item {
      height: auto;
      padding: 0 2.5%;
      margin: 0 auto;

      .item-container {
        border-bottom: rgb(29, 14, 14) 1px dashed;

        & > div {
          padding-top: 10px;
          padding-bottom: 10px;
        }
      }

      .cover {
        width: 100%;
        display: block;
        background-repeat: no-repeat;
        background-size: 100%;

        @media only screen and (min-width: 768px) {
          max-width: 240px;
        }
      }

      .desc {
        height: 135px;
        padding: 1px;

        .title {
          height: 23px;
          overflow: hidden;
        }

        .summary {
          font-size: 12px;
          height: 104px;
          overflow: hidden;
        }

        .date {
          font-size: 10px;
          text-align: right;
          height: 17px;
          overflow: hidden;
        }
      }

      @media (max-width: 1000px) {
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

      @media (max-width: 760px) {
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
  }

  .style-1 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 30px;

    &::after {
      content: "";
      width: 300px;
    }

    .item {
      padding: 10px 0;

      @media only screen and (max-width: 768px) {
        width: 100%;
      }

      .cover {
        display: block;
        width: 300px;

        @media only screen and (max-width: 768px) {
          width: 100%;
        }
      }

      .desc {
        margin-top: 10px;

        .title {
          text-align: center;
        }

        .summary {
          text-align: center;
        }
      }
    }
  }
}
</style>