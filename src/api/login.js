import axios from './../utils/axios.js'

export function fetchLogin() {
  console.log('1111')
  return axios.request({
    url: '/login',
    method: 'post'
  })
}