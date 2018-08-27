<template>
  <div class="teacher-wrap">
    <div class="teacher">
      <div class="teacher-top-hint">
        <p>{{$t('lesson.notActivatedText.hint')}}</p>
        <p class="red-hint">{{$t('lesson.notActivatedText.getActivationCode')}}</p>
        <div class="teacher-top-hint-input">
          <el-input class="active-code-input" v-model="activeCode" size="small" :placeholder="$t('lesson.notActivatedText.inputPlaceholder')"></el-input>
          <el-button class="active-code-button" :disabled="!activeCode" type="primary" size="mini" @click="activateTeacherIdentity">{{$t('lesson.notActivatedText.buttonText')}}</el-button>
        </div>
      </div>
      <div class="teacher-acquire">
        <h4>{{$t('lesson.notActivatedText.getPrivilege')}}</h4>
        <el-row :gutter="60">
          <el-col :sm="12" :xs="22" v-for="n in 2" :key="n">
            <div class="acquire-item">
              <div :class="['role',n === 2 ? 'role-teacher':'']">{{n === 1 ? $t('lesson.notActivatedText.roleStudent') : $t('lesson.notActivatedText.roleTeacher')}}</div>
              <div class="access">
                <p>
                  <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege1')}}</p>
                <p>
                  <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege2')}}</p>
                <p>
                  <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege3')}}</p>
                <p>
                  <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege4')}}</p>
                <div class="teaching-function">
                  <p>
                    <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege5')}}</p>
                  <p>
                    <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege6')}}</p>
                  <p>
                    <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege7')}}</p>
                  <p>
                    <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege8')}}</p>
                  <p>
                    <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege9')}}</p>
                </div>
                <p>
                  <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.notActivatedText.privilege10')}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div @click.stop v-if="isLoginDialogShow">
      <login-dialog :show="isLoginDialogShow" @close="closeLoginDialog"></login-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lesson } from '@/api'
import LoginDialog from '@/components/common/LoginDialog'

export default {
  name: 'NotActivatedTeacherRole',
  data() {
    return {
      isLoginDialogShow: false,
      activeCode: ''
    }
  },
  mounted() {
    if (!this.userIsLogined) {
      this.getProfile({ forceLogin: false })
        .then(() => {
          this.isLogin = true
        })
        .catch(() => {
          this.isLogin = false
        })
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userIsLogined: 'user/isLogined',
      userId: 'user/userId',
      userinfo: 'lesson/userinfo'
    }),
    isLogin: {
      get() {
        return this.userIsLogined
      },
      set() {}
    }
  },
  methods: {
    ...mapActions({
      getProfile: 'user/getProfile',
      getUserDetail: 'lesson/getUserDetail'
    }),
    async activateTeacherIdentity() {
      if (this.isLogin) {
        let payload = { userId: this.userId, key: this.activeCode }
        await lesson.users
          .toBeTeacher(payload)
          .then(res => {
            this.getUserDetail()
            this.$message({
              message: this.$t('lesson.activatedTeaching'),
              type: 'success',
              showClose: true
            })
          })
          .catch(err => {
            this.$alert(
              `<span style="color:#f75858;">` +
                this.$t('lesson.notActivatedText.wrongCodeHint') +
                `</span>`,
              '',
              {
                confirmButtonText: this.$t('common.Sure'),
                center: true,
                dangerouslyUseHTMLString: true,
                callback: action => {}
              }
            )
          })
      } else {
        this.isLoginDialogShow = true
      }
    },
    closeLoginDialog() {
      this.isLoginDialogShow = false
    }
  },
  components: {
    LoginDialog
  }
}
</script>

<style lang="scss">
.teacher-wrap {
  .teacher {
    max-width: 1150px;
    margin: 0 auto;
    &-top-hint {
      font-size: 14px;
      background: rgba(64, 158, 254, 0.1);
      padding: 25px;
      .red-hint {
        color: #f75858;
      }
      &-input {
        .active-code-input {
          width: 384px;
          height: 35px;
        }
      }
    }
    &-acquire {
      margin: 60px 0;
      .acquire-item {
        width: 545px;
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 30px;
        box-shadow: 1px 1px 5px #ddd9d9, -1px -1px 5px #ddd9d9;
        .role {
          height: 86px;
          text-align: center;
          font-size: 26px;
          color: #333333;
          background: #f7f7f7;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .role-teacher {
          background: #409efe;
        }
        .access {
          padding: 44px 25px;
          background: #fff;
          p {
            display: flex;
            align-items: center;
            .img-wrap {
              margin-right: 8px;
              display: inline-block;
              width: 20px;
              height: 20px;
              .not-student-privilege {
                visibility: hidden;
              }
            }
          }
          .teaching-function {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>