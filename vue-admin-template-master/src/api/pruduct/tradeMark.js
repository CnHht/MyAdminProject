import request from '@/utils/request'
//获得tradeMark分页列表 GET /admin/product/baseTrademark/{page}/{limit}
export const reqGetTradeMarkPage = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})
//修改品牌的接口 PUT /admin/product/baseTrademark/update
//新增品牌的接口 POST /admin/product/baseTrademark/save
export const reqAddOrUpDateTradeMark = (trademark) => {
  if (trademark.id) {
    //修改
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: trademark
    })
  } else {
    //新增
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: trademark
    })
  }
}
//删除品牌的接口 DELETE /admin/product/baseTrademark/remove/{id}
export const reqDelTradeMark = (id) => request({
  url:`/admin/product/baseTrademark/remove/${id}`,
  method:'delete'
})

