<template>
  <div>
    <el-form ref="form" label-width="80px" >
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="请输入价格(元)" v-model="skuInfo.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="请输入重量(千克)" v-model="skuInfo.weight" type="number"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入相应描述"
          v-model="skuInfo.skuDesc"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in AttrList" :key="attr.id" style="margin:5px ">
            <el-select placeholder="请选择" v-model="attr.attrIdInfo">
              <el-option v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attrValue.id}:${attr.id}`"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form-item label="颜色" style="margin-left: 100px" v-for="(saleAttr,index) in SaleAttrList" :key="saleAttr.id">
          <el-select placeholder="请选择" v-model="saleAttr.SaleInfo">
            <el-option v-for="(saleValue,index) in saleAttr.spuSaleAttrValueList" :label="saleValue.saleAttrValueName" :key="saleValue.id" :value="`${saleAttr.id}:${saleValue.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange"  ref="multipleTable">
          <el-table-column
          width="50px"
          type="selection"
          >

          </el-table-column>
          <el-table-column
          width="width"
          label="图片"
          >
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width: 100px;height: 100px">
            </template>
          </el-table-column>
          <el-table-column
            width="width"
            label="名称"
            prop="imgName"
          >

          </el-table-column>
          <el-table-column
            width="width"
            label="操作"
          >
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
              <el-tag type="info" style="margin: 10px" size="medium" v-else>默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round >保存</el-button>
        <el-button  round>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {reqGetSaleAttrList} from "@/api/pruduct/spu";

export default {
  name: "SkuForm",
  data(){
    return{
      spuImageList: [],
      SaleAttrList:[],
      AttrList:[],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu:[],
      skuimages:[]
    }
  },
  methods:{
    changeDefault(row){
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })

      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleSelectionChange(val){
      this.skuimages = val
    },
    async getData(category1Id,category2Id,row){
      let SpuImgResult = await  this.$API.spu.reqGetSpuImg(row.id)
      //收集父组件给予的属性
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu  = row
      if(SpuImgResult.code == 200){
        let list = SpuImgResult.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      let SaleAttrListResult = await this.$API.sku.reqSpuSaleAttrList(row.id)
      if(SaleAttrListResult.code == 200){
        this.SaleAttrList = SaleAttrListResult.data
      }
      let AttrListResult = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,row.category3Id)
      if(AttrListResult.code == 200){
        this.AttrList = AttrListResult.data
      }
    }
  }
}
</script>

<style scoped>

</style>
