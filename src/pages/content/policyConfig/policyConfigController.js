
(function(app){
    'use strict';

    app.controller("policyConfigCtrl",policyConfigCtrl);
    policyConfigCtrl.$inject=['$scope','$rootScope','$state'];
    function policyConfigCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=function(){
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.content.policyConfig.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=policyConfigCtrl;


})(angular.module("app"));