import request from "@/utils/request";
//获得三级联动的接口

//获取一级分类的接口 GET /admin/product/getCategory1
export const reqGetCateGory1 = () => request({
  url:'/admin/product/getCategory1',
  method:'get'
})
//获取二级分类的接口 GET /admin/product/getCategory2/{category1Id}
export const reqGetCateGory2 = (category1Id) => request({
  url:`/admin/product/getCategory2/${category1Id}`,
  method:'get'
})
//获得三级分类的接口 GET /admin/product/getCategory3/{category2Id}
export const reqGetCateGory3 = (category2Id) => request({
  url:`/admin/product/getCategory3/${category2Id}`,
  method:'get'
})
//获得商品属性的接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqGetAttrList = (category1Id,category2Id,category3Id) => request({
  url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method:'get'
})
//添加属性和属性值的接口 POST /admin/product/saveAttrInfo
export const reqAddAttrInfo = (data) => request({
  url:'/admin/product/saveAttrInfo',
  method:'post',
  data
})
