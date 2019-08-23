(function(app){
    'use strict';

    app.controller("ipDatabaseCtrl",ipDatabaseCtrl);
    ipDatabaseCtrl.$inject=['$scope','$rootScope','$state'];
    function ipDatabaseCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.strategy.ipDatabase.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=ipDatabaseCtrl;


})(angular.module("app"));