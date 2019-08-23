(function(app){
    'use strict';

    app.controller("resourceStrategyCtrl",resourceStrategyCtrl);
    resourceStrategyCtrl.$inject=['$scope','$rootScope','$state'];
    function resourceStrategyCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.resourceStrategy.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=resourceStrategyCtrl;


})(angular.module("app"));