
(function(app){
    'use strict';

    app.controller("safeChainCtrl",safeChainCtrl);
    safeChainCtrl.$inject=['$scope','$rootScope','$state'];
    function safeChainCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=function(){
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.authentication.safeChain.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=safeChainCtrl;


})(angular.module("app"));