<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <bread level1="权限管理" level2="角色列表"></bread>
    <!-- 2. 按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
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
              <el-tag closable @close="deleteRight(scope.row, item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row v-for="(item2 ,index2) in item.children" :key="index2">
                <el-col :span="4">
                  <el-tag @close="deleteRight(scope.row, item2.id)" type="success" closable>{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限: 直接渲染多个el-tag -->
                  <el-tag @close="deleteRight(scope.row, item3.id)" type="warning" closable v-for="(item3 ,index3) in item2.children" :key="index3">
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
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditRoleDialog(scope.row)">
          </el-button>
          <el-button type="danger" icon="el-icon-delete" circle  @click="showDeleteRoleMsgBox(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" circle  @click="showSetRightsDialog(scope.row)"></el-button>
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
    <!-- 4.3. 修改权限的对话框 -->
    <el-dialog title="修改权限" width="600px" :visible.sync="dialogFormVisibleRight">
      <!-- 树形结构 -->
      <!-- 
        data -> 数据源
        show-checkbox -> 展示选择框
        node-key 每个节点的唯一标识,通常是data数据源中的key名id
        default-expand-all 展开所有节点
        default-expanded-keys 默认展开 [要展开的节点的id]
        default-checked-keys [要选择的节点的id]
        props 配置项 { label, children }
          label:节点的文字标题 children:节点的子节点
          值都来源于data绑定的数据源中的该数据的key名 'label' 'children'
       -->
      <el-tree
        ref="tree"
        :data="treeRightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="rightsIdArray"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { fetchUserRoles } from '@/api/users'
import { fetchRightsList, deleteRoleRight } from '@/api/rights'
import { fetchAddRole, fetchDeleteRole, fetchEditRole, fetchModifyRoleRights } from '@/api/roles'
export default {
  data() {
    return {
      rolesList: [], // 角色列表
      roleForm: { // 添加角色表单数据
        roleName: '',
        roleDesc: ''
      },
      currentRoleId: -1, // 修改权限时当前角色id
      dialogFormVisibleAddRole: false,
      dialogFormVisibleEditRole: false,
      dialogFormVisibleRight: false,
      formLabelWidth: '100px',
      treeRightsList: [], // 树形权限数据
      //expandArray: [], // 默认展开的节点id
      rightsIdArray: [], // 当前角色的权限id
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 修改/分配 角色的权限 -> 打开该对话框
    async showSetRightsDialog(role) {
      // 保存当前角色的id
      this.currentRoleId = role.id
      // 获取树形结构的权限数据
      const res = await fetchRightsList('tree')
      this.treeRightsList = res.data.data
      let tempArray = [] // 临时数组保存角色的权限id
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            tempArray.push(item3.id)
          })
        })
      })
      this.rightsIdArray = tempArray
      // console.log(res)
      this.dialogFormVisibleRight = true
    },
    // 修改权限 发送请求
    async setRoleRight() {
      // roles/:roleId/rights
      // roleId 当前要修改权限的角色id
      // rids 树形节点中 所有全选和半选的label的id []
      // el-tree中 获取全选的id的数组方法  getCheckedKeys    
      let tempArray1 = this.$refs.tree.getCheckedKeys()
      // el-tree中 获取半选的id的数组方法  getHalfCheckedKeys
      let tempArray2 = this.$refs.tree.getHalfCheckedKeys()
      let tempArray3 = [...tempArray1, ...tempArray2]
      const res = await fetchModifyRoleRights(this.currentRoleId, { rids: tempArray3.join(',') })
      this.getRolesList()
      this.dialogFormVisibleRight = false
      const { meta: { msg, status } } = res.data
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
    // 打开添加角色对话框
    showAddRoleDialog() {
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
    showEditRoleDialog(role) {
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
    async deleteRight(role, rightId) {
      // roleId 当前角色Id
      // rightId 要删除的权限id
      const res = await deleteRoleRight(role.id, rightId)
      const { data, meta: { msg, status } } = res.data
      if(status === 200) {
        // 删除成功之后,更新当前角色的children
        role.children = data
        this.$message({
          type: 'success',
          message: msg
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