<template>
  <div class="form-templates">
    <div class="form-templates-item" v-for="(template, index) in formTemplates" :key="index">
      <el-popover :appendToBody="false" popper-class="form-templates-preview" placement="right" trigger="hover" width="500">
        <img :src="template.preview" alt="template.name">
        <div class="form-templates-item-box" slot="reference">
          <img class="form-templates-item-thumb" :src="template.thumb" :alt="template.name">
          <el-button class="form-templates-item-create hover-show" type="primary" size="medium" @click="showNamePrompt(template)">创建</el-button>
        </div>
      </el-popover>
      <div class="form-templates-item-name">{{template.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormTemplates',
  data() {
    return {
      selectedTemplate: {},
      formTemplates: [
        {
          thumb: require('@/assets/org/form_template1.png'),
          preview: require('@/assets/org/form_template1_preview.png'),
          name: '空白模板'
        },
        {
          thumb: require('@/assets/org/form_template2.png'),
          preview: require('@/assets/org/form_template2_preview.png'),
          name: '招生通知'
        },
        {
          thumb: require('@/assets/org/form_template3.png'),
          preview: require('@/assets/org/form_template3_preview.png'),
          name: '入学作品提交通知'
        },
        {
          thumb: require('@/assets/org/form_template4.png'),
          preview: require('@/assets/org/form_template4_preview.png'),
          name: '报名表'
        },
        {
          thumb: require('@/assets/org/form_template5.png'),
          preview: require('@/assets/org/form_template5_preview.png'),
          name: '入选学员通知'
        }
      ]
    }
  },
  methods: {
    showNamePrompt(template) {
      this.selectedTemplate = template
      this.$prompt('名称', '创建表单', {
        confirmButtonText: '保存',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          console.log('formName: ' + value)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.form-templates {
  display: flex;
  font-size: 14px;
  text-align: center;
  &-item {
    flex: 1;
    padding: 0 8px;
    &-box {
      position: relative;
      border: 2px solid transparent;
      border-radius: 12px;
      overflow: hidden;
      &:hover {
        border-color: #2397f3;
        .hover-show {
          display: inline-block;
        }
      }
    }
    &-thumb {
      width: 100%;
      height: auto;
    }
    &-create {
      display: none;
      position: absolute;
      left: 50%;
      right: 50%;
      bottom: 50%;
      top: 50%;
      transform: translate(-50%, -18px);
      height: 36px;
    }
  }
}

/deep/.form-templates-preview {
  padding: 0;
  img {
    width: 100%;
    height: auto;
  }
}
</style>
