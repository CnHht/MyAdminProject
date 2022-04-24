<template>
  <div>
    <el-button icon="el-icon-plus" type="primary" style="margin: 10px 0px">添加</el-button>
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
    <el-table style="width: 100%" border>
      <el-table-column
        align="center"
        label="序号" width="80px">
      </el-table-column>
      <el-table-column
        label="品牌名称">
      </el-table-column>
      <el-table-column
        label="品牌logo">
      </el-table-column>
      <el-table-column
        label="操作"
      >
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
      :current-page="1"
      :page-size=3
      :page-sizes=[1,3,5]
      :pager-count="7"
      layout=" prev, pager, next, jumper, ->, total, sizes"
      :total="99">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped>

</style>
