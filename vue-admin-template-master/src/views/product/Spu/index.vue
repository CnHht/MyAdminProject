<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 30px">
      <CategorySelect @getCateGoryId="getCateGoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card class="box-card" style="margin-bottom: 30px">
      <!-- 展示spu表结构-->
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px" :disabled="!category3Id"
                   @click="AddSpu">添加SPU
        </el-button>
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
                      @click="AddSku(row)"
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
                @click="HandlerSkuDetail(row)"
              >
              </HintButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="DeleteSpu(row)"
              >
                <HintButton
                  size="mini"
                  type="danger"
                  round
                  icon="el-icon-delete"
                  title="删除spu"
                  slot="reference"
                >
                </HintButton>
              </el-popconfirm>

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
          @current-change="getSPUList"
          @size-change="handlerSizeChange"
        />
      </div>
      <!--  添加修改spu -->
      <spu-form v-show="scene == 1" @changeScene="changeScene" ref="spuForm"></spu-form>

      <!--  添加sku -->
      <sku-form v-show="scene == 2" ref="skuForm" @changeScene="changeScene"></sku-form>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="closeSkuDetail">
      <el-table style="width: 100%" border :data="skuList"  v-loading="loading" >
        <el-table-column label="名称" width="width" prop="skuName"></el-table-column>
        <el-table-column label="价格" width="width" prop="price"></el-table-column>
        <el-table-column label="重量" width="width" prop="weight"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'

export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      Show: true,
      page: 1,
      limit: 3,
      total: 0,
      SPUList: [],
      scene: 0,
      dialogTableVisible: false,
      skuList:[],
      spu:{},
      loading:true
    }
  },
  methods: {
    closeSkuDetail(done){
      this.loading =true
      this.skuList = []
      done()
    },
    async HandlerSkuDetail(row){
      this.dialogTableVisible = true
      this.spu = row
      let result = await this.$API.spu.reqSkuList(row.id)
      console.log(result)
      if(result.code == 200){
        this.skuList = result.data
        this.loading = false
      }

    },
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
    async getSPUList(pages = 1) {
      this.page = pages;
      let {page, limit, category3Id} = this
      let result = await this.$API.spu.reqSpuPageList(page, limit, category3Id)
      if (result.code == 200) {
        this.total = result.data.total
        this.SPUList = result.data.records
      } else {
        this.$message({
          message: 'SPU列表请求失败！',
          type: "error"
        })
      }
    },
    handlerSizeChange(limit) {
      this.limit = limit
      this.getSPUList()
    },
    AddSpu() {
      this.scene = 1
      this.$refs.spuForm.addSpuData(this.category3Id)
    },
    upDateSpu(row) {
      this.scene = 1
      //点击更新触发子组件方法获取数据
      this.$refs.spuForm.upDateSpuData(row)
    },
    changeScene({scene, flag}) {
      this.scene = scene
      console.log(flag == '添加')
      if (flag == '添加') {
        this.getSPUList(1)
      } else {
        this.getSPUList(this.page)
      }


    },
    async DeleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          message: '删除成功！',
          type: "success"
        })
        if (this.SPUList.length > 1) {
          this.getSPUList(this.page)
        } else {
          this.getSPUList(this.page - 1)
        }
      } else {
        this.$message({
          message: '删除失败！',
          type: "error"
        })
      }
    },
    AddSku(row){
      this.scene = 2
      this.$refs.skuForm.getData(this.category1Id,this.category2Id,row)
    }

  }
}
</script>

<style scoped>

</style>
