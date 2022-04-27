import request from "@/utils/request";

//获得spu页面展示的数据接口 GET /admin/product/{page}/{limit}
export const reqSpuPageList = (page,limit,category3Id) => request({
  url:`/admin/product/${page}/${limit}`,
  params:{category3Id},
  method:'get'
})

//获取某一个spu信息的接口 GET /admin/product/getSpuById/{spuId}
export const reqGetSpuInfo = (spuId) => request({
  url:`/admin/product/getSpuById/${spuId}`,
  method:'get'
})

//获取品牌的信息的接口 GET /admin/product/baseTrademark/getTrademarkList
export const reqGetTradeMark = () => request({
  url:'/admin/product/baseTrademark/getTrademarkList',
  method:'get'
})

//获得spu图片的接口 GET /admin/product/spuImageList/{spuId}
export const reqGetSpuImg = (spuId) => request({
  url:`/admin/product/spuImageList/${spuId} `,
  method:'get'
})

//获得平台销售属性的接口 GET  /admin/product/baseSaleAttrList
export const reqGetSaleAttrList = () => request({
  url:'/admin/product/baseSaleAttrList',
  method:'get'
})

