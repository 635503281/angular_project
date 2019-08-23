(function(app){
    "use strict";

    app.controller("badDomainEditCtrl",badDomainEditCtrl);
    badDomainEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod"];
    function badDomainEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            if($scope.id==0){//添加

                $scope.item={
                    policyVersion:null,//策略的版本号
                    hostList:null,//网站名列表
                    redirectURL:null,//重定向url
                    bypassUrlParam:null,//放行URL参数关键字
                    bypassRefererHost:null,//放行Referer的host  

                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/domainRedirect/get?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                        
                    }
                    
                }).catch((err)=>{});
            }

        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/domainRedirect/add";//添加
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/domainRedirect/edit";//修改

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.content.badDomain.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=badDomainEditCtrl;

})(angular.module("app"));