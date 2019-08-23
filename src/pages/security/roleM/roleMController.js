
(function(app){
    'use strict';

    app.controller("roleMCtrl",roleMCtrl);
    roleMCtrl.$inject=['$scope','$rootScope','$state'];
    function roleMCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.security.roleM.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=roleMCtrl;


})(angular.module("app"));