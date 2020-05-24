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

export function fetchAddAttribute(categoryId, data) {
  return axios.request({
    url: `categories/${categoryId}/attributes`,
    method: 'post',
    data
  })
}

export function fetchDeleteAttribute(categoryId, attributeId) {
  return axios.request({
    url: `categories/${categoryId}/attributes/${attributeId}`,
    method: 'delete'
  })
}

export function fetchMoveOrAddSingleAttribute(categoryId, attributeId, data) {
  return axios.request({
    url: `categories/${categoryId}/attributes/${attributeId}`,
    method: 'put',
    data
  })
}

export function fetchEditAttribute(categoryId, attributeId, data) {
  return axios.request({
    url: `categories/${categoryId}/attributes/${attributeId}`,
    method: 'get',
    params: data
  })
}

export function fetchAddCategories(data) {
  return axios.request({
    url: 'categories',
    method: 'post',
    data
  })
}

export function fetchDeleteCategories(id) {
  return axios.request({
    url: `categories/${id}`,
    method: 'delete'
  })
}

export function fetchEditCategories(id, data) {
  return axios.request({
    url: `categories/${id}`,
    method: 'put',
    data
  })
}