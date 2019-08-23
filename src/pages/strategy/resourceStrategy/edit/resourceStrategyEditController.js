(function(app){
    "use strict";

    app.controller("resourceStrategyEditCtrl",resourceStrategyEditCtrl);
    resourceStrategyEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod"];
    function resourceStrategyEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);
            
            if($scope.id==0){//添加

                $scope.item={
                    domain:null,//域名
                    sourceList:[{sourceIP:null,sourceIPv6:null,port:null}],//回源地址列表{sourceIP:null,sourceIPv6:null,port:null}  
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/sourceStrategyConfig/get?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data[0];
                        
                    };
                    
                }).catch((err)=>{});
            }

        };
        
        //添加回源地址
        $scope.addSource=()=>{
            $scope.item.sourceList.push({sourceIP:null,sourceIPv6:null,port:null});
        };

        //删除回源地址
        $scope.delSource=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDeleteConfig"),event.target).then(function(){
                $scope.item.sourceList.splice(index,1);
            });   
        };


        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/sourceStrategyConfig/add";//添加
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/sourceStrategyConfig/modify";//修改

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.resourceStrategy.list",{currentTab:1});
        };

        $scope.init();

    };
    module.exports=resourceStrategyEditCtrl;

})(angular.module("app"));