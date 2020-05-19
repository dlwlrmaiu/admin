import axios from '@/utils/axios.js'

export function fetchRightsList(type) {
  return axios.request({
    url: `rights/${type}`,
    method: 'get'
  })
}

export function deleteRoleRight(roleId,rightId) {
  return axios.request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

export function fetchMenus() {
  return axios.request({
    url: 'menus',
    method: 'get'
  })
}