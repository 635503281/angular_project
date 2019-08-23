
(function(app){
    "use strict";

    app.controller("contentCtrl",contentCtrl);
    contentCtrl.$inject=['$scope','$state','$rootScope','menuService'];
    function contentCtrl($scope,$state,$rootScope,menuService){
        //初始化
        $scope.init=function(){
            //默认二级菜单，刷新还是当前菜单
            let defaultSecondMenuUrl=menuService.getFSecondMenu("index.content");
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
    module.exports=contentCtrl;

})(angular.module('app'));