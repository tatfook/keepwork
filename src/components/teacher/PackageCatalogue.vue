<template>
  <div class="package-catalogue">
    <div class="package-catalogue-title">目录</div>
    <div class="package-catalogue-box">
      <div class="package-catalogue-item" @click="toPackageDetail">
        <img class="package-catalogue-item-cover" src="http://oy41jt2uj.bkt.clouddn.com/73e5b270-914e-11e8-b142-e9035cf67219.jpg?e=1533006779&token=LYZsjH0681n9sWZqCM4E2KmU6DsJOE7CAM4O3eJq:FvRUBTcr_ADDbD6ObVgJLP5NVRs=" alt="">
        <div class="package-catalogue-item-detail">
          <div class="package-catalogue-item-title">
            <span>lesson title lesson title lesson titlenpm</span>
          </div>
          <div class="package-catalogue-item-info">课程目标:</div>
          <div class="package-catalogue-item-goals">
            <p class="package-catalogue-item-goals-item">lessons goals 1</p>
            <p class="package-catalogue-item-goals-item">lessons goals 2</p>
          </div>
          <div class="package-catalogue-item-duration">持续时间：
            <span>45min</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PackageCatalogue',
  methods: {
    toPackageDetail() {
      this.$alert('请先添加课程包', '提示')
    }
  }
}
</script>
<style lang="scss" scoped>
.package-catalogue {
  border: 1px solid #e5e5e5;
  padding-bottom: 30px;
  &-title {
    font-size: 16px;
    color: #333;
    height: 55px;
    line-height: 55px;
    padding: 0 11px;
    font-weight: bold;
  }
  &-item {
    border: 1px solid #e5e5e5;
    border-width: 1px 0;
    padding: 3px 10px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    font-weight: lighter;
    cursor: pointer;
    &-cover {
      width: 250px;
      height: 146px;
      object-fit: cover;
      margin-right: 22px;
    }
    &-detail {
      flex: 1;
      min-width: 0;
    }
    &-title {
      margin: 12px 0 8px;
      font-size: 18px;
      color: #181818;
      font-weight: normal;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &-info {
      color: #999;
    }
    &-duration {
      margin: 25px 0 15px;
    }
    &-goals {
      max-height: 100px;
      overflow: auto;
      &-item {
        padding-left: 12px;
        position: relative;
        margin: 0;
        line-height: 22px;
      }
      &-item::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #666;
        position: absolute;
        left: 0;
        top: 10px;
      }
    }
  }
}
</style>
