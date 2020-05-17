const path = require('path')
module.exports = {
  // 关闭Eslint检查
  lintOnSave: false,
  // 设置代理
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       //Request URL: http://localhost:8080/api/users
  //       //将http://localhost:8080换成http://localhost:3000, /api = ''
  //       // 所以真正请求的服务器地址为http://localhost:3000/users
  //       target: 'http://localhost:3000',
  //       pathRewrite: { 
  //         '^/api': ''
  //       }
  //     }
  //   }
  // },
  configureWebpack: {
    // 设置别名
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      }
    }
  }
}

