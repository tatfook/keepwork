<template>
  <div class="org-form-detail" v-loading="isLoading">
    <org-header></org-header>
    <div class="org-form-detail-container">
      <form-preview class="org-form-detail-form" :type="type" :title="title" :description="description" :text="text" :quizzes="quizzes" :isAnswerMode="true"></form-preview>
      <div class="org-form-detail-qrcode">
        <div class="org-form-detail-qrcode-main">
          <qrcode-vue :value="nowPageLink" :size="60" level="L" className="org-form-detail-qrcode-box"></qrcode-vue>
        </div>
        扫一扫，手机继续看
      </div>
    </div>
  </div>
</template>
<script>
import QrcodeVue from 'qrcode.vue'
import OrgHeader from './common/OrgHeader'
import FormPreview from './common/FormPreview'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrgFormDetail',
  async mounted() {
    this.isLoading = true
    await this.getOrgDetailByLoginUrl({ orgLoginUrl: this.orgLoginUrl })
    await this.orgGetForms({ organizationId: this.orgId })
    this.isLoading = false
  },
  computed: {
    ...mapGetters({
      orgGetOrgDetailByLoginUrl: 'org/getOrgDetailByLoginUrl',
      getFormDetailById: 'org/getFormDetailById'
    }),
    orgLoginUrl() {
      return _.get(this.$route, 'params.orgLoginUrl')
    },
    orgDetail() {
      return this.orgGetOrgDetailByLoginUrl({ loginUrl: this.orgLoginUrl })
    },
    orgId() {
      return _.get(this.orgDetail, 'id')
    },
    nowPageLink() {
      return window.location.href
    },
    formId() {
      return _.get(this.$route, 'params.id')
    },
    formDetail() {
      return this.getFormDetailById({ id: this.formId, orgId: this.orgId })
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
      getOrgDetailByLoginUrl: 'org/getOrgDetailByLoginUrl',
      orgGetForms: 'org/getForms'
    })
  },
  components: {
    QrcodeVue,
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
  &-container {
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    display: table-cell;
  }
  &-qrcode {
    position: absolute;
    right: 0;
    top: 20px;
    text-align: center;
    font-size: 12px;
    &-main {
      margin-bottom: 8px;
    }
    &-box {
      display: inline-block;
      padding: 6px;
      background-color: #fff;
      border-radius: 8px;
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 1016px) {
  .org-form-detail {
    &-qrcode {
      display: none;
    }
  }
}
</style>
