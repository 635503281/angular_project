(function(app){
    "use strict";

    app.controller("domainEditCtrl",domainEditCtrl);
    domainEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","cpService"];
    function domainEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,cpService){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            //CP列表
            $scope.cpList=[{cpId:null,name:$translate.instant("nothing")}];
            cpService.getCpList().then(list=>{
                $scope.cpList=list;
             });

            if($scope.id==0){//添加
                $scope.item={
                    domainName:null,//域名
                    cpID:null,//CP标识
                    cpName:null,//CP名称
                    description:null
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/getDomain?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                        
                    };
                    
                }).catch((err)=>{});
            }

        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/addDomain";
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/modifyDomain";
         
            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.domainManagement.list",{currentTab:2,flag:1});
        };

        $scope.init();

    };
    module.exports=domainEditCtrl;

})(angular.module("app"));