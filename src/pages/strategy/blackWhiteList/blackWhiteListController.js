(function(app){
    'use strict';

    app.controller("blackWhiteListCtrl",blackWhiteListCtrl);
    blackWhiteListCtrl.$inject=['$scope','$rootScope','$state'];
    function blackWhiteListCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.blackWhiteList.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=blackWhiteListCtrl;


})(angular.module("app"));