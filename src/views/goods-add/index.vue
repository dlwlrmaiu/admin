<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <bread level1="商品管理" level2="商品列表"></bread>
    <!-- 2. 提示信息 -->
    <el-alert
      title="添加商品信息"
      type="success"
      center
      show-icon>
    </el-alert>
    <!-- 3. 步骤条 -->
    <el-steps :active="1*active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 4. 表单 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs @tab-click="tabChange" tab-position="left" v-model="active">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
            clearable
            v-model="selectedOptions"
            :options="options"
            :props="defaultProps"
            @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <!-- 该三级分类的商品参数 -->
          <el-form-item :label="item.attr_name" v-for="(item, index) in dynamicParams" :key="index">
            <el-checkbox-group v-model="item.attr_vals" size="small">
              <el-checkbox 
                v-for="(item2 ,index2) in item.attr_vals" 
                :key="index2" :label="item2" border size="medium">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <!-- 商品的静态参数 -->
          <el-form-item :label="item3.attr_name" v-for="(item3, index3) in staticParams" :key="index3">
            <el-input v-model="item3.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item>
            <!-- 上传图片 -->
            <!-- 
              1. action: 全路径
              2. headers: 头部
              3. :on-remove="handleRemove" 移除触发
              4. :on-preview="handlePreview" 上传成功后预览触发
              5. :on-success: 上传成功时回调的钩子函数
              5. list-stype 上传的文件类型
             -->
             <!-- 原来的baseURL是axios发的请求,而图片上传中是由指定的action发起的请求需要全路径,headers也需要重新设置 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <el-button @click="addGoods" type="primary">添加商品</el-button>
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { fetchGoodsCategoriesList, fetchGoodsAttributes, fetchAddGoods } from '@/api/goods'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: '1', // 步骤条和标签页
      form: { // 添加商品的表单数据
        goods_name: '', // 商品名称 不能为空
        goods_price: '', // 商品价格 不能为空
        goods_weight: '', // 商品重量 不能为空
        goods_number: '', // 商品数量 不能为空
        goods_cat: '', // 以','分割的分类列表 不能为空 -> 级联选择器绑定的selectedOptions
        goods_introduce: '', // 商品介绍 可以为空
        pics:[], // 上传的图片临时路径(对象) 可以为空  [{pic: 图片临时路径}]
        attrs:[] // 商品的参数(数组) 静态参数和动态参数
      },
      // 级联选择器绑定数据
      options: [],
      // 最终选择的label对应的value值会在selectedOptions中,可以先设置一个默认值
      selectedOptions: [1, 3, 6],
      // props默认配置 { label: 'label', value: 'value', children: 'children' }
      defaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      dynamicParams: [], // 动态参数
      staticParams: [], //静态参数
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created() {
    this.getGoodsCategoris()
  },
  methods: {
    // 添加商品
    async addGoods() {
      console.log(this.dynamicParams)
      console.log(this.staticParams)
      // 需要先把this.form中未绑定的数据重新处理
      this.form.goods_cat = this.selectedOptions.join(',')
      // 处理动态参数
      let handleDynamicParamsArr = this.dynamicParams.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }
      })
      // 处理静态参数
      let handleStaticParamsArr = this.staticParams.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      })
      this.form.attrs = [...handleDynamicParamsArr, ...handleStaticParamsArr]
      const res = await fetchAddGoods(this.form)
      const { meta: { msg, status } } = res.data
      this.$router.push('/goods')
      if(status === 201) {
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
    // 图片上传成功时触发
    // file时当前操作的图片的相关信息(图片名,路径等)
    handleSuccess(file) {
      // file.data.tmp_path 图片临时上传的路径
      this.form.pics.push({pic: file.data.tmp_path})
    },
    // 图片上传成功后预览时触发
    handlePreview(file) {
      //console.log('预览', file);
    },
    // 图片上传成功后移除图片时触发
    handleRemove(file) {
      // file.response.data.tmp_path 图片临时上传的路径
      // 从this.form.pics中移除保存该临时路径的对象
      // arr.findIndex(()=>{})  遍历数组,把符合条件的元素的索引返回
      let index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      // 先得到该路径对象在数组中的下标,之后再根据下标移除数组中的该临时路径对象
      this.form.pics.splice(index,1)
    },
    // 点击不同的tag时触发该方法
    async tabChange() {
      // 点击的是第二个tag并且三级分类要有值
      if(this.active === '2') {
        if(this.selectedOptions.length !== 3) {
          this.message()
        } else {
          // 传入该三级分类的cat_id, sel属性值中 only代表静态参数 many代表动态参数
          const res = await fetchGoodsAttributes(this.selectedOptions[2], {sel: 'many'})
          // attr_name和attr_val
          this.dynamicParams = res.data.data
          this.dynamicParams.forEach(item => {
            // 处理attr_vals
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          })
        }
      } else if(this.active === '3') { // 商品属性
        if(this.selectedOptions.length !== 3) {
          this.message()
        } else {
          const res = await fetchGoodsAttributes(this.selectedOptions[2], {sel: 'only'})
          this.staticParams = res.data.data
          console.log(res)
        } 
      }
    },
    // 级联选择器改变时触发的方法
    handleChange() {

    },
    // 获取三级分类的信息
    async getGoodsCategoris() {
      const res = await fetchGoodsCategoriesList({type: 3})
      this.options = res.data.data
      console.log(res)
    },
    message() {
      // 提示
      this.$message({
        type: 'warning',
        message: '请先选择商品的三级分类'
      })
      return
    }
  }
}
</script>

<style lang="less">
  .box-card {
    .el-alert {
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .el-steps {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .quill-editor {
      margin-top: 20px;
      .ql-editor {
        min-height: 400px;
      }
    }
  }
  
</style>
