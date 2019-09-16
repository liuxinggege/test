import request from '@/utils/request'

export const getUserInfo = (data: any) =>
  request({
    headers:{
      'X-Access-Token':"admin-token"
    },
    url: 'http://localhost:9528/mock-api/v1/users/info',
    method: 'post',
    data
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const login = (data: any) =>
  request({
    url: 'http://localhost:9528/mock-api/v1/users/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: 'http://localhost:9528/mock-api/v1/users/logout',
    method: 'post'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })
