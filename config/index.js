const config={
    app:"cdnc",
    host:"0.0.0.0",
    port:8886,
    proxy:{//本地启服务配置跨域（开发用）
        '/**': {//代理所有
            target: "http://10.96.155.42:28080",
            changeOrigin: true,
            secure: false,
            onProxyRes: function(proxyRes, req, res) {//代理收到请求之后将数据发给浏览器之前做一层拦截
                var cookies = proxyRes.headers['set-cookie'];
                if (cookies) {
                    var newCookie = cookies.map(function(cookie) { 
                        
                        return cookie.split(";").map(function(value){
                            if(value.includes("Path="))value=" Path=/";
                            return value
                        }).join(";");  //修改cookie的路径path
                   
                    });
                    delete proxyRes.headers['set-cookie'];
                    proxyRes.headers['set-cookie'] = newCookie;
                }
            },
        }
    },

}

module.exports=config