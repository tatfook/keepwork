<template>
  <el-dialog class="tree-data-dialog" title="Add animations" :visible.sync="show" width="900px" :before-close="handleClose">
    <draggable v-model="animationsDataCopy">
      <transition-group>
        <div v-for="item in animationsDataCopy" :key="item.id">
          <el-row :gutter="10" class="row-animation">
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
              <el-form class="animationForm" label-position="right" label-width="160px">
                <el-form-item label="Title">
                  <el-input v-model="item.title"></el-input>
                </el-form-item>
                <el-form-item label="Cover Image">
                  <el-input v-model="item.coverImage"></el-input>
                </el-form-item>
                <el-form-item label="Animation">
                  <el-input v-model="item.animation"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
              <el-button type="danger" icon="el-icon-delete" @click="removeItem(item.id)" circle></el-button>
            </el-col>
          </el-row>
        </div>
      </transition-group>
    </draggable>
    <el-button type="primary" icon="el-icon-plus" @click="addAnimation" circle></el-button>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave()">submit</el-button>
      <el-button @click="handleClose()">cancel</el-button>
    </span>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
import _ from 'lodash'

function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

export default {
  name: 'animationsDataEditor',
  props: {
    show: Boolean
  },
  data() {
    this.animationsData = []
    return {
      animationsDataCopy: _.cloneDeep(this.animationsData)
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
    removeItem(id) {
      for(let i = 0; i < this.animationsDataCopy.length; i++) {
        if(this.animationsDataCopy[i].id == id) {
          this.animationsDataCopy.splice(i, 1)
        }
      }
    },
    handleSave() {
      this.handleClose();
      this.$emit('finish', this.animationsDataCopy);
    },
    addAnimation() {
      this.animationsDataCopy.push({
        id: uuid(8, 16),
        title: '',
        coverImage: '',
        animation: ''
      })
    }
  },
  components: {
    draggable
  }
}
</script>

<style>
.row-animation{
  display:flex;
  display:-webkit-flex;
  display:-moz-flex;
  display:-ms-flex;
  display:-o-flex;
  align-items:center;
  -webkit-align-items:center;
  -moz-align-items:center;
  -ms-align-items:center;
  -o-align-items:center;
}
.animationForm{
  margin: 5px;
  padding: 5px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
