<template>
  <div>
    <el-form :inline="true"  class="demo-form-inline" :model="cateForm">
      <el-form-item label="/ 一级分类  ">
        <el-select  placeholder="请选择" v-model="cateForm.category1Id" @change="getCateGory2">
          <el-option v-for="(c1,index)  in cateGoryList1" :key="c1.id" :label="c1.name" :value="c1.id" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="/ 二级分类  ">
        <el-select  placeholder="请选择"  v-model="cateForm.category2Id" @change="getCateGory3">
          <el-option v-for="(c2,index)  in cateGoryList2" :key="c2.id" :label="c2.name" :value="c2.id" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="/ 三级分类" >
        <el-select  placeholder="请选择" v-model="cateForm.category3Id" @change="Handler">
          <el-option v-for="(c3,index)  in cateGoryList3" :key="c3.id" :label="c3.name" :value="c3.id" ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data(){
    return{
      cateGoryList1:[],
      cateGoryList2:[],
      cateGoryList3:[],
      cateForm:{
        category1Id:'',
        category2Id:'',
        category3Id:'',
      }
    }
  },
  methods:{
    async getCateGory1(){
      let result = await this.$API.attr.reqGetCateGory1()
      if(result.code == 200){
          this.cateGoryList1 = result.data
      }else {
        this.$message({
          message:'获取一级分类数据失败',
          type:"error"
        })
      }
    },
    async getCateGory2(){
      //清除数据
      this.cateGoryList2 = []
      this.cateGoryList3 = []
      this.cateForm.category2Id = ""
      this.cateForm.category3Id = ""
      let category1Id = this.cateForm.category1Id
      this.$emit('getCateGoryId',{categoryId:category1Id ,level:1 })
      let result = await this.$API.attr.reqGetCateGory2(category1Id)
      if(result.code == 200){
        this.cateGoryList2 = result.data
      }else {
        this.$message({
          message:'获取二级分类数据失败',
          type:"error"
        })
      }
    },
    async getCateGory3(){
      this.cateGoryList3 = []
      this.cateForm.category3Id = ""
      let category2Id = this.cateForm.category2Id
      this.$emit('getCateGoryId',{categoryId:category2Id ,level:2 })
      let result = await this.$API.attr.reqGetCateGory3(category2Id)
      if(result.code == 200){
        this.cateGoryList3 = result.data
      }else {
        this.$message({
          message:'获取三级分类数据失败',
          type:"error"
        })
      }
    },
    Handler(){
      let category3Id = this.cateForm.category3Id
      this.$emit('getCateGoryId',{categoryId:category3Id ,level:3 })
    }
  },
  async mounted() {
    this.getCateGory1()
  }
}
</script>

<style scoped>

</style>
