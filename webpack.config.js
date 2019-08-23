var webpack=require("webpack");//下面有些配置只能是webpack4.0以下
var cssWebpackPlugin=require("extract-text-webpack-plugin");//打包抓取css插件
var htmlWebpackPlugin=require("html-webpack-plugin");//打包生成html插件
var copyWebpackPlugin=require("copy-webpack-plugin");//复制静态目录

//使用多线程来打包js/css/less
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

var path=require("path");
var ROOT_PATH=path.resolve(__dirname);
var DIST_PATH=ROOT_PATH;
var SRC_PATH=path.resolve(ROOT_PATH,"src");

var config={
    app:"cdnc",
    host:"0.0.0.0",
    port:8886,
    // testUrl:"http://localhost:8084"
    testUrl:"http://10.96.155.42:28080"
    // testUrl:"http://10.41.71.102:28080"
}

module.exports={
    entry:{//入口
        index:SRC_PATH+"/js/index.js",
    },
    output:{//出口
        path:DIST_PATH,//出口目录
        filename:"static/js/[name].js",//文件名 
    },
    devtool:"source-map",//资源地图
    devServer:{//启动服务
        // publicPath:"/"+config.app+"/",
        contentBase:DIST_PATH,//服务的根目录
        host:config.host,//解决不能通过ip访问
        port:config.port,//端口 
        inline:true,//是否同步刷新
        proxy: {//本地启服务配置跨域（开发用）
            '/**': {//代理所有
             target: config.testUrl,
             changeOrigin: true,
             secure: false
            }
        },
    },
    module:{//模块
        rules:[//加载器 各种loader
            {test:/\.js$/,exclude:/node_modules/,loader:"happypack/loader?id=babel"},//将es6转为es5
            {test:/\.css$/,use:cssWebpackPlugin.extract({//打包css options:{plugins:[autoprefixer]}
                use:'happypack/loader?id=css'
            })},
            {test:/\.less$/,exclude:/node_modules/,use:cssWebpackPlugin.extract({//打包less
                use:'happypack/loader?id=less'
            })},
            {test:/\.scss$/,exclude:/node_modules/,use:cssWebpackPlugin.extract({//打包scss
                use:'happypack/loader?id=sass'
            })},
            {test:/\.(gif|png|jpg|woff|woff2|svg|ttf|eot|otf)$/,exclude:/node_modules/,use:{//打包js/css中图片及字体
                loader:"url-loader", 
                options:{
                    limit:8192, //小于限制大小，转为base64
                    name:'static/img/[name].[ext]', //打包路径 以output的path为根目录
                    // publicPath:"/"+config.app+"/" //打包好的绝对路径
                    publicPath:"../../" //打包好是以css为根目录
                }
            }},
            {test:/\.html$/,exclude:/node_modules/,use:["html-withimg-loader"]},//打包html中份图片    
   
        ]
        
    },
    plugins:[//插件
        new HappyPack({
            id:"babel",//用id来标识 happypack处理那里类文件
            loaders:["babel-loader"]
        }),
        new HappyPack({
            id:"less",//用id来标识 happypack处理那里类文件
            loaders:["css-loader","postcss-loader","less-loader"],
            threadPool: happyThreadPool,
        }),
        new HappyPack({
            id:"css",//用id来标识 happypack处理那里类文件
            loaders:["css-loader","postcss-loader"],
            threadPool: happyThreadPool,
        }),
        new HappyPack({
            id:"sass",//用id来标识 happypack处理那里类文件
            loaders:["css-loader","postcss-loader","sass-loader"],
            threadPool: happyThreadPool,
        }),

        new htmlWebpackPlugin({//打包Html文件
            template:SRC_PATH+"/index.html",//模板
            filename:"index.html",//打包后文件名 以output的path为根目录
            hash:true,//在加载的资源后加上打包的hash值
            // favicon:SRC_PATH+'/img/title_logo.jpg',//打包带上shortcut icon 路径为相对路径
            inject:"body",//js 插入的位置 body- 放在body下 head-放在head下 false-不注入任何资源
            // chunks:['index','vendors','runtime']  //配置加载哪些打包的资源的（默认加载所有）
            chunksSortMode: 'dependency',//按顺序加载chunk
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({//提取第三方插件库
            name:'vendors',
            filename:'static/js/[name].js' ,
            minChunks (module,count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                  module.resource && /\.js$/.test(module.resource) &&
                  module.resource.indexOf(path.resolve(__dirname,'node_modules')) === 0
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({//将webpack运行文件 和 第三方插件库分离开
            name:'runtime',
            filename:'static/js/[name].js' ,
            chunks:["vendors"]
        }),

        new cssWebpackPlugin("static/css/index.css"),//打包生成的目录跟文件名 以output的path为根目录
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery":'jquery'
        }),
        new copyWebpackPlugin([//静态直接复制文件
            { 
                from:SRC_PATH+"/assets",
                to:DIST_PATH+"/static/assets"
            }      
        ]),
        
    ]
}