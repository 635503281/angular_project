(function(app){
    'use strict';

    app.controller("localSchedulingSCtrl",localSchedulingSCtrl);
    localSchedulingSCtrl.$inject=['$scope','$rootScope','$state'];
    function localSchedulingSCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.localSchedulingS.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=localSchedulingSCtrl;


})(angular.module("app"));