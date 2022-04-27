<template>
  <div>
    <el-form ref="form" label-width="80px" :model="SpuData">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="SpuData.spuName"></el-input>
      </el-form-item>
      <!--    外层的v-model是到哪里收集的数据 内层的:value是收集数据的对象    -->
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="SpuData.tmId">
          <el-option v-for="(tm,index) in TradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="SpuData.description"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="SpuImgList"
          :on-success="HandlerSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}项未选择`" v-model="SelectAttr">
          <el-option v-for="(us,index) in unSelectSaleAttr" :key="us.id" :label="us.name" :value="`${us.id}:${us.name}`"></el-option>
        </el-select>
        <el-button
          icon="el-icon-plus"
          type="primary"
          style="margin-left: 10px"
          :disabled="!SelectAttr" @click="AddSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="SpuData.spuSaleAttrList">
          <el-table-column
            align="center"
            label="序号"
            width="80px"
            type="index"
          ></el-table-column>
          <el-table-column
            align="center"
            label="属性名"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column
            label="属性值名称列表"
            prop="description"
          >
            <template slot-scope="{row,$index}">
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="{row,$index}">
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round>保存</el-button>
        <el-button @click="$emit('changeScene',0)" round>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      dialogImageUrl: '',
      dialogVisible: false,
      SpuData: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      SelectAttr:'',
      TradeMarkList: [],
      SpuImgList: [],
      SaleAttrList: []
    }
  },
  methods: {
    AddSaleAttr(){
      const[baseSaleAttrId,saleAttrName] = this.SelectAttr.split(':')
      let newSaleAttr = {baseSaleAttrId , saleAttrName ,spuSaleAttrValueList:[] }
      this.SpuData.spuSaleAttrList.push(newSaleAttr)
    },

    HandlerSuccess(response, file, fileList){
      if(response.code == 200){
        this.SpuImgList = fileList
      }

    },
    handleRemove(file, fileList) {
      this.SpuImgList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化spu数据
    async initSpuData(row) {
      //获取spu信息的接口
      let result = await this.$API.spu.reqGetSpuInfo(row.id)
      if (result.code == 200) {
        this.SpuData = result.data
      } else {
        this.$message({
          message: 'Spu信息请求失败！',
          type: 'error'
        })
      }
      let tradeMarkResult = await this.$API.spu.reqGetTradeMark()
      if (tradeMarkResult.code == 200) {
        this.TradeMarkList = tradeMarkResult.data
      } else {
        this.$message({
          message: 'Spu信息请求失败！',
          type: 'error'
        })
      }
      let SpuImgResult = await this.$API.spu.reqGetSpuImg(row.id)
      if (SpuImgResult.code == 200) {
        let resImgList = SpuImgResult.data
        resImgList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.SpuImgList = resImgList
      } else {
        this.$message({
          message: 'Spu信息请求失败！',
          type: 'error'
        })
      }
      let SaleAttrResult = await this.$API.spu.reqGetSaleAttrList()
      if (SaleAttrResult.code == 200) {
        this.SaleAttrList = SaleAttrResult.data
      } else {
        this.$message({
          message: 'Spu信息请求失败！',
          type: 'error'
        })
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }

  },
  computed:{
    unSelectSaleAttr(){
       let result = this.SaleAttrList.filter(item => {
        return this.SpuData.spuSaleAttrList.every(item1 => {
           return item.name != item1.saleAttrName
        })
      })
      return result
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
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
