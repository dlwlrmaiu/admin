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
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
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
  </el-card>
</template>

<script>
import { fetchGoodsList, fetchDeleteGoods } from '@/api/goods'
export default {
  data() {
    return {
      query: '', // 查询参数
      goodsList: [], // 请求返回的商品列表
      pageSizes: [4, 6, 8, 10], // 每页展示多少条数据的选项
      pageSize: 8, // 当前每页展示的数据条数
      currentPage: 1, // 当前选择的页码数
      total: -1, // 数据总数
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
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