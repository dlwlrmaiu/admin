<template>
  <el-card>
    <!-- 1. 面包屑 -->
    <bread level1="商品管理" level2="分类参数"></bread>
    <!-- 2. 提示信息 -->
    <el-alert
      title="只允许为第三级分类设置参数"
      type="warning">
    </el-alert>
    <!-- 3. 级联选择器 -->
    <el-form>
      <el-form-item label="商品名称">
        <el-cascader
        clearable
        :show-all-levels="false"
        v-model="selectedOptions"
        :options="options"
        :props="defaultProps"
        @change="handleChange"></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 4. 标签页 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="primary" @click="showDynamicParamsDialog">设置动态参数</el-button>
        <el-table
          :data="dynamicParams">
          <el-table-column type="expand" label="#" align="center">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="属性名称"
            width="300px"
            prop="attr_name">
          </el-table-column>
          <el-table-column
            align="center"
            width="300px"
            label="操作">
            <template slot-scope="scope">  
              <el-button @click="showDynamicEditMsgBox(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button @click="showDeleteMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="primary" @click="showStaticParamsDialog">设置静态参数</el-button>
        <el-table
          :data="staticParams">
          <el-table-column 
            label="#" 
            align="center" 
            type="index">
          </el-table-column>
          <el-table-column
            align="center"
            label="属性名称"
            width="300px"
            prop="attr_name">
          </el-table-column>
          <el-table-column
            align="center"
            label="属性值"
            width="300px"
            prop="attr_vals">
          </el-table-column>
          <el-table-column
            align="center"
            width="300px"
            label="操作">
            <template slot-scope="scope">  
              <el-button @click="showEditStaticMsgBox(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button @click="showDeleteMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 1. 添加静态属性的对话框 -->
     <el-dialog width="600px" title="添加属性" :visible.sync="dialogFormVisibleAddAttributes">
      <el-form :model="formStaticParams">
        <el-form-item label="参数名称" :label-width="formLabelWidth">
          <el-input v-model="formStaticParams.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数" :label-width="formLabelWidth">
          <el-input disabled v-model="formStaticParams.attr_sel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数值" :label-width="formLabelWidth">
          <el-input v-model="formStaticParams.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddAttributes = false">取 消</el-button>
        <el-button type="primary" @click="addAttributes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 2. 添加动态属性的对话框 -->
     <el-dialog width="600px" title="添加属性" :visible.sync="dialogFormVisibleAddDAttributes">
      <el-form :model="formDynamicParams">
        <el-form-item label="属性名称" :label-width="formLabelWidth">
          <el-input v-model="formDynamicParams.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动态参数" :label-width="formLabelWidth">
          <el-input disabled v-model="formDynamicParams.attr_sel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数值" :label-width="formLabelWidth">
          <el-input v-model="formDynamicParams.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddDAttributes = false">取 消</el-button>
        <el-button type="primary" @click="addDynamicAttributes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 3. 编辑动态属性的对话框 -->
     <el-dialog width="600px" title="编辑属性" :visible.sync="dialogFormVisibleEditDAttributes">
      <el-form :model="formEditDynamicParams">
        <el-form-item label="属性名称" :label-width="formLabelWidth">
          <el-input v-model="formEditDynamicParams.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动态参数" :label-width="formLabelWidth">
          <el-input disabled v-model="formEditDynamicParams.attr_sel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数值" :label-width="formLabelWidth">
          <el-input v-model="formEditDynamicParams.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditDAttributes = false">取 消</el-button>
        <el-button type="primary" @click="editDynamicAttributes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 4. 编辑静态属性的对话框 -->
     <el-dialog width="600px" title="编辑属性" :visible.sync="dialogFormVisibleEditAttributes">
      <el-form :model="formEditStaticParams">
        <el-form-item label="参数名称" :label-width="formLabelWidth">
          <el-input v-model="formEditStaticParams.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数" :label-width="formLabelWidth">
          <el-input disabled v-model="formEditStaticParams.attr_sel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数值" :label-width="formLabelWidth">
          <el-input v-model="formEditStaticParams.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditAttributes = false">取 消</el-button>
        <el-button type="primary" @click="editStaticAttributes">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { 
  fetchGoodsCategoriesList, 
  fetchGoodsAttributes, 
  fetchMoveOrAddSingleAttribute,
  fetchDeleteAttribute,
  fetchAddAttribute,
  fetchEditAttribute
} from '@/api/goods'
export default {
  data() {
    return {
       // 级联选择器绑定数据
      selectedOptions: [],
      options: [],
      // 配置
      defaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: '1',
      dynamicParams: [], // 动态参数
      staticParams: [], //静态参数
      inputVisible: false,
      inputValue: '',
      // 添加静态属性对话框绑定数据
      dialogFormVisibleAddAttributes: false,
      formStaticParams: {
        attr_name: '',
        attr_sel: 'only',
        attr_vals: ''
      },
      // 添加动态属性对话框绑定数据
      dialogFormVisibleAddDAttributes: false,
      formDynamicParams: {
        attr_name: '',
        attr_sel: 'many',
        attr_vals: ''
      },
      // 编辑动态属性对话框绑定数据
      dialogFormVisibleEditDAttributes: false,
      formEditDynamicParams: {},
      // 编辑静态属性对话框绑定数据
      dialogFormVisibleEditAttributes: false,
      formEditStaticParams: {},
      formLabelWidth: '100px'
    }
  },
  created() {
    this.getGoodsCategories()
  },
  methods: {
    // 编辑静态参数
    async editStaticAttributes() {
      // 更新静态参数请求
      const res = await fetchMoveOrAddSingleAttribute(this.selectedOptions[2], this.formEditStaticParams.attr_id, {
        attr_name: this.formEditStaticParams.attr_name,
        attr_sel: this.formEditStaticParams.attr_sel,
        attr_vals: this.formEditStaticParams.attr_vals
      })
      // 刷新视图
      this.handleClick()
      this.dialogFormVisibleEditAttributes = false
    },
    // 展示编辑静态参数的对话框
    async showEditStaticMsgBox(attr) {
      const res = await fetchEditAttribute(this.selectedOptions[2], attr.attr_id, {
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals
      })
      this.formEditStaticParams = res.data.data
      this.dialogFormVisibleEditAttributes = true
    },
    // 编辑动态参数
    async editDynamicAttributes() {
      const res = await fetchMoveOrAddSingleAttribute(this.selectedOptions[2], this.formEditDynamicParams.attr_id, {
        attr_name: this.formEditDynamicParams.attr_name,
        attr_sel: this.formEditDynamicParams.attr_sel,
        attr_vals: this.formEditDynamicParams.attr_vals
      })
      this.handleChange()
      this.dialogFormVisibleEditDAttributes = false
    },
    // 展示编辑动态参数的对话框
    async showDynamicEditMsgBox(attr) {
      const res = await fetchEditAttribute(this.selectedOptions[2], attr.attr_id, {
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(',')
      })
      this.formEditDynamicParams = res.data.data
      this.dialogFormVisibleEditDAttributes = true
    },  
    // 添加动态参数
    async addDynamicAttributes() {
      this.dialogFormVisibleAddDAttributes = false
      const res = await fetchAddAttribute(this.selectedOptions[2], this.formDynamicParams)  
      this.handleChange()  
    },
    // 展示动态参数设置框
    showDynamicParamsDialog() {
      this.dialogFormVisibleAddDAttributes = true
    },
    // 添加静态参数
    async addAttributes() {
      this.dialogFormVisibleAddAttributes = false
      const res = await fetchAddAttribute(this.selectedOptions[2], this.formStaticParams)    
      this.handleClick()
    },
    // 设置静态参数
    showStaticParamsDialog() {
      this.dialogFormVisibleAddAttributes = true
    },
    // 展示删除静态或者动态属性msgBox
    showDeleteMsgBox(attr) {
      const _self = this
      _self.$confirm(`此操作将永久删除属性：${attr.attr_name}，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await fetchDeleteAttribute(this.selectedOptions[2], attr.attr_id)
        console.log(res)
        if(attr.attr_sel === 'only') {
          this.handleClick()
        } else {
          this.handleChange()
        }
        if(res.data.meta.status === 200) {
          // 更新视图
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
    // el-tag点击x时触发
    async handleClose(attr, tag) {
      // 视图上的更新 减少el-tag
      attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1)
      // 真正的更新发送网络请求 减少el-tag
      // 参数:
      // 1. 分类id
      // 2. 属性id
      // 3. 请求体对象
      const res = await fetchMoveOrAddSingleAttribute(this.selectedOptions[2],attr.attr_id,{
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(',')
      })
    },
    // 点击 +new tag时触发
    showInput() {
      // 改变为input框
      this.inputVisible = true;
      this.$nextTick(_ => {
        // 获取焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 在input中按下enter键或者该input失去焦点时触发
    async handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      // 在input中输入有值时发送更新数据
      if (inputValue) {
        attr.attr_vals.push(inputValue)
        // 发送网络请求
        const res = await fetchMoveOrAddSingleAttribute(this.selectedOptions[2],attr.attr_id,{
          attr_name: attr.attr_name,
          attr_sel: 'many',
          attr_vals: attr.attr_vals.join(',')
        })
      }
      // 视图上的更新
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 获取商品三级分类数据
    async getGoodsCategories() {
      const res = await fetchGoodsCategoriesList({type: 3})
      this.options = res.data.data
    },
    // 级联选择器改变选择时触发
    async handleChange() {
      if(this.selectedOptions.length !== 3) {
        this.$message({
          type: 'warning',
          message: '请先选择三级分类'
        })
        return 
      } else {
        // 获取动态参数
        const res = await fetchGoodsAttributes(this.selectedOptions[2], { sel: 'many' })
        this.dynamicParams = res.data.data
        // 设置attr_vals属性变为数组
        this.dynamicParams.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })
      }
    },
    // 点击标签页时触发
    async handleClick() {
      if(this.activeName === '2') {
        if(this.selectedOptions.length === 3) {
          const res = await fetchGoodsAttributes(this.selectedOptions[2], { sel: 'only' })
          this.staticParams = res.data.data
        }
      }
    }
  }
}
</script>

<style lang="less">
  .el-alert {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>