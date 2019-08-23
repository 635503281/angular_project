
(function(){
    "use strict";

    //引入加密模块
    var {encode,encodeHMAC}=require("./jiami");

    angular.module("InterceptorFactory",[]).factory("LoadingInterceptor",
    ["$rootScope","$translate","loginService","commonMethod",function($rootScope,$translate,loginService,commonMethod){
 
        var LoadingInterceptor = {
            request:function(config){
                if(!config.headers.noLoading){//带noLoading:true的不启用全局加载层
                    $rootScope.loading=true;
                }

                if(config.headers.page=="login"){//登录页面不做统一处理
                    return config
                }

                let token=loginService.getToken();
                if(token){
                    var headers={
                        "Content-Type":"application/json",
                        "Token":token,
                        "Timestamp":Date.now().toString(),
                        "Random":Math.floor(Math.random()*10000000).toString(),
                        "Terminal-Type":"3",
                        "Timezone-Offset": "Asia/wuhan", 
                        "Device-Id": "",
                        "Service-Id":"CDNC-001"
                    };
                    //请求头，兼并单独配置的
                    config.headers=Object.assign({},headers,config.headers);

                    var encrypti_obj = {
                        "Token":config.headers.Token ,
                        "Terminal-Type": "3", 
                        "Device-Id": "", 
                        "TS1": config.headers.Timestamp, 
                        "TSZ": "Asia/wuhan", 
                        "RND": config.headers.Random, 
                        "Service-Id":"CDNC-001"
                    };
                    var key = encode(encode(token).toString().toUpperCase() + token.substring(5, 10)).toString().toUpperCase();
                    var message = config.data ? (typeof config.data == 'object' ? angular.toJson(config.data) : config.data) : '{}';
                    var hmac = encodeHMAC(key,'{"Header":'+JSON.stringify(encrypti_obj)+',"Body":'+ message +'}');
                
                    config.headers["Hmac"] = hmac;
                }
                

                return config
            },
            response:function(response){
                if(!response.config.headers.noLoading){//带noLoading:true的不启用全局加载层
                    $rootScope.loading=false;
                }

                if(response.config.headers.page=="login"){//登录页面不做统一处理
                    return response
                }

                //接口报错
                if(!response.data.success&&!response.config.headers.showErr){//showErr:true的不启用全局报错提示
                    let msg=response.data.displayMessage||response.data.errorMessage||$translate.instant("interfaceError");
                    commonMethod.layuiTip(msg,"err");
                }

                if(response.data.resultAction==1){//跳到登录页面标志
                    loginService.clear();
                }

                return response
            },
            requestError:function(response){
                if(!response.config.headers.noLoading){//带noLoading:true的不启用全局加载层
                    $rootScope.loading=false;
                }

                commonMethod.layuiTip($translate.instant("requestError"),"err");
            
            },
            responseError:function(response){
                if(!response.config.headers.noLoading){//带noLoading:true的不启用全局加载层
                    $rootScope.loading=false;
                }
                if(response.config.headers.responseError)return;//responseError:true不报错提示

                switch(response.status){
                    case 400:
                        commonMethod.layuiTip($translate.instant("responseError_400"),"err");return
                    break;
                    case 401:
                        commonMethod.layuiTip($translate.instant("responseError_401"),"err");return
                    break;
                    case 403:
                        commonMethod.layuiTip($translate.instant("responseError_403"),"err");return
                    break;
                    case 404:
                        commonMethod.layuiTip($translate.instant("responseError_404"),"err");return
                    break;
                    case 500:
                        commonMethod.layuiTip($translate.instant("responseError_500"),"err");return
                    break;
                    case 503:
                        commonMethod.layuiTip($translate.instant("responseError_503"),"err");return
                    break;
                }

                commonMethod.layuiTip($translate.instant("responseError"),"err");
            }

        }

        return LoadingInterceptor;
    }])

})();