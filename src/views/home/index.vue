<template>
  <div id="home-container">
    <el-container class="home-el-container">
      <el-aside width="200px">
        <el-menu router>
          <el-menu-item>
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-attract"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-s-custom"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-cooperation"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-s-shop"></i>
              <span slot="title">商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-circle-plus"></i>
              <span slot="title">分类参数</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-s-order"></i>
              <span slot="title">商品分类</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">订单列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-marketing"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">数据报表</span>
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
export default {
  methods: {
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
  beforeCreate() {
    // 从本地存储中取出token
    const token = localStorage.getItem('token')
    if(!token) {
      this.$router.push({name: 'Login'})
    }
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
           margin: 20px 200px;
         }
       }
     }
   }
 }
</style>