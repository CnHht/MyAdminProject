<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 30px">
      <el-table style="width: 100%" border :data="records">
        <el-table-column  align="center" label="序号" width="80px" type="index">
        </el-table-column>
        <el-table-column
          label="名称"
          prop="skuName"
        ></el-table-column>
        <el-table-column
          label="描述"
          prop="skuDesc"
        ></el-table-column>
        <el-table-column
          label="默认图片"
          width="200px"
        >
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width: 80px; height: 80px">
          </template>
        </el-table-column>
        <el-table-column
          label="重量(KG)"
          prop="weight"
        ></el-table-column>
        <el-table-column
          label="价格(元)"
          width="80px"
          prop="price"
        ></el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row,$index}">
            <HintButton
              size="mini"
              type="success"
              round
              icon="el-icon-top"
              title="上架sku"
              v-if="row.isSale == 0"
              @click="SkuOnSale(row)"

            ></HintButton>
            <HintButton
              size="mini"
              type="success"
              round
              icon="el-icon-bottom"
              title="下架sku"
              v-else
              @click="SkuCancel(row)"
            ></HintButton>
            <HintButton
              size="mini"
              type="primary"
              round
              icon="el-icon-edit"
              title="编辑sku"
              @click="EditSku"
            ></HintButton>
            <HintButton
              size="mini"
              type="info"
              round
              icon="el-icon-warning"
              title="sku信息"
              @click="InfoSku(row)"
            ></HintButton>
            <HintButton
              size="mini"
              type="danger"
              round
              icon="el-icon-delete"
              title="删除sku"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      style="margin-top: 30px"
      align="center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5,10,15]"
      :pager-count="7"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total=total
      @current-change="getSKUList"
      @size-change="handlerSizeChange"
    />
    <el-drawer
      :visible.sync="drawer"
      direction="ttb"
      :show-close="false"
      size="80%"

    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="12">{{SkuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="12">{{SkuInfo.skuDesc}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="12">{{SkuInfo.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="12">
             <el-tag v-for="(attrValue,index) in SkuInfo.skuAttrValueList" type="success" :key="attrValue.id" style="margin: 5px"> {{attrValue.id}}--{{attrValue.valueName}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="12">
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="(item,index) in SkuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width:300px;height: 300px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data(){
    return{
      page: 1,
      limit:10,
      total: 0,
      records:[],
      drawer: false,
      SkuInfo:{}

    }
  },
  mounted() {
    this.getSKUList()
  },
  methods:{
    async InfoSku(row){
      this.drawer = true
      let result = await this.$API.sku.reqGetSkuInfo(row.id)
      if(result.code == 200){
        this.SkuInfo = result.data
      }
    },
    EditSku(){
      this.$message({
        message:'功能开发中'
      })
    },
    async SkuOnSale(row){
      let result = await this.$API.sku.reqSkuOnSale(row.id)
      if(result.code == 200){
        row.isSale = 1
        this.$message({
          message:'上架成功！',
          type:"success"
        })
      }
    },
    async SkuCancel(row){
      let result = await this.$API.sku.reqCancelSale(row.id)
      if(result.code == 200){
        row.isSale = 0
        this.$message({
          message:'下架成功！',
          type:"success"
        })
      }
    },
    async getSKUList(pages = 1) {
      this.page = pages;
      let {page, limit} = this
      let result = await this.$API.sku.reqGetSkuList(page, limit)
      console.log(result)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      } else {
        this.$message({
          message: 'SPU列表请求失败！',
          type: "error"
        })
      }
    },
    handlerSizeChange(limit) {
      //修改参数
      this.limit = limit;
      this.getSKUList()
    },
  }

}
</script>

<style >
    .el-row .el-col-5{
      font-size: 18px;
      text-align: right;
    }
    .el-row .el-col-12{
      font-size: 18px;
      text-align: center;
    }
    .el-col{
      margin: 10px;
    }
    .el-carousel__item img {
      color: #475669;
      font-size: 18px;
      opacity: 0.75;
      line-height: 300px;
      margin: 0;
    }


</style>
