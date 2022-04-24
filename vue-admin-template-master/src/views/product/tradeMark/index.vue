<template>
  <div>
    <el-button icon="el-icon-plus" type="primary" style="margin: 10px 0px" @click="AddTradeMark">添加</el-button>

    <!--
     表格组件
     data:表格组件将来需要展示的数据------数组类型
     border：是给表格添加边框
     column属性
     label：显示标题
     width：对应列的宽度
     align：标题的对齐方式
     prop:对应列内容的字段名
     注意1：elementUI当中的table组件，展示的数据是以一列一列进行展示数据
   -->
    <el-table style="width: 100%" border :data="data">
      <el-table-column
        align="center"
        label="序号"
        width="80px"
        type="index"
      />
      <el-table-column
        label="品牌名称"
        prop="tmName"
      />
      <el-table-column
        align="center"
        label="品牌logo"
        prop="logoUrl"
      >
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" width="100px" height="100px">
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        prop="prop"
        align="right"
      >
        <template slot-scope="{row,$index}">
          <el-button
            size="mini"
            type="warning"
            round
            icon="el-icon-edit"
            @click="updateTradeMark(row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            round
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
  分页器
  当前第几页、数据总条数、每一页展示条数、连续页码数
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
  current-page:代表的是当前第几页
  total：代表分页器一共需要展示数据条数
  page-size：代表的是每一页需要展示多少条数据
  page-sizes：代表可以设置每一页展示多少条数据
  layout：可以实现分页器布局
  pager-count:按钮的数量  如果 9  连续页码是7

-->
    <el-pagination
      style="margin-top: 30px"
      align="center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[1,3,5]"
      :pager-count="7"
      layout=" prev, pager, next, jumper, ->, total, sizes"
      :total=total
      @current-change="handlerCurrentChange"
      @size-change="handlerSizeChange"
    />
    <!--
    对话框
    :visible.sync:控制对话框显示与隐藏用的
    Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
  -->
    <el-dialog :title="tmForm.id? '修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单 :model属性，这个属性的作用是,把表单的数据收集到那个对象的身上 ，将来表单验证，也需要这个属性-->
      <el-form style="width: 60%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <!--这里收集数据：不能使用v-model，因为不是表单元素
            action:设置图片上传的地址
            :on-success:可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload：可以在上传图片之前，会执行一次-->
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddOrUpload" >取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark('ruleForm')" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  mounted() {
    this.getPageList()
  },
  data() {
    return {
      //代表的分页器第几页
      page: 2,
      //当前页数展示数据条数
      limit: 5,
      //总共数据条数
      total: 0,
      //列表展示的数据
      data: [],
      //对话框显示与隐藏
      dialogFormVisible: false,
      formLabelWidth: '120px',
      tmForm:{
        tmName:'',
        logoUrl:''
      },
      //表单验证规则
      rules:{
        tmName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传正确的品牌图片' }
        ],
      },
    }
  },
  methods: {
    //获取品牌列表数据
    async getPageList() {
      const {page, limit} = this
      let result = await this.$API.trademark.reqGetTradeMarkPage(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.data = result.data.records
      }
    },
    handlerCurrentChange(pager) {
      this.page = pager
      this.getPageList()
    },
    handlerSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    AddTradeMark() {
      this.dialogFormVisible = !this.dialogFormVisible
      this.tmForm = {tmName: '',logoUrl: ''}
    },
    //上传图片的回调
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
     addOrUpdateTradeMark(formName){
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          let result = await this.$API.trademark.reqAddOrUpDateTradeMark(this.tmForm)
          if(result.code == 200){
            this.$message({
              message:this.tmForm.id? '修改品牌成功':'添加品牌成功',
              type:"success"
            })
            //添加或者修改品牌成功以后，需要再次获取品牌列表进行展示
            //如果添加品牌： 停留在第一页，修改品牌应该留在当前页面
            this.getPageList(this.tmForm.id? this.page:1)
          }else {
            this.$message({
              message:'请求失败',
              type:"error"
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    cancelAddOrUpload(){
        this.dialogFormVisible = false
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '<p style="font-size:48px">&#128517;</p>',

          type:"error",
          center:true,
          showClose:true
        });

    },
    updateTradeMark(row){
      //row：当前用户选中这个品牌信息
      //将已有的品牌信息赋值给tmForm进行展示
      //将服务器返回品牌的信息，直接赋值给了tmForm进行展示。
      //也就是tmForm存储即为服务器返回品牌信息
      this.dialogFormVisible = !this.dialogFormVisible
      //this.tmForm = {...row}浅拷贝，不能直接操作数据
      this.tmForm = {...row}
    },
    deleteTradeMark(row){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = row.id
        this.$API.trademark.reqDelTradeMark(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getPageList(this.page)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    }

  }
}
</script>

<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
