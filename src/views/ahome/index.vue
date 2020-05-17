<template>
  <div id="home-container">
    <el-container class="home-el-container">
      <el-header height="80px">
        <el-row>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <i class="el-icon-s-home"></i>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple">
              <h3 class="header-title">dlwlrma电商后台管理系统</h3>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple-light">
              <el-button class="login-out" type="primary">退出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="aside-main-container">
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
              <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
 #home-container {
   height: 100%;
   .home-el-container {
     height: 100%;
     .el-header {
       height: 200px;
       background-color: #304156;
       .el-icon-s-home {
         color: #fff;
         font-size: 40px;
         line-height: 80px;
         text-align: center;
       }
       .header-title {
         color: #fff;
         text-align: center;
         margin: 0;
         padding: 0;
         line-height: 80px;
         font-size: 30px;
       }
       .login-out {
         margin: 20px 30px;
       }
     }
     .aside-main-container {
       .el-main {
         background-color: #E9EEF3;
       }
     }
   }
 }
</style>