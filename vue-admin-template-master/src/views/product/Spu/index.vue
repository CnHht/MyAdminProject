<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 30px">
      <CategorySelect  @getCateGoryId="getCateGoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card class="box-card" style="margin-bottom: 30px">
      <!-- 展示spu表结构-->
      <div v-show="scene == 0" >
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px" :disabled="!category3Id" @click="AddSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="SPUList">
          <el-table-column
            align="center"
            label="序号"
            width="80px"
            type="index"
          ></el-table-column>
          <el-table-column
            align="center"
            label="SPU名称"
            prop="spuName"
          ></el-table-column>
          <el-table-column
            label="SPU叙述"
            prop="description"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="{row,$index}">
              <HintButton
                size="mini"
                type="success"
                round
                icon="el-icon-plus"
                title="添加sku"
              >
              </HintButton>

              <HintButton
                size="mini"
                type="warning"
                round
                icon="el-icon-edit"
                title="修改spu"
                @click="upDateSpu(row)"
              >
              </HintButton>
              <HintButton
                size="mini"
                round
                type="info"
                icon="el-icon-info"
                title="查看实例"
              >
              </HintButton>
              <HintButton
                size="mini"
                type="danger"
                round
                icon="el-icon-delete"
                title="删除spu"
              >
              </HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 30px"
          align="center"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[1,3,5]"
          :pager-count="7"
          layout=" prev, pager, next, jumper, ->, sizes, total"
          :total=total
          @current-change="handlerCurrentChange"
          @size-change="handlerSizeChange"
        />
      </div>
      <!--  添加修改spu -->
        <spu-form v-show="scene == 1" @changeScene="changeScene" ref="spuForm"></spu-form>

      <!--  添加sku -->
        <sku-form v-show="scene == 2"></sku-form>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components:{
    SpuForm,
    SkuForm
  },
  data(){
    return{
      category1Id: '',
      category2Id: '',
      category3Id: '',
      Show:true,
      page:1,
      limit:3,
      total:0,
      SPUList:[],
      scene:0
    }
  },
  methods:{
    getCateGoryId(cateGory) {
      if (cateGory.level == 1) {
        this.category1Id = cateGory.categoryId
        this.category2Id = ""
        this.category3Id = ""
        this.AttrList = []
      } else if (cateGory.level == 2) {
        this.category2Id = cateGory.categoryId
        this.category3Id = ""
        this.AttrList = []
      } else {
        this.category3Id = cateGory.categoryId
        this.getSPUList()
      }
    },
   async getSPUList(){
      let {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuPageList(page , limit , category3Id)
      if(result.code == 200){
        this.total = result.data.total
        this.SPUList = result.data.records
      }else {
        this.$message({
          message:'SPU列表请求失败！',
          type:"error"
        })
      }
    },
    handlerCurrentChange(pager) {
      this.page = pager
      this.getSPUList()
    },
    handlerSizeChange(limit) {
      this.limit = limit
      this.getSPUList()
    },
    AddSpu(){
      this.scene =  1
    },
    upDateSpu(row){
      this.scene =  1
      //点击更新触发子组件方法获取数据
      this.$refs.spuForm.initSpuData(row)
    },
    changeScene(change){
      this.scene = change
      this.getSPUList(this.page)
    }
  }
}
</script>

<style scoped>

</style>
