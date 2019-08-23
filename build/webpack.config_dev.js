const merge = require('webpack-merge');//合并配置
const baseWebpackConfig = require('./webpack.config_base');

const path=require("path");
const ROOT_PATH=path.resolve(__dirname);
const DIST_PATH=ROOT_PATH;

const config=require("../config/index");

module.exports=merge(baseWebpackConfig, {
    devServer:{//启动服务
        // publicPath:"/"+config.app+"/",
        contentBase:DIST_PATH,//服务的根目录
        host:config.host,//解决不能通过ip访问
        port:config.port,//端口 
        inline:true,//是否同步刷新
        proxy: config.proxy
    },
})