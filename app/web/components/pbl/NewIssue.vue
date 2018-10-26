<template>
  <el-dialog v-if="show" :visible.sync="show" :before-close="handleClose" class="new-issue-dialog">
    <div class="new-issue">
      <div class="title">新建问题</div>
      <div class="sketch">
        <div class="sketch-box">
          <div class="sketch-box-tag">标题</div>
          <div class="sketch-box-content">
            <el-input size="medium" v-model="issueTitle"></el-input>
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag">标签</div>
          <div class="sketch-box-content">
            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleCloseTag(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag">指派</div>
          <div class="sketch-box-content">
            <!-- 指派头像显示 -->
            <div class="player">
              <!-- <img class="player-portrait" src="http://127.0.0.1:7001/public/img/default_portrait.png" alt=""> -->
              <span class="assigns-btn"></span>
            </div>
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag">描述</div>
          <div class="sketch-box-content">
            <el-input type="textarea" :rows="4" placeholder="互联网改变世界" v-model="descriptionText"></el-input>
          </div>
        </div>
      </div>
      <div class="finish">
        <el-button size="medium" type="primary" @click="finishedCreateIssue">完成创建</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { keepwork } from '@/api'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'NewIssue',
  props: {
    show: Boolean,
    projectId: {
      required: true
    },
  },
  data() {
    return {
      issueTitle: '创建的新issue',
      dynamicTags: ['需求', '设计', '产品'],
      inputVisible: false,
      inputValue: '',
      descriptionText: '这里是issue的描述文字'
    }
  },
  async created(){
    await this.getProjectMember({
      objectId: this.projectId,
      objectType: 5
    })
  },
  mounted(){
    console.log('assign',this.memberList)
  },
  computed: {
    ...mapGetters({
      pblProjectMemberList: 'pbl/projectMemberList'
    }),
    memberList() {
      return this.pblProjectMemberList({ projectId: this.projectId })
    },
  },
  methods: {
     ...mapActions({
      getProjectIssues: 'pbl/getProjectIssues',
      getProjectMember: 'pbl/getProjectMember',      
    }),
    handleCloseTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClose() {
      this.$emit('close')
    },
    async finishedCreateIssue() {
      this.$nextTick(async () => {
        let payload = {
          objectType: 5,
          objectId: this.projectId,
          title: this.issueTitle,
          content: this.descriptionText,
          tags: this.dynamicTags.toString().split(',').join('|'),
          assigns: ''
        }
        await keepwork.issues
          .createIssue(payload)
          .then(res => {
            this.getProjectIssues({ objectId: this.projectId, objectType: 5 })
            this.handleClose()
            })
          .catch(err => console.error(err))
      })
    }
  }
}
</script>
<style lang="scss">
.new-issue-dialog {
  .el-dialog {
    max-width: 600px;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 6px 20px;
    }
  }

  .new-issue {
    margin: 0 auto;
    background: #fff;
    .title {
      line-height: 60px;
      font-size: 16px;
      color: #303133;
      padding-left: 4px;
      font-weight: bold;
      border-bottom: 1px solid #e8e8e8;
      max-width: 600px;
      margin-bottom: 12px;
    }
    .sketch {
      padding-left: 6px;
      &-box {
        display: flex;
        line-height: 60px;
        max-width: 600px;
        &-tag {
          width: 52px;
          font-size: 14px;
          color: #909399;
        }
        &-content {
          flex: 1;
          .el-tag + .el-tag {
            margin-left: 10px;
          }
          .player{
            line-height: 38px;
            margin-bottom: 8px;
            &-portrait {
              width: 36px;
              height: 36px;
              margin:8px 6px 0 0;
              border-radius: 50%;
              border: 1px solid #e8e8e8;
            }
            .assigns-btn{
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 1px solid #e8e8e8;
              display: inline-block;
              position: relative;
              margin-top: 8px;
              &::after{
                content: '';
                height: 16px;
                width: 1px;
                background: #6e6d6d;
                position: absolute;
                left: 17px;
                top: 10px;
              }
              &::before{
                content: '';
                height: 1px;
                width: 16px;
                background: #6e6d6d;
                position: absolute;
                left: 10px;
                top: 17px;
              }
            }
          }
        }
      }
    }
    .finish {
      padding: 24px 68px;
    }
  }
}
</style>

