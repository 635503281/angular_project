(function(app){
    "use strict";

    app.controller("cpEditCtrl",cpEditCtrl);
    cpEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod"];
    function cpEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            //CP优先级
            $scope.priorityList=[
                {id:0,name:$translate.instant("priority_0")},
                {id:1,name:$translate.instant("priority_1")},
                {id:2,name:$translate.instant("priority_2")}
            ];

            if($scope.id==0){//添加

                $scope.item={
                    cpId:null,//CP标识
                    name:null,//名称
                    address:null,//地址
                    contactName:null,//联系人名称
                    phone:null,//电话
                    isSign:false,//签约客户
                    priority:0,
                    domainList:[{domainName:null}],//域名列表{domainName:null}
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/getCp?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                        
                    };
                    
                }).catch((err)=>{});
            }

        };
        
        //添加域名
        $scope.addDomain=()=>{
            $scope.item.domainList.push({domainName:null});
        };

        //删除域名
        $scope.delDomain=(index)=>{
            $scope.item.domainList.splice(index,1);
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/addCp";
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/modifyCp";

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }

            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.domainManagement.list",{currentTab:1,flag:1});
        };

        $scope.init();

    };
    module.exports=cpEditCtrl;

})(angular.module("app"));