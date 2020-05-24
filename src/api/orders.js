import axios from '@/utils/axios'

export function fetchOrders(data) {
  return axios.request({
    url: 'orders',
    method: 'get',
    params: data
  })
}
