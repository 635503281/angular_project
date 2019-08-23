
(function(app){
    'use strict';
    //引入加密模块
    var {encodeAES}=require("../../js/jiami");

    app.controller("loginCtrl",loginCtrl);
    loginCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","loginService","commonMethod"];
    function loginCtrl($scope,$rootScope,$http,$translate,$state,loginService,commonMethod){
        //初始化
        $scope.init=()=>{
            if(loginService.isLogin()){
                $state.go("index");
                return
            }
            //自动聚焦用户名
            $('.userName_ipt input').focus();

            //初始语言
            $rootScope.lang=sessionStorage.getItem('lang')||'zh-cn';

            //初始化语言列表
            $scope.langList=[];
            loginService.getLangList().then(function([list,lang]){ 
                $scope.langList=list;
                if($translate.use()==lang&&$rootScope.lang==lang)return;
                $rootScope.lang=lang;
                $translate.use($rootScope.lang);            
                
            }).catch(e=>{});        

            //登录用户信息
            $scope.item={
                userName:null,
                password:null,
                captcha:null
            };

            //初次获取验证码
            $scope.getCode();

        };

        //获取验证码
        $scope.getCode=()=>{
            let lang="";
            switch($rootScope.lang){
                case "zh-cn":lang="zh_CN";break;
                case "en-us":lang="en_US";break;
            }
            var codeImg = document.getElementById("codeImg");
            codeImg.src=commonMethod.getServerUrl()+"/rest/v1/generate/captcha?language="+lang+"&rad="+Math.random();
        };

        //登录
        $scope.login=()=>{
            // key为16位由用户名跟验证码拼接
            let key="";
            for(let i=0;i<12;i++){
                if($scope.item.userName[i])key+=$scope.item.userName[i];
                else key+="1";
            }
            key+=$scope.item.captcha;

            let url=commonMethod.getServerUrl()+"/rest/v1/login";
            let obj={
                userName:$scope.item.userName,
                password:encodeAES(key,$scope.item.password),
                captcha:$scope.item.captcha,
                locale:$rootScope.lang.split("-")[0]+"_"+$rootScope.lang.split("-")[1].toUpperCase()
            };
            $http.post(url,obj,{headers:{page:"login"}}).then(({data})=>{
                if(data.success){
                    try{
                        let menu=data.data.menu.children;
                        loginService.setMenu(menu);
                    }catch(e){
                        $scope.errMessage=$translate.instant("noMenu");
                        return false
                    }
                    
                    let token=data.data.token;
                    loginService.setToken(token);
                    loginService.setLoginFlag(true);
                    //保存用户名和密码
                    sessionStorage.setItem("userName",obj.userName);
                    sessionStorage.setItem("password",$scope.item.password);
                    sessionStorage.setItem("userId",data.data.id);

                    $state.go("index");

                }else{
                    $scope.getCode();//重新获取验证码
                    $scope.item.captcha=null;
                    $(".code_ipt input").focus();
                    $scope.errMessage=data.displayMessage||data.errorMessage;
                }

            });
      
        };

        //切换语言
        $scope.changeLang=async lang=>{
            if(lang!=$rootScope.lang){ 
                let newLang=lang.split("-")[0]+"_"+lang.split("-")[1].toUpperCase();
                let url=commonMethod.getServerUrl()+"/rest/v1/setLoginLanguage?language="+newLang;
                let {data}=await $http.get(url,{headers:{noLoading:true,page:"login"}});
                if(data.success){
                    if(data.data.available_locales&&data.data.available_locales.length>0){
                        $scope.langList=data.data.available_locales.separate(2).map(value=>{
                            let lang=value[0].toLowerCase().replace("_","-");
                            return {lang,name:value[1]}
                        });
                        sessionStorage.setItem("langList",JSON.stringify($scope.langList));
                    }
                    
                    sessionStorage.setItem('lang',lang);
                    $rootScope.lang=lang;
                    $translate.use(lang);
                    $scope.getCode();//重新获取验证码
                }
                
            }
            
        };

        $scope.init();

        //监听键盘事件
        $(document).on("keydown",(event)=>{
            let e=event||window.event;
            let code=e.keyCode||e.which;
            if(code==13){//确定键
                $(".btn1:not(:disabled)").click();
            }

        });
        
    };
    module.exports=loginCtrl;


})(angular.module("app"));