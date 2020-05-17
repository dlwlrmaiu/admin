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