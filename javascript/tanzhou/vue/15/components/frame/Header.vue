<template>
  <div class="header">
    <div class="logo">
      <img src="./../../assets/img/logo.png" />
      后台管理系统
    </div>

    <el-radio-group v-model="media" size="mini" class="switchMedia" @change="switchMedia">
      <el-radio-button label="PC">PC端</el-radio-button>
      <el-radio-button label="M">M端</el-radio-button>
    </el-radio-group>

    <div class="user-info">
      <span>{{username}}</span>

      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <!-- <img class="user-logo" src="./../../assets/img/head2.jpg"> -->
          <i class="el-icon-setting"></i>
        </span>
        <el-dropdown-menu class="exit" slot="dropdown">
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        initUsername: '游客登录',
        media: 'PC'
      }
    },
    computed: {
      username () {
        let myUsername = localStorage.getItem('ms_username')   // 对象  没有是为null
        return myUsername !== null ? myUsername : this.initUsername
      }
    },
    methods: {
      handleCommand (command) {
        if (command === 'loginout') {
          localStorage.removeItem('ms_username');
          this.$ajax.get('/logout');
          this.$router.push('/')
        }
      },
      switchMedia (val) {
        this.media = val
        let that = this
        console.log(val)
        that.$ajax.get('/workbench/changeselecttype?type=' + val)
          .then(function(res) {
            that.closeAllTabFunc()
            that.freshTabFunc('Home')
          })
          .catch(function(err) {
              that.$message.error('切换失败！')
          })
      },
      ...mapMutations('navTabs', [   // 下拉框选择所有已打开的标签
          'freshTabFunc'
      ]),
      ...mapMutations('navTabs', [   // 下拉框选择所有已打开的标签
          'closeAllTabFunc'
      ])
    }
  }
</script>
