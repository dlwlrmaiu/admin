<template>
  <div id="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="fromData">
      <h2>登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="fromData.username"></el-input>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input v-model="fromData.password"></el-input>
      </el-form-item>
      <el-button type="primary" @click.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { fetchLogin } from '@/api/login'
export default {
  data() {
    return {
      fromData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      const vm = this
      const res = await fetchLogin(this.fromData)
      // 根据状态码处理对应的情况
      if(res.data.meta.status === 200) {
        vm.$message({
          message: `${res.data.meta.msg}，欢迎 ${res.data.data.username}`,
          type: 'success'
        })
        vm.$router.push('/home')
      } else {
        vm.$message({
          message: `${res.data.meta.msg}，请重新登录`,
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
 #login-wrap {
   background-color: #951218;
   height: 100%;
   .login-form {
      background-color: #fff;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 500px;
      height: 500px;
      margin: auto;
      padding: 50px 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      box-shadow: 1px 1px 1px #ccc;
    }
 }
</style>

