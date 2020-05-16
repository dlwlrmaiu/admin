import axios from 'axios'

// 封装axios
class httpRequset{
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    // 处理请求队列
    this.queue = {}
  }
  // 设置更多的配置
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      header: {
        // 请求头设置
      }
    }
    return config
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 处理config
      console.log('拦截和处理请求', config)
      return config
    })
    // 响应拦截
    instance.interceptors.request.use(res => {
      // 处理config
      console.log('拦截和处理响应', res)
      return res
    }, error => {
      // 请求出问题, 处理问题
      console.log(error)
      return { error: '网络出错' }
    })
  }
  request(options) {
    const instance = axios.create() // 创造实例对象
    // 合并配置
    // options = { baseURL: '/api/', url: 'banner' }
    options = Object.assign(this.getInsideConfig(), options)
    console.log(options) 
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

const axiosObj = new httpRequset(process.env.VUE_APP_BASE_API) // /api/
export default axiosObj