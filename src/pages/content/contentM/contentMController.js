(function(app){
    "use strict";

    app.controller("contentMCtrl",contentMCtrl);
    contentMCtrl.$inject=['$scope','$rootScope','$state'];
    function contentMCtrl($scope,$rootScope,$state){
        
        //初始化
        $scope.init=()=>{
           
            //三级菜单
            $rootScope.currentThirdMenuUrl=sessionStorage.getItem("currentThirdMenuUrl")||"index.content.contentM.list";

            //默认跳转
            $state.go($rootScope.currentThirdMenuUrl);
           
        };

        
        
        

        $scope.init();
    };
    module.exports=contentMCtrl;

})(angular.module("app"));