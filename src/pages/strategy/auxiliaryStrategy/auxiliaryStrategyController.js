(function(app){
    'use strict';

    app.controller("auxiliaryStrategyCtrl",auxiliaryStrategyCtrl);
    auxiliaryStrategyCtrl.$inject=['$scope','$rootScope','$state'];
    function auxiliaryStrategyCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.auxiliaryStrategy.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=auxiliaryStrategyCtrl;


})(angular.module("app"));