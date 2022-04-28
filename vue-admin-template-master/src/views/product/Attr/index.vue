<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 30px">
      <CategorySelect @getCateGoryId="getCateGoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card class="box-card">
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 30px" @click="AddAttr"
                   :disabled="!category3Id">添加
        </el-button>
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
              <el-tag v-for="(value,index) in row.attrValueList" :key="value.id" style="margin: 10px">
                {{ value.valueName }}
              </el-tag>
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
                @click="updateAttr(row)"
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
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名" style="margin-bottom: 10px">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 10px" @click="addAttrValue"
                   :disabled="!attrInfo.attrName || NoAdd"
        >
          添加属性值
        </el-button>
        <el-button @click="cancelAttrValue" :disabled="!attrInfo.attrName">
          取消
        </el-button>
        <el-table style="width: 100%;margin: 10px" border :data="attrInfo.attrValueList">
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
            <template slot-scope="{row,$index}">
              <el-input laceholder="请输入属性值名称"
                        v-model="row.valueName"
                        @blur="toLook(row)"
                        v-if="row.flag"
                        @keyup.enter.native="toLook(row)"
                        :ref="$index"
              ></el-input>
              <!--  style="display: block"将span变成块元素，否则span为空时会有bug              -->
              <span v-else @click="toEdit(row,$index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="{row,$index}">
              <el-popconfirm
                :title="`确定删除${row.valueName}?`" @onConfirm="delAttrValue($index)">
                <el-button
                  size="mini"
                  type="danger"
                  round
                  icon="el-icon-delete"
                  slot="reference"

                ></el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-left: 10px" @click="addOrUpdateAttrInfo"
                   :disabled="attrInfo.attrValueList.length < 1">
          保存
        </el-button>
        <el-button @click="cancelAdd">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      AttrList: [],
      isShowTable: true,
      attrInfo: {
        "attrName": "",
        "attrValueList": [],
        "categoryId": 0,
        "categoryLevel": 3,
      },
      NoAdd: false
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
      let result = await this.$API.attr.reqGetAttrList(category1Id, category2Id, category3Id)
      console.log(result)
      if (result.code == 200) {
        this.AttrList = result.data
      } else {
        this.$message({
          message: '获取Attr数据失败',
          type: "error"
        })
      }
    },
    AddAttr() {
      this.isShowTable = !this.isShowTable
      this.attrInfo = {
        "attrName": "",
        "attrValueList": [],
        "categoryId": this.category3Id,
        "categoryLevel": 3,
      }

    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        flag: true,
        attrId: this.attrInfo.id,
        valueName: ''
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      })

    },
    cancelAdd() {
      this.isShowTable = !this.isShowTable
    },
    cancelAttrValue() {
      this.attrInfo.attrName = ""
      this.attrInfo = {}
    },
    updateAttr(row) {
      this.isShowTable = !this.isShowTable

      //将选中的属性赋值给attrInfo
      //由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要使用深拷贝解决这类问题
      //深拷贝，浅拷贝在面试的时候出现频率很高，切记达到手写深拷贝与浅拷贝
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        //这样写的话数据不是响应式数据
        //  item.flag = false
        this.$set(item, 'flag', false)
      })
    },
    toLook(row) {
      if (row.valueName.trim() == '') {
        this.NoAdd = true
        this.$message({
          message: '属性值不能为空',
          type: "error",
        })
        return
      }
      let isRepat = this.attrInfo.attrValueList.some(item => {
        //需要将row从数组里面判断的时候去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message({
          message: '属性值不能相同',
          type: "error",
        })
        return;
      }
      row.flag = false
      this.NoAdd = false
    },
    toEdit(row, $index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[$index].focus()
      })
    },
    delAttrValue($index) {
      this.attrInfo.attrValueList.splice($index, 1)
    },
    //添加或者修改属性的操作
    async addOrUpdateAttrInfo() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valName != '') {
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqAddOrUpdateAttrInfo(this.attrInfo)
        this.isShowTable = true
        this.$message({
          message: '保存成功！',
          type: "success"
        })
        this.getAttrList()
      } catch (e) {
        this.$message({
          message: '保存失败！',
          type: "error"
        })
      }

    }

  }
}
</script>

<style scoped>

</style>
