<template>
  <el-card>
    <!-- 1. 面包屑 -->
    <bread level1="订单管理" level2="订单列表"></bread>
    <!-- 2. 表格 -->
    <el-table border :data="ordersList" style="width: 100%">
      <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
      <el-table-column align="center" prop="order_number" label="订单编号" width="300"></el-table-column>
      <el-table-column align="center" prop="order_price" label="订单价格"></el-table-column>
      <el-table-column align="center" prop="order_pay" label="订单编号"></el-table-column>
      <el-table-column align="center" label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.order_pay === '1'">未付款</el-tag>
        </template>
        
      </el-table-column>
      <el-table-column align="center" prop="is_send" label="是否发货"></el-table-column>
      <el-table-column align="center" label="下单时间" width="180">
        <template slot-scope="scope">{{ scope.create_time | formatDate }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditOrderDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 3. 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 4. 编辑对话框 -->
    <el-dialog width="600px" title="修改订单地址" :visible.sync="dialogFormVisibleEditOrder">
      <el-form :model="form">
        <el-form-item label="省市区" :label-width="formLabelWidth">
          <!-- 级联选择器(表单元素) -->
          <el-cascader
            clearable
            v-model="selectedOptions"
            :options="citylist"
            :props="defaultProps">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditOrder = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleEditOrder = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import cityList from '@/assets/city-data'
// swiper.js zepto.js iscroll.js wow.js
import { fetchOrders } from '@/api/orders'
export default {
  data() {
    return {
      ordersList: [],
      dialogFormVisibleEditOrder: false,
      formLabelWidth: '100px',
      // 级联选择器绑定的数据
      selectedOptions: [],
      citylist: [],
      // 配置  由于cityList是 children label value 所以可以省略
      defaultProps: {
        // 可以单独选择父节点
        // checkStrictly: true,
        expandTrigger: 'hover'
      },
      form: {
        address: ''
      },
      // 分页数据
      currentPage: 1,
      pageSize: 8,
      total: -1,
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    // 展示编辑订单对话框
    showEditOrderDialog() {
      this.citylist = cityList
      this.dialogFormVisibleEditOrder = true
    },
    // 更改每页显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.getOrders()
    },
    // 更改当前选择页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getOrders()
    },
    async getOrders() {
      // 获取分页数据
      const res = await fetchOrders({
        pagenum: this.currentPage,
        pagesize: this.pageSize
      })
      this.ordersList = res.data.data.goods
      this.total = res.data.data.total
    }
  }
}
</script>

<style lang="less" scoped>
  .el-card {
    .el-table {
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
</style>
