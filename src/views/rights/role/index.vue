<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <bread level1="权限管理" level2="角色列表"></bread>
    <!-- 2. 按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 3. 表格 -->
    <el-table
      border
      :data="rolesList"
      style="width: 100%">
       <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item, index) in scope.row.children" :key="index">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag closable>{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row v-for="(item2 ,index2) in item.children" :key="index2">
                <el-col :span="4">
                  <el-tag type="success" closable>{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限: 直接渲染多个el-tag -->
                  <el-tag type="warning" closable v-for="(item3 ,index3) in item2.children" :key="index3">
                    {{item3.authName}}
                  </el-tag>      
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="roleDesc"
        label="角色描述">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditUserMsgBox(scope.row)">
          </el-button>
          <el-button type="danger" icon="el-icon-delete" circle  @click="showDeleteUserMsgBox(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" circle  @click="showSetUserRoleMsgBox(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { fetchUserRoles } from '@/api/users'
export default {
  data() {
    return {
      rolesList: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const res = await fetchUserRoles()
      this.rolesList = res.data.data
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
  .box-card {
    height: 100%;
    .el-row {
      .el-button {
        margin-top: 15px;
        margin-bottom: 15px;
      }
    }
  }
    
</style>