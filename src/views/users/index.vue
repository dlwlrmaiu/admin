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
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="address"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="address"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="address"
        label="用户状态">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
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
      query: '',
      pageNumber: 1,
      pageSize: 2,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表的请求
    async getUsersList() {
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
