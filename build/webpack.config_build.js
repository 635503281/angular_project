const merge = require('webpack-merge');//合并配置
const baseWebpackConfig = require('./webpack.config_base');
const UglifyESPlugin = require('uglifyjs-webpack-plugin');//压缩代码插件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');//压缩css

module.exports=merge(baseWebpackConfig, {
    plugins:[
        //添加打包压缩文件
        new UglifyESPlugin({
            // 多嵌套了一层
            uglifyOptions: {
              compress: {    
                warnings: false,// 在UglifyJs删除没有用到的代码时不输出警告
                drop_console: true,// 删除所有的 `console` 语句，可以兼容ie浏览器
                collapse_vars: true,// 内嵌定义了但是只用到一次的变量
                reduce_vars: true,// 提取出出现多次但是没有定义成变量去引用的静态值
              },
              output: {   
                beautify: false,// 最紧凑的输出 
                comments: false,// 删除所有的注释
              }
            },
            sourceMap:false,
            parallel: true,//并行压缩
        }),

        //压缩css
        new OptimizeCSSPlugin({
            safe:true
        })
    ]
});