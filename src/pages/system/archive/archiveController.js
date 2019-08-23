
(function(app){
    'use strict';

    app.controller("archiveCtrl",archiveCtrl);
    archiveCtrl.$inject=['$scope','$rootScope','$state'];
    function archiveCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.system.archive.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=archiveCtrl;


})(angular.module("app"));