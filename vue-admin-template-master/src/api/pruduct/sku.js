import request from "@/utils/request";

//sku列表的接口 GET /admin/product/list/{page}/{limit}
export const reqGetSkuList = (page,limit) => request({
  url:`/admin/product/list/${page}/${limit}`,
  method:'get'
})


//上架 GET /admin/product/onSale/{skuId}
export const reqSkuOnSale = (skuId) => request({
  url:`/admin/product/onSale/${skuId}`,
  method:'get'
})

//下架 GET /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => request({
  url:`/admin/product/cancelSale/${skuId}`,
  method:'get'
})

//获取SKU详情的接口 GET /admin/product/getSkuById/{skuId}
export const reqGetSkuInfo = (skuId) =>request({
  url:`/admin/product/getSkuById/${skuId}`,
  method:'get'
})
