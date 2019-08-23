
(function(app){
    'use strict';

    const {encodeAES}=require("../../../js/jiami");

    app.controller("modifyPsdCtrl",modifyPsdCtrl);
    modifyPsdCtrl.$inject=['$scope','$http','$state','$translate','loginService','commonMethod'];
    function modifyPsdCtrl($scope,$http,$state,$translate,loginService,commonMethod){
        
        //初始化
        $scope.init=()=>{
           
            $scope.item={
                id:sessionStorage.getItem("userId"),//用户id
                prevPwd:null,//原密码
                newPwd:null,//新密码
            };
            $scope.name=sessionStorage.getItem("userName"),//用户名
            $scope.prevPwd=sessionStorage.getItem("password");//原密码
            $scope.confirmPassword=null;//确认密码

        };

        //修改
        $scope.modify=()=>{
            //生成16位的key
            let key="";
            for(let i=0;i<16;i++){
                if($scope.name[i])key+=$scope.name[i];
                else key+="1";
            }

            let url=commonMethod.getServerUrl()+"/rest/userManagement/user/modifyPwd";//修改
            //密码加密
            let obj={
                id:$scope.item.id,
                prevPwd:encodeAES(key,$scope.item.prevPwd),
                newPwd:encodeAES(key,$scope.item.newPwd)
            };
            $http.post(url,obj).then(({data})=>{
                if(data.success){
                    commonMethod.layuiTip($translate.instant("modifyPsd_S")).then(()=>loginService.exit());

                }
                
            }).catch((err)=>{});
            
        };
        
        $scope.init();
    };
    module.exports=modifyPsdCtrl;


})(angular.module("app"));