<template>
  <div class="org-forms">
    <div class="org-forms-header">表单管理</div>
    <div class="org-forms-empty">
      <div class="org-forms-empty-container">
        <p>你还没有表单哦，点击下方按钮去创建你的第一份表单吧！</p>
        <el-button type="primary" size="medium">创建表单</el-button>
      </div>
    </div>
    <div class="org-forms-templates">
      <div class="org-forms-templates-header">表单模板</div>
      <div class="org-forms-templates-list">
        <div class="org-forms-templates-item" v-for="(template, index) in formTemplates" :key="index">
          <div class="org-forms-templates-item-box">
            <img class="org-forms-templates-item-thumb" :src="template.thumb" :alt="template.name">
            <el-button class="org-forms-templates-item-create hover-show" type="primary" size="medium">创建</el-button>
          </div>
          <div class="org-forms-templates-item-name">{{template.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrgForms',
  data() {
    return {
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
  }
}
</script>
<style lang="scss" scoped>
.org-forms {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  color: #303133;
  &-header {
    font-size: 16px;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
  }
  &-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    color: #999;
    p {
      margin: 0 0 20px 0;
    }
  }
  &-templates {
    border-top: 1px solid #e8e8e8;
    padding: 0 24px 16px;
    &-header {
      font-size: 16px;
      padding: 16px 0;
    }
    &-list {
      display: flex;
      margin: 0 -8px;
      font-size: 14px;
      text-align: center;
    }
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
}
</style>
