<template>
  <div class='comp-comment' v-loading='loading'>
    <div class="style-0" v-if="getStyleId === 0">
      <div v-if="properties.switch.value">
        <h3>{{$t(options.title)}}</h3>
        <div class="comment-input">
          <textarea v-model="content" :placeholder="$t(options.notice)"></textarea>
          <el-button @click="commit">{{$t(options.commit)}}</el-button>
        </div>
        <div class="comment-box">
          <div class="comment-item" v-for='comment in getCommentList' :key='comment.id'>
            <img :src="comment.extra.portrait">
            <div class="text">
              <h4>{{ comment.extra.username }}</h4>
              <p class="info">{{ getFormatDate(comment.updatedAt) }}</p>
              <p>{{ comment.content }}</p>
            </div>
            <a class="delete-btn" @click="deleteComment(comment.id)">{{$t(options.delete)}}</a>
          </div>
        </div>
      </div>
      <div class="shutup-comment" v-if="!properties.switch.value">
        {{$t(options.close)}}
      </div>
    </div>
    <div class="style-1" v-if="getStyleId === 1">
      <div v-if="properties.switch.value">
        <div class="comment-box">
          <div class="comment-input">
            <textarea v-model="content" :placeholder="$t(options.notice)"></textarea>
            <button @click="commit">{{$t(options.commit)}}</button>
          </div>
          <h3><img :src="getStyleOneId">{{$t(options.title)}}</h3>
          <hr>
          <div class="comment-item" v-for='comment in getCommentList' :key='comment.id'>
            <img :src="comment.extra.portrait">
            <div class="text">
              <h4>{{ comment.extra.username }}</h4>
              <p class="info">{{ getFormatDate(comment.updatedAt) }}</p>
              <p>{{ comment.content }}</p>
              <hr>
            </div>
            <a class="delete-btn" @click="deleteComment(comment.id)">{{$t(options.delete)}}</a>
          </div>
        </div>
      </div>
      <div class="shutup-comment" v-if="!properties.switch.value">
        {{$t(options.close)}}
      </div>
    </div>

    <el-pagination v-if="isShowPagination" class="pagination" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
import compBaseMixin from '../comp.base.mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AdiComment',
  mixins: [compBaseMixin],
  data() {
    return {
      loading: false,
      content: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  async mounted() {
    this.loadComments()
  },
  computed: {
    ...mapGetters({
      userIsLogined: 'user/isLogined',
      isRealNamed: 'user/isRealNamed',
      activePageCommentList: 'user/activePageCommentList'
    }),
    getStyleId() {
      return this.options.styleId || 0
    },
    getStyleOneId() {
      return require('@/assets/adi/comment/style-1-title-icon.png')
    },
    getCommentList() {
      if (
        this.activePageCommentList &&
        this.activePageCommentList.commentList
      ) {
        return this.activePageCommentList.commentList
      }

      return []
    },
    isShowPagination() {
      if (typeof this.total === 'number' && this.total > 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'user/toggleLoginDialog',
      toggleRealName: 'user/toggleRealName',
      setActiveProperty: 'setActiveProperty',
      setActivePropertyData: 'setActivePropertyData',
      getActivePageComments: 'user/getActivePageComments',
      createCommentForActivePage: 'user/createCommentForActivePage',
      deleteCommentById: 'user/deleteCommentById'
    }),
    async commit() {
      let { content } = this
      let checkContent = ''

      if (typeof content === 'string') {
        checkContent = content.replace(/ /g, '')
      }
      if (!this.userIsLogined) {
        this.toggleLoginDialog(true)
      }
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      if (!checkContent) {
        return false
      }

      this.loading = true
      await this.createCommentForActivePage({ content })
      this.content = ''
      this.loading = false

      this.currentPage = 1
      this.loadComments()
    },
    async deleteComment(commentId) {
      this.loading = true
      await this.deleteCommentById({ id: commentId, page: this.currentPage })
      this.loading = false

      this.loadComments(this.currentPage)
    },
    getFormatDate(time) {
      const offset = moment().utcOffset()
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(time)
        .utcOffset(offset)
        .fromNow()
    },
    async loadComments(page) {
      this.loading = true

      page = page || this.currentPage

      this.currentPage = page

      await this.getActivePageComments({ page })

      if (
        this.activePageCommentList &&
        this.activePageCommentList.commentList &&
        this.activePageCommentList.commentList.length === 0
      ) {
        if (typeof this.currentPage === 'number' && this.currentPage !== 1) {
          this.loadComments(this.currentPage - 1)
        }
      }
      if (
        this.activePageCommentList &&
        this.activePageCommentList.commentTotal
      ) {
        this.total = this.activePageCommentList.commentTotal
      } else {
        this.total = 0
      }

      this.loading = false
    },
    handleCurrentChange(page) {
      this.loadComments(page)
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-comment {
  padding: 0;

  .style-0 {
    .comment-box {
      .comment-item {
        margin: 15px 0;
        position: relative;

        & > img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          float: left;
        }

        .text {
          padding-left: 90px;
          position: relative;
          min-height: 80px;
          padding-right: 30px;

          h4 {
            margin: 0;
          }

          .info {
            font-size: 12px;
            color: #999;
            margin-bottom: 5px;
          }
        }

        .delete-btn {
          position: absolute;
          cursor: pointer;
          right: 0;
          top: 0;
        }
      }
    }

    .comment-input {
      display: flex;
      align-items: flex-end;

      textarea {
        margin-right: 15px;
        resize: none;
        width: 100%;
        height: 68px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }

    .shutup-comment {
      border: 1px solid #999999;
      padding: 60px;
      text-align: center;
    }
  }

  .style-1 {
    .comment-box {
      .comment-input {
        text-align: right;
        overflow: hidden;

        textarea {
          resize: none;
          box-sizing: border-box;
          width: 100%;
          height: 74px;
          border: 2px solid #d4d4d4;
          outline: none;
          background-color: #eeeeee;
          font-size: 14px;
          padding: 10px;
        }

        button {
          font-size: 14px;
          background-color: black;
          font-weight: 600;
          border: none;
          padding: 15px 25px;
          color: white;
          outline: none;
          cursor: pointer;
        }
      }

      & > h3 {
        font-weight: 900;
        font-size: 22px;

        img {
          vertical-align: middle;
          margin-right: 10px;
        }
      }

      & > hr {
        border: 1px solid #dddddd;
      }

      .comment-item {
        margin: 15px 0;
        position: relative;

        & > img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          float: left;
        }

        .text {
          padding-left: 90px;
          position: relative;
          min-height: 80px;
          margin-bottom: 30px;

          hr {
            border: 1px solid #dddddd;
          }

          h4 {
            margin: 0;
          }

          .info {
            font-size: 12px;
            color: #999;
            margin-bottom: 5px;
          }
        }

        .delete-btn {
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
        }
      }
    }

    .shutup-comment {
      border: 1px solid #999999;
      padding: 60px;
      text-align: center;
    }
  }

  .pagination {
    text-align: center;
  }
}
</style>
