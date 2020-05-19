import axios from '@/utils/axios'

export function fetchAddRole(data) {
  return axios.request({
    url: 'roles',
    method: 'post',
    data
  })
}

export function fetchDeleteRole(id) {
  return axios.request({
    url: `roles/${id}`,
    method: 'delete'
  })
}

export function fetchEditRole(id, data) {
  return axios.request({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}