import axios from '@/utils/axios.js'

export function fetchUsersList(data) {
  return axios.request({
    url: 'users',
    method: 'get',
    params: data
  })  
}

export function fetchAddUser(data) {
  return axios.request({
    url: 'users',
    method: 'post',
    data
  })  
}

export function deleteUser(id) {
  return axios.request({
    url: `users/${id}`,
    method: 'delete'
  })  
}

export function editUser(id, data) {
  return axios.request({
    url: `users/${id}`,
    method: 'put',
    data
  })  
}

export function changeUserState(id, type) {
  return axios.request({
    url: `users/${id}/state/${type}`,
    method: 'put'
  })  
}

export function fetchUser(id) {
  return axios.request({
    url: `users/${id}`,
    method: 'get'
  })  
}

export function fetchUserRoles() {
  return axios.request({
    url: 'roles',
    method: 'get'
  })  
}

export function fetchSetUserRole(id, data) {
  return axios.request({
    url: `users/${id}/role`,
    method: 'put',
    data
  })  
}