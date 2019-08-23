
(function(app){
    "use strict";

    app.controller("authenticationCtrl",authenticationCtrl);
    authenticationCtrl.$inject=['$scope','$state','$rootScope','menuService'];
    function authenticationCtrl($scope,$state,$rootScope,menuService){

        //初始化
        $scope.init=function(){
            //默认二级菜单，刷新还是当前菜单
            let defaultSecondMenuUrl= menuService.getFSecondMenu("index.authentication");
            let currentFirstMenuUrl=sessionStorage.getItem("currentFirstMenuUrl");
            let oldSecondMenuUrl=sessionStorage.getItem("currentSecondMenuUrl");
            if(currentFirstMenuUrl&&oldSecondMenuUrl&&oldSecondMenuUrl.split(".")[1]==currentFirstMenuUrl.split(".")[1]){
                defaultSecondMenuUrl=oldSecondMenuUrl;
            }
            
            //当前二级菜单
            $rootScope.currentSecondMenuUrl= defaultSecondMenuUrl;

            //默认跳转
            $state.go($rootScope.currentSecondMenuUrl);
        };
       
        $scope.init();
    };
    module.exports=authenticationCtrl;


})(angular.module("app"));