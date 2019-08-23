(function(app){
    "use strict";

    app.controller("systemMEditCtrl",systemMEditCtrl);
    systemMEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod"];
    function systemMEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            if($scope.id==0){//添加

                $scope.item={
                    configType:null,
                    defaultValue:null,
                    desc:null,
                    enable:null,
                    key:null, 
                    name:null,
                    type:null,
                    value:null

                }
                $scope.return();

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/sysConfig/getSysConfigById?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                        
                    }
                    
                }).catch((err)=>{});
            }

        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/sysConfig/setSysConfig";//修改

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    commonMethod.layuiTip($translate.instant("modify_S")).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.system.systemM.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=systemMEditCtrl;

})(angular.module("app"));