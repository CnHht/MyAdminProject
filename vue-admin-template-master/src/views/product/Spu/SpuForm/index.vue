<template>
  <div>
      <el-form ref="form" label-width="80px">
        <el-form-item label="SPU名称">
          <el-input placeholder="请输入SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select placeholder="请选择品牌">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            >
          </el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select placeholder="还要3项未选择">
            <el-option></el-option>
          </el-select>
          <el-button icon="el-icon-plus" type="primary" style="margin-left: 10px">添加销售属性</el-button>
          <el-table style="width: 100%" border>
            <el-table-column
              align="center"
              label="序号"
              width="80px"
              type="index"
            ></el-table-column>
            <el-table-column
              align="center"
              label="属性名"
              prop="spuName"
            ></el-table-column>
            <el-table-column
              label="属性值名称列表"
              prop="description"
            >
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
            >
              <template slot-scope="{row,$index}">
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button @click="$emit('changeScene',0)">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data(){
    return{
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods:{
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化spu数据
    initSpuData(row){
      console.log(row)
    }
  }
}
</script>

<style scoped>

</style>
