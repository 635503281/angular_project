(function(app){
    'use strict';

    app.controller("globalSchedulingDCtrl",globalSchedulingDCtrl);
    globalSchedulingDCtrl.$inject=['$scope','$rootScope','$state'];
    function globalSchedulingDCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.globalSchedulingD.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=globalSchedulingDCtrl;


})(angular.module("app"));