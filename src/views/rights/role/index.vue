<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <bread level1="权限管理" level2="角色列表"></bread>
    <!-- 2. 按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddRoleMsgBox">添加角色</el-button>
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
              <!-- 角色id和权限id -->
              <el-tag closable @close="deleteRight(scope.row.id, item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row v-for="(item2 ,index2) in item.children" :key="index2">
                <el-col :span="4">
                  <el-tag @close="deleteRight(scope.row.id, item2.id)" type="success" closable>{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限: 直接渲染多个el-tag -->
                  <el-tag @close="deleteRight(scope.row.id, item3.id)" type="warning" closable v-for="(item3 ,index3) in item2.children" :key="index3">
                    {{item3.authName}}
                  </el-tag>      
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">未分配权限</span>
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
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditRoleMsgBox(scope.row)">
          </el-button>
          <el-button type="danger" icon="el-icon-delete" circle  @click="showDeleteRoleMsgBox(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" circle  @click="showSetUserRoleMsgBox(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4. 对话框 -->
    <!-- 4.1. 添加角色对话框 -->
    <el-dialog width="600px" title="添加角色" :visible.sync="dialogFormVisibleAddRole">
      <el-form :model="roleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddRole = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 4.2. 编辑角色对话框 -->
    <el-dialog width="600px" title="编辑角色" :visible.sync="dialogFormVisibleEditRole">
      <el-form :model="roleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditRole">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { fetchUserRoles } from '@/api/users'
import { deleteRoleRight } from '@/api/rights'
import { fetchAddRole, fetchDeleteRole, fetchEditRole } from '@/api/roles'
export default {
  data() {
    return {
      rolesList: [], // 角色列表
      roleForm: { // 添加角色表单数据
        roleName: '',
        roleDesc: ''
      },
      dialogFormVisibleAddRole: false,
      dialogFormVisibleEditRole: false,
      formLabelWidth: '100px'
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 打开添加角色对话框
    showAddRoleMsgBox() {
      this.roleForm = {}
      this.dialogFormVisibleAddRole = true
    },
    // 添加角色
    async addRole() {
      const res = await fetchAddRole(this.roleForm)
      this.dialogFormVisibleAddRole = false
      const { meta: {msg, status } } = res.data
      console.log(res)
      console.log(status)
      if(status === 201) {
        // 创建成功,重新刷新角色列表
        this.getRolesList()
        this.$message({
          type: 'success',
          message: msg
        })
      } else {
        this.$message({
          type: 'warning',
          message: msg
        })
      }
    },
    // 删除角色 - 打开消息盒子
    showDeleteRoleMsgBox(role) {
      const _self = this
      _self.$confirm(`此操作将永久删除角色：${role.roleName}，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await fetchDeleteRole(role.id)
        const { meta: { msg, status } } = res.data
        console.log(res)
        if(status === 200) {
          this.pageNumber = 1
          // 更新视图
          _self.getRolesList()
          _self.$message({
            type: 'success',
            message: msg
          })
        } else {
          _self.$message({
            type: 'warning',
            message: msg
          });
        } 
      }).catch(() => {
        _self.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
    // 打开编辑角色对话框
    showEditRoleMsgBox(role) {
      this.roleForm = role
      this.dialogFormVisibleEditRole = true
    },
    // 取消编辑角色对话框
    cancelEditRole() {
      this.dialogFormVisibleEditRole = false
      this.getRolesList()
    },
    // 编辑角色
    async editRole() {
      const res = await fetchEditRole(this.roleForm.id, this.roleForm)
      const { meta: { msg, status } } = res.data
      this.dialogFormVisibleEditRole = false
      if(status === 200) {
        this.$message({
          type: 'success',
          message: msg
        })
      } else {
        this.$message({
          type: 'warning',
          message: msg
        })
      }
    },
    // 获取角色列表
    async getRolesList() {
      const res = await fetchUserRoles()
      this.rolesList = res.data.data
      console.log(res)
    },
    // 取消权限
    async deleteRight(roleId, rightId) {
      const res = await deleteRoleRight(roleId, rightId)
      if(res.data.meta.status === 200) {
        this.getRolesList() 
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      }
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