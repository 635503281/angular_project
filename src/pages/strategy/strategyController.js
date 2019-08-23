
(function(app){
    "use strict";

    app.controller("strategyCtrl",strategyCtrl);
    strategyCtrl.$inject=["$scope","$rootScope","$state",'menuService'];
    function strategyCtrl($scope,$rootScope,$state,menuService){
        //初始化
        $scope.init=()=>{
            //默认二级菜单，刷新还是当前菜单
            let defaultSecondMenuUrl=menuService.getFSecondMenu("index.strategy");
            let currentFirstMenuUrl=sessionStorage.getItem("currentFirstMenuUrl");
            let oldSecondMenuUrl=sessionStorage.getItem("currentSecondMenuUrl");
            if(currentFirstMenuUrl&&oldSecondMenuUrl&&oldSecondMenuUrl.split(".")[1]==currentFirstMenuUrl.split(".")[1]){
                defaultSecondMenuUrl=oldSecondMenuUrl;
            }
            
            //当前二级菜单
            $rootScope.currentSecondMenuUrl= defaultSecondMenuUrl;

            //默认跳转
            $state.go($rootScope.currentSecondMenuUrl);
           
        };

        
        
        

        $scope.init();

    };
    module.exports=strategyCtrl;

})(angular.module("app"));