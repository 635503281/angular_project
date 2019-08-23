
(function(app){
    'use strict';

    app.controller("authorityCtrl",authorityCtrl);
    authorityCtrl.$inject=['$scope','$rootScope','$state'];
    function authorityCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.authentication.authority.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=authorityCtrl;


})(angular.module("app"));