(function(app){
    'use strict';

    app.controller("domainManagementCtrl",domainManagementCtrl);
    domainManagementCtrl.$inject=['$scope','$rootScope','$state'];
    function domainManagementCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.domainManagement.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=domainManagementCtrl;


})(angular.module("app"));