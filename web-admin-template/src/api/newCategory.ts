import request from '@/utils/request'


export const newCategoryCreate = (data: any) => request.post('/newCategory/create', data)

export const newCategoryUpdate = (data: any) => request.put('/newCategory/update', data )
  
export const newCategoryDelete = (data: any) => request.delete('/newCategory/delete', {  data })

export const newCategoryFind   = (params: any) => request.get('/newCategory/find', { params })

export const newCategoryFindAll  = () => request.get('/newCategory/findAll')


