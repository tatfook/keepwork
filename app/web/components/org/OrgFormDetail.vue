<template>
  <div class="org-form-detail" v-loading="isLoading">
    <org-header></org-header>
    <form-preview class="org-form-detail-form" :type="type" :title="title" :description="description" :text="text" :quizzes="quizzes" :isAnswerMode="true"></form-preview>
  </div>
</template>
<script>
import OrgHeader from './common/OrgHeader'
import FormPreview from './common/FormPreview'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrgFormDetail',
  async mounted() {
    this.isLoading = true
    await this.orgGetForms({})
    this.isLoading = false
  },
  computed: {
    ...mapGetters({
      getFormDetailById: 'org/getFormDetailById'
    }),
    formId() {
      return _.get(this.$route, 'params.id')
    },
    formDetail() {
      return this.getFormDetailById({ id: this.formId })
    },
    title() {
      return _.get(this.formDetail, 'title')
    },
    type() {
      return _.get(this.formDetail, 'type')
    },
    description() {
      return _.get(this.formDetail, 'description')
    },
    text() {
      return _.get(this.formDetail, 'text')
    },
    quizzes() {
      return _.get(this.formDetail, 'quizzes')
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    ...mapActions({
      orgGetForms: 'org/getForms'
    })
  },
  components: {
    OrgHeader,
    FormPreview
  }
}
</script>
<style lang="scss" scoped>
.org-form-detail {
  &-form {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
