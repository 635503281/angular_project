
(function(app){
    'use strict';

    app.controller("badInfoCtrl",badInfoCtrl);
    badInfoCtrl.$inject=['$scope','$rootScope','$state'];
    function badInfoCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.content.badInfo.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=badInfoCtrl;


})(angular.module("app"));