<template>
  <el-card>
    <!-- 1. 面包屑 -->
    <bread level1="商品管理" level2="商品分类"></bread>
    <!-- 2. 按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addGoodsCategory">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 2.1 添加分类的对话框 -->
    <el-dialog width="600px" title="添加分类" :visible.sync="dialogFormVisibleAddCategory">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <!-- 级联选择器(表单元素) -->
          <el-cascader
            clearable
            v-model="selectedOptions"
            :options="options"
            :props="defaultProps">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddCategory = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 3. 分类表格 -->
    <el-table
      border
      :data="list"
      style="width: 100%">
      <!-- <el-table-column align="center" type="expand" label="分类名称" width="200px">
        <template slot-scope="props">
         
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" prop="cat_name" label="分类名称"></el-table-column> -->
      <!-- 
        treeKey -> nodekey ->节点的唯一标识 id
        parentKey -> 父节点的id
        levelKey -> 当前节点的级别
        childKey -> 当前节点的子节点的key
       -->
      <el-tree-grid
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      >
      </el-tree-grid>
      <el-table-column align="center" label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditCategoryDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle  @click="showDeleteCategoryMsgBox(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑分类的对话框 -->
    <el-dialog width="600px" title="编辑分类" :visible.sync="dialogFormVisibleEditCategory">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditCategory = false">取 消</el-button>
        <el-button type="primary" @click="EditCategory">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入element-tree-grid
import ElTreeGrid from 'element-tree-grid'
import { fetchGoodsCategoriesList, fetchAddCategories, fetchDeleteCategories, fetchEditCategories } from '@/api/goods'
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      // 编辑分类
      dialogFormVisibleEditCategory: false,
      // 添加分类
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      dialogFormVisibleAddCategory: false,
      // 级联选择器绑定数据
      selectedOptions: [],
      options: [],
      // 配置
      defaultProps: {
        // 可以单独选择父节点
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      formLabelWidth: '100px',
      list: [],
      // 分页数据
      currentPage: 1,
      pageSize: 8,
      total: -1,
      
    }
  },
  created() {
    this.getGoodsCategory()
  },
  methods: {
    // 添加分类请求
    async addCategory() {
      // 三种分类请求
      // 1. 增加的是一级分类 this.selectedOptions.length == 0 cat_pid = 0 cat_level= 0
      // 2. 增加的是二级分类 this.selectedOptions.length == 1 cat_pid = this.this.selectedOptions[0] cat_level= 1
      // 3. 增加的是三级分类 this.selectedOptions.length == 2 cat_pid = this.this.selectedOptions[1] cat_level= 2
      //
      if(this.selectedOptions.length === 0) {
        this.form.cat_pid = 0
        this.form.cat_level = 0
      } else if(this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0]
        this.form.cat_level = 1
      } else {
        this.form.cat_pid = this.selectedOptions[1]
        this.form.cat_level = 2
      }
      const res = await fetchAddCategories(this.form)
      this.getGoodsCategory()
      this.dialogFormVisibleAddCategory = false
      this.form = {}
      this.selectedOptions = []
    },
    // 添加分类
    async addGoodsCategory() {
      const res = await fetchGoodsCategoriesList({ type: 2 })
      console.log(res)
      this.options = res.data.data
      this.dialogFormVisibleAddCategory = true
    },
    // 编辑分类
    async EditCategory() {
      const res = await fetchEditCategories(this.form.cat_id, { cat_name: this.form.cat_name })
      this.getGoodsCategory()
      this.dialogFormVisibleEditCategory = false
    },
    // 展示编辑分类的对话框
    showEditCategoryDialog(category) {
      this.form.cat_name = category.cat_name
      this.form.cat_id = category.cat_id
      this.dialogFormVisibleEditCategory = true
    },
    // 展示删除分类的消息
    showDeleteCategoryMsgBox(category) {
      const _self = this
      _self.$confirm(`此操作将永久删除分类：${category.cat_name}，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await fetchDeleteCategories(category.cat_id)
        this.getGoodsCategory()
        if(res.data.meta.status === 200) {
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
    // 更改每页显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodsCategory()
    },
    // 更改当前选择页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodsCategory()
    },
    // 获取分类数据
    async getGoodsCategory() {
      const res = await fetchGoodsCategoriesList({
        type: 3,
        pagenum: this.currentPage,
        pagesize: this.pageSize
      })
      // 向表格赋值
      this.list = res.data.data.result
      this.total = res.data.data.total
    }
  }
}
</script>

<style lang="less">
 .el-card {
   .el-row {
     .el-col {
       .el-button {
         margin-top: 20px;
         margin-bottom: 20px;
       }
     }
   }
   .el-table {
     margin-bottom: 20px;
   }
 }
</style>