<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 30px">
      <CategorySelect @getCateGoryId="getCateGoryId"></CategorySelect>
    </el-card>
    <el-card class="box-card">
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin: 30px" @click="AddAttr" :disabled="!category3Id">添加</el-button>
        <el-table style="width: 100%" border :data="AttrList">
          <el-table-column
            align="center"
            label="序号"
            width="80px"
            type="index"
          ></el-table-column>
          <el-table-column
            align="center"
            label="属性名称"
            prop="attrName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="属性值列表"
          >
            <template slot-scope="{row,$index}">
              <el-tag v-for="(value,index) in row.attrValueList" :key="value.id" style="margin: 10px">{{value.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="{row,$index}">
              <el-button
                size="mini"
                type="warning"
                round
                icon="el-icon-edit"
                @click="AddAttr"
              >
              </el-button>
              <el-button
                size="mini"
                type="danger"
                round
                icon="el-icon-delete"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" >
          <el-form-item label="属性名" style="margin: 10px">
            <el-input placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 10px">
          添加属性值
        </el-button>
        <el-button >
          取消
        </el-button>
        <el-table style="width: 100%;margin: 10px" border="true">
            <el-table-column
              label="序号"
              align="center"
              width="80px"
              type="index"
            >

            </el-table-column>
            <el-table-column
              label="属性值名称"
            >

            </el-table-column>
            <el-table-column
              label="操作"
            >

            </el-table-column>
        </el-table >
        <el-button type="primary" style="margin-left: 10px">
          保存
        </el-button>
        <el-button >
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      AttrList: [],
      isShowTable:false
    }
  },
  methods: {
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

        this.getAttrList()
      }
    },
    async getAttrList() {
      const {category1Id, category2Id, category3Id} = this
      let result = await this.$API.attr.reqGetAttrList(category1Id,category2Id,category3Id)
      console.log(result)
      if(result.code == 200){
        this.AttrList = result.data
      }else {
        this.$message({
          message:'获取Attr数据失败',
          type:"error"
        })
      }
    },
    AddAttr(){
      this.isShowTable = !this.isShowTable
    }

  }
}
</script>

<style scoped>

</style>
