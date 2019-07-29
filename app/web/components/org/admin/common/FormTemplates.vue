<template>
  <div class="form-templates" v-loading="isLoading">
    <div class="form-templates-item" v-for="(template, index) in formTemplates" :key="index">
      <el-popover :appendToBody="false" popper-class="form-templates-preview" placement="right" trigger="hover" width="500">
        <img :src="template.preview" alt="template.title">
        <div class="form-templates-item-box" slot="reference">
          <img class="form-templates-item-thumb" :src="template.thumb" :alt="template.title">
          <el-button class="form-templates-item-create hover-show" type="primary" size="medium" @click="showNamePrompt(template)">创建</el-button>
        </div>
      </el-popover>
      <div class="form-templates-item-name">{{template.title}}</div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'FormTemplates',
  data() {
    return {
      isLoading: false,
      formTemplates: [
        {
          type: 0,
          thumb: require('@/assets/org/form_template1.png'),
          preview: require('@/assets/org/form_template1_preview.png'),
          title: '空白模板'
        },
        {
          type: 1,
          thumb: require('@/assets/org/form_template2.png'),
          preview: require('@/assets/org/form_template2_preview.png'),
          title: '招生通知'
        },
        {
          type: 2,
          thumb: require('@/assets/org/form_template3.png'),
          preview: require('@/assets/org/form_template3_preview.png'),
          title: '入学作品提交通知'
        },
        {
          type: 3,
          thumb: require('@/assets/org/form_template4.png'),
          preview: require('@/assets/org/form_template4_preview.png'),
          title: '报名表'
        },
        {
          type: 4,
          thumb: require('@/assets/org/form_template5.png'),
          preview: require('@/assets/org/form_template5_preview.png'),
          title: '入选学员通知'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      orgCreateForm: 'org/createForm'
    }),
    showNamePrompt(template) {
      let { type, title } = template
      this.$prompt('名称', '创建表单', {
        confirmButtonText: '保存',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        this.isLoading = true
        await this.orgCreateForm({
          type,
          title,
          name: value
        })
        this.$message({ type: 'success', message: '创建成功' })
        this.isLoading = false
        this.$router.push({
          name: 'OrgForms'
        })
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
