<template>
  <div id="home-container">
    <el-container class="home-el-container">
      <el-aside width="200px">
        <el-menu router>
          <el-menu-item>
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu :index="''+item.order" v-for="(item, index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2, index2) in item.children" :key="index2">
              <i class="el-icon-user-solid"></i>
              <span slot="title">{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="header-main-container">
        <el-header height="80px">
          <el-row>
            <el-col :span="20">
              <div class="grid-content bg-purple">
                <h3 class="header-title">dlwlrma电商后台管理系统</h3>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple-light">
                <el-button @click="loginOut" class="login-out" type="primary">退出</el-button>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { fetchMenus } from '@/api/rights';
export default {
  data() {
    return {
      menus: []
    }
  },
  methods: {
    // 获取导航数据
    async getMenus() {
      const res = await fetchMenus()
      // 不同角色登录显示对应权限
      this.menus = res.data.data
    },
    loginOut() {
      // 退出
      // 清除token
      localStorage.clear()
      // 提示
      this.$message.success('退出成功')
      // 跳转到登录页
      this.$router.push('/login')
    }
  },
  // 进入首页组件渲染之前判断是否有token,没有调回登录页
  // beforeCreate() {
  //   // 从本地存储中取出token
  //   const token = localStorage.getItem('token')
  //   if(!token) {
  //     this.$router.push({name: 'Login'})
  //   }
  // },
  created() {
    this.getMenus()
  }
}
</script>

<style lang="less" scoped>
 #home-container {
   height: 100%;
   .home-el-container {
     height: 100%;
     .el-menu {
       height: 100%;
     }
     .header-main-container {
       .el-header {
         background-color: #304156;
         color: #fff;
         .header-title {
           margin: 0;
           padding: 0;
           text-align: center;
           line-height: 80px;
         }
         .login-out {
           margin: 20px 0px 20px 200px;
         }
       }
     }
   }
 }
</style>