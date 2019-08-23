
(function(app){
    'use strict';

    app.controller("badDomainCtrl",badDomainCtrl);
    badDomainCtrl.$inject=['$scope','$rootScope','$state'];
    function badDomainCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=function(){
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.system.systemM.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=badDomainCtrl;


})(angular.module("app"));