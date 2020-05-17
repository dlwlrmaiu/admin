<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2. 搜索 -->
    <el-row width="500px">
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="input-query">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary">搜索</el-button>
      </el-col>
    </el-row>
    <!-- 3. 表格 -->
    <el-table
      border
      :data="usersList"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        align="center"
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        align="center"
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间">
        <!-- 如果单元格内显示的内容不是字符串文本,需要给被显示的内容外层包裹一个template -->
        <!-- 
          template内部要使用数据 设置slot--scope属性
          该属性的值时要用数据create_time的源头usersList
          usersList.row => 数组中的每个对象
          scope由上一级自动传过来
         -->
        <template slot-scope="scope">
          {{scope.row.create_time | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
          <el-button type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4. 分页 -->
  </el-card>
</template>

<script>
import { fetchUsersList } from '@/api/users'
export default {
  data() {
    return {
      query: '', // 查询参数
      pageNumber: 1, // 页码
      pageSize: 2, // 每页显示条数
      usersList: [], // 表格绑定的用户数据
      total: 0 // 总数
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表的请求
    async getUsersList() {
      const _self = this
      // get请求 params 拼接
      // query 查询参数 可以为空
      // pagenum 当前页码 不可以为空
      // pagesize 每页显示条数 不可以为空

      // 需要授权的API, 必须在请求头中使用 Authorization 字段提供 token令牌
      const res = await fetchUsersList({
        query: this.query,
        pagenum: this.pageNumber,
        pagesize: this.pageSize
      })
      console.log(res)
      const { 
        data: {
          total,
          users
        }, 
        meta: { 
          msg, 
          status} 
        } = res.data
        if(status === 200) {
          _self.usersList = users
          _self.total = total
          this.$message.success(msg)
        } else {
          this.$message.warning('获取用户数据失败')
        }
      
    }
  }
}
</script>

<style lang="less" scoped>
  .box-card {
    height: 100%;
    .input-query {
      margin: 15px 15px 15px 0px;
      width: 600px;
    }
  }
</style>
