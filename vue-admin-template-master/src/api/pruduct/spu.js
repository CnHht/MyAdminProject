import request from "@/utils/request";

//获得spu页面展示的数据接口 GET /admin/product/{page}/{limit}
export const reqSpuPageList = (page,limit,category3Id) => request({
  url:`/admin/product/${page}/${limit}`,
  params:{category3Id},
  method:'get'
})
