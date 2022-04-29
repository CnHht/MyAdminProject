import request from "@/utils/request";

//获得spu页面展示的数据接口 GET /admin/product/{page}/{limit}
export const reqSpuPageList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  params: {category3Id},
  method: 'get'
})

//获取某一个spu信息的接口 GET /admin/product/getSpuById/{spuId}
export const reqGetSpuInfo = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method: 'get'
})

//获取品牌的信息的接口 GET /admin/product/baseTrademark/getTrademarkList
export const reqGetTradeMark = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'get'
})

//获得spu图片的接口 GET /admin/product/spuImageList/{spuId}
export const reqGetSpuImg = (spuId) => request({
  url: `admin/product/spuImageList/${spuId} `,
  method: 'get'
})

//获得平台销售属性的接口 GET  /admin/product/baseSaleAttrList
export const reqGetSaleAttrList = () => request({
  url: '/admin/product/baseSaleAttrList',
  method: 'get'
})

//修改或者添加Spu的接口

export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) return request({url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo})
  else return request({url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo});
}

//删除Spu的接口 DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({
  url:`/admin/product/deleteSpu/${spuId}`,
  method:'delete'
})

//获取图片的数据 GET /admin/product/spuImageList/{spuId}
export const reqSpuImageLIst = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});


//获取销售属性的数据 GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});


//获取平台属性的数据 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});


//添加SKU POST /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});

//获取Sku列表的接口 GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) =>request({
  url:`/admin/product/findBySpuId/${spuId}`,
  method:'get'
})


