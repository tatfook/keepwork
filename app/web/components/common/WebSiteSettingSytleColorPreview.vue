<template>
  <div class="colors-preview">
    <div v-for="(colors, index) in colorsList" :key="index" class="colors-preview-row">
      <div :class="['colors-preview-row-container',{'isSelected': index == colorID}]" @click="handleSelect(index)">
        <div v-for="color in colors" :style="{'background': color}" :key="color" class="colors-preview-row-item"></div>
      </div>
      <div :class="['colors-preview-row-options', {'colors-preview-row-selected': index == colorID}]"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebsiteSettingColorPreview',
  props: {
    colorsList: {
      type: Array,
      default: []
    },
    colorID: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleSelect(index) {
      this.$emit('handleSelectColor', index)
    }
  }
}
</script>

<style lang="scss">
.colors-preview {
  padding: 20px;
  &-row {
    width: 380px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 10px;
    &-container {
      display: flex;
      flex: 1;
      box-sizing: border-box;
      border-radius: 5px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 0 10px #e9e9e9;
      &:hover {
        box-shadow: 0 0 10px #3ba4ff;
      }
    }
    &-item {
      flex: 1;
    }
    &-options {
      width: 30px;
      height: 30px;
      margin-left: 10px;
      background: transparent;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      &::after {
        content: ' ';
        display: block;
        height: 14px;
        width: 7px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        transform: rotate(45deg);
      }
    }
    &-selected {
      background: #3ba4ff;
    }
  }
}
.isSelected {
  box-shadow: 0 0 10px #3ba4ff;
}
</style>
