APP_BASE_API = '/api'

module.exports = {
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ],
    devServer: {
        port: 8080,
        proxy: {
            '/admin': {
                target: 'http://129.211.66.41:8080/admin',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/admin': ''
                }
            }
        }

    }
}