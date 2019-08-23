(function(app){
    "use strict";

    app.controller("blackWhiteListEditCtrl",blackWhiteListEditCtrl);
    blackWhiteListEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","nodeService","cpService"];
    function blackWhiteListEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,nodeService,cpService){


        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            //名单类型
            $scope.typeList=[
                {id:0,name:$translate.instant("whiteList")},
                {id:1,name:$translate.instant("blackList")},
            ]

            if($scope.id==0){//添加

                $scope.item={
                    tcsIpListType:0,//类型
                    host:null,//域名
                    ipv4list:null,
                    ipv6list:null
                };
                $scope.ipv4Viewlist=[];
                $scope.ipv6Viewlist=[];
                
            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/getTCSIpBlackWhiteList";
                $http.post(url,{id:$scope.id}).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data.list[0];
                        //处理数据
                        if($scope.item.ipv4list){
                            $scope.ipv4Viewlist=$scope.item.ipv4list.split("|").map(value=>{
                                let list=value.split("-");
                                return{ipStart:list[0],ipEnd:list[1]}
                            })
                        }else{
                            $scope.ipv4Viewlist=[];
                        }
                        if($scope.item.ipv6list){
                            $scope.ipv6Viewlist=$scope.item.ipv6list.split("|").map(value=>{
                                let list=value.split("-");
                                return{ipStart:list[0],ipEnd:list[1]}
                            })
                        }else{
                            $scope.ipv6Viewlist=[];
                        }

                    };
                    
                }).catch((err)=>{});
            }

        };


        //添加ipv4地址
        $scope.addIpv4list=()=>{
            $scope.ipv4Viewlist.push({ipStart:null,ipEnd:null});
        };

        //删除ipv4地址
        $scope.delIpv4list=(i,event)=>{
            commonMethod.listDelTip($translate.instant("isDelete"),event.target).then(function(){
                $scope.ipv4Viewlist.splice(i,1);
            });
        };

        //添加ipv6地址
        $scope.addIpv6list=()=>{
            $scope.ipv6Viewlist.push({ipStart:null,ipEnd:null});
        };

        //删除ipv6地址
        $scope.delIpv6list=(i,event)=>{
            commonMethod.listDelTip($translate.instant("isDelete"),event.target).then(function(){
                $scope.ipv6Viewlist.splice(i,1);
            });
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/addTCSIpBlackWhiteList";
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/modifyTCSIpBlackWhiteList";

            //处理数据
            $scope.item.ipv4list=$scope.ipv4Viewlist.map(({ipStart,ipEnd})=>ipStart+'-'+ipEnd).join("|");
            $scope.item.ipv6list=$scope.ipv6Viewlist.map(({ipStart,ipEnd})=>ipStart+'-'+ipEnd).join("|");
            $scope.item.ipv4list=$scope.item.ipv4list?$scope.item.ipv4list:null;
            $scope.item.ipv6list=$scope.item.ipv6list?$scope.item.ipv6list:null;

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.blackWhiteList.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=blackWhiteListEditCtrl;

})(angular.module("app"));