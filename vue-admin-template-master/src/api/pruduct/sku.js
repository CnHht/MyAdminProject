import request from "@/utils/request";

//平台属性管理请求模块的接口
//获取销售属性列表 GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({
  url:`/admin/product/spuSaleAttrList/${spuId}`,
  method:'get'
})
