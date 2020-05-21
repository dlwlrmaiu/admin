<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <bread level1="商品管理" level2="商品列表"></bread>
    <!-- 2. 搜索框 -->
    <el-row>
      <el-input @clear="searchGoods" placeholder="请输入内容" v-model="query" class="input-with-select" clearable>
        <el-button @click="searchGoods" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button @click="$router.push('/goodsadd')" type="primary">添加商品</el-button>
    </el-row>
    <!-- 3. 商品表格 -->
    <el-table
      :data="goodsList"
      border
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        prop="goods_name"
        width="810"
        label="商品名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="goods_price"
        label="商品价格（元）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        align="center"
        label="创建日期">
        <template slot-scope="scope">
          {{ scope.add_time | formatDate}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="showEditGoodsDialog(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="deleteGoods(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4. 分页 -->
     <el-pagination
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑对话框 -->
    <el-dialog width="600px" title="编辑商品" :visible.sync="dialogFormVisibleEditGoods">
      <el-form :model="goodsForm">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.goods_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditGoods = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { fetchGoodsList, fetchDeleteGoods, fetchGoods, fetchEditGoods } from '@/api/goods'
export default {
  data() {
    return {
      query: '', // 查询参数
      goodsList: [], // 请求返回的商品列表
      pageSizes: [4, 6, 8, 10], // 每页展示多少条数据的选项
      pageSize: 8, // 当前每页展示的数据条数
      currentPage: 1, // 当前选择的页码数
      total: -1, // 数据总数
      goodsForm: { // 对话框中的数据
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: ''
      },
      dialogFormVisibleEditGoods: false,
      formLabelWidth: '100px'
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 编辑商品
    async editGoods() {
      // 先处理一下this.goodsForm.attrs的请求格式
      const tempArray = this.goodsForm.attrs.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_value }
      })
      this.goodsForm.attrs = tempArray
      // 处理完成之后直接发送编辑请求
      const res = await fetchEditGoods(this.goodsForm.goods_id, this.goodsForm)
      const { meta: { status } } = res.data
      this.getGoodsList()
      this.dialogFormVisibleEditGoods = false
      if(status === 200) {
        this.$message({
          type: 'success',
          message: '编辑商品成功'
        })
      }
    },
    // 打开编辑对话框
    async showEditGoodsDialog(goods) {
      // 打开对话框之前先获取该商品信息展示在对话框中
      const res = await fetchGoods(goods.goods_id)
      this.goodsForm = res.data.data
      this.dialogFormVisibleEditGoods = true
    },
    // 删除商品
    deleteGoods(goods) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await fetchDeleteGoods(goods.goods_id)
        const { meta: { status, msg } } = res.data
        this.getGoodsList()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 搜索商品
    searchGoods() {
      this.getGoodsList()
    },
    async getGoodsList() {
      const res = await fetchGoodsList({
        query: this.query,
        pagenum: this.currentPage,
        pagesize: this.pageSize
      })
      const { data: { total, pagenum, goods }, meta: { msg, status } } = res.data
      this.goodsList = goods
      this.total = total
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
    // 每页显示多少条数据改变时触发
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodsList()
    },
    // 页数发生变化时触发
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
  .box-card {
    .input-with-select {
      width: 500px;
      margin-top: 15px;
      margin-right: 1020px;
      margin-bottom: 15px;
    }
    .el-table {
      margin-bottom: 15px;
    }
  }
</style>