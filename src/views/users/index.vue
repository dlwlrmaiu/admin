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
        <el-input placeholder="请输入内容" v-model="query" class="input-query" clearable @clear=loadUsersList>
          <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="dialogFormVisibleAddUser = true" class="add-user" type="primary">添加用户</el-button>
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
          <el-button type="danger" icon="el-icon-delete" circle  @click="showDeleteUserMsgBox(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4. 分页 -->
    <!-- 需要接口支持分页 -->
    <!-- 
      @size-change 每页显示条数发生变化时触发
      @current-change 当前页改变时触发
      current-page 设置当前页是第几页
      page-sizes=[2,4,6,8] 每页多少条数据组
      page-size 设置显示多少条
      total 数据总数
     -->
    <el-pagination
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      
    </el-pagination>

    <!-- 对话框 -->
    <!-- 1. 添加用户的对话框 -->
    <el-dialog width="600px" title="添加用户" :visible.sync="dialogFormVisibleAddUser">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { fetchUsersList, fetchAddUser,deleteUser } from '@/api/users'
export default {
  data() {
    return {
      query: '', // 查询参数
      pageNumber: 1, // 页码
      pageSize: 4, // 每页显示条数
      usersList: [], // 表格绑定的用户数据
      total: 0, // 总数
      // 添加对话框的属性
      dialogFormVisibleAddUser: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '100px',
    }
  },
  created() {
    this.getUsersList()  
  },
  methods: {
    // 搜索用户
    searchUser() {
      this.getUsersList()
    },
    // 搜索框点x重新渲染用户
    loadUsersList() {
      this.getUsersList()
    },
    // 添加用户
    async addUser() {
      const _self = this
      _self.dialogFormVisibleAddUser = false
      const res = await fetchAddUser(this.form)
      const {
        meta: {
          status,
          msg
        },
        data
      } = res.data
      if(status === 201) {
        //1. 提示成功
        _self.$message.success(msg)
        // 2. 关闭对话框
        // 3. 更新视图
        _self.getUsersList()
        // 4. 清空文本框
        _self.form = {}
      } else {
        _self.$message.warning(msg)
      }
    },
    // 删除用户 - 打开消息盒子
    showDeleteUserMsgBox(userId) {
      const _self = this
      _self.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteUser(userId)
        console.log(res)
        if(res.data.meta.status === 200) {
          this.pageNumber = 1
          // 更新视图
          _self.getUsersList()
          _self.$message({
            type: 'success',
            message: res.data.meta.msg
          })
        } else {
          _self.$message({
            type: 'warning',
            message: res.data.meta.msg
          });
        } 
      }).catch(() => {
        _self.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
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
        _self.$message.success(msg)
        // console.log(this.usersList)
      } else {
        _self.$message.warning('获取用户数据失败')
      }
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      // val为点击时每页显示的条数
      this.pageSize = val
      // 每页显示条数发生改变时, 设置重新从第一页获取数据
      this.pageNumber = 1
      this.getUsersList()
    },
     // 当前页数发生改变时
    handleCurrentChange(val) {
      // val为点击时的页码
      this.pageNumber = val
      this.getUsersList()
    }

  }
  
}
</script>

<style lang="less" scoped>
  .box-card {
    height: 100%;
    .input-query {
      margin: 15px 940px 15px 0px;
      width: 600px;
    }
    .el-pagination {
      margin-top: 15px;
    }
  }
</style>
