(function(app){
    'use strict';

    app.controller("areaSchedulingSCtrl",areaSchedulingSCtrl);
    areaSchedulingSCtrl.$inject=['$scope','$rootScope','$state'];
    function areaSchedulingSCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.areaSchedulingS.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=areaSchedulingSCtrl;


})(angular.module("app"));