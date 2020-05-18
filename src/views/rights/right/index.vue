<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <bread level1="权限管理" level2="权限列表"></bread>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->

    <!-- 表格 -->
    <el-table
      :data="rightsList"
      height="700"
      stripe
      border
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="#"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        prop="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        align="center"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { fetchRightsList } from '@/api/rights'
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      // 获取权限列表 
      // 传入list时获取表格数据
      const res = await fetchRightsList('list')
      this.rightsList = res.data.data
    }
  }
}
</script>

<style lang="less" scoped>
  .box-card {
    height: 100%;
    .el-table {
      margin-top: 15px;
    }
  }
</style>