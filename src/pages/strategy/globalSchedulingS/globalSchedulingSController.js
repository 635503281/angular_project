(function(app){
    'use strict';

    app.controller("globalSchedulingSCtrl",globalSchedulingSCtrl);
    globalSchedulingSCtrl.$inject=['$scope','$rootScope','$state'];
    function globalSchedulingSCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.globalSchedulingS.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=globalSchedulingSCtrl;


})(angular.module("app"));