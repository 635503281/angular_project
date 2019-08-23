
(function(app){
    'use strict';

    app.controller("userMCtrl",userMCtrl);
    userMCtrl.$inject=['$scope','$rootScope','$state'];
    function userMCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.security.userM.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=userMCtrl;


})(angular.module("app"));