import axios from '@/utils/axios'

export function fetchGoodsList(data) {
  return axios.request({
    url: 'goods',
    method: 'get',
    params: data
  })
}

export function fetchDeleteGoods(id) {
  return axios.request({
    url: `goods/${id}`,
    method: 'delete'
  })
}

export function fetchGoodsCategoriesList(data) {
  return axios.request({
    url: 'categories',
    method: 'get',
    params: data
  })
}

export function fetchGoodsAttributes(id,data) {
  return axios.request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: data
  })
}

export function fetchAddGoods(data) {
  return axios.request({
    url: 'goods',
    method: 'post',
    data
  })
}

export function fetchGoods(id) {
  return axios.request({
    url: `goods/${id}`,
    method: 'get'
  })
}

export function fetchEditGoods(id, data) {
  return axios.request({
    url: `goods/${id}`,
    method: 'put',
    data
  })
}