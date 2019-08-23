(function(app){
    "use strict";

    app.controller("localSchedulingSEditCtrl",localSchedulingSEditCtrl);
    localSchedulingSEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","publicService","nodeService","cpService"];
    function localSchedulingSEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,publicService,nodeService,cpService){

        //域名显示alias，传domainName
        const defaultDomain={domainName:null,alias:$translate.instant("nothing")};

        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);
            
            //名单类型
            $scope.typeList=[{id:0,name:$translate.instant("blacklist")},{id:1,name:$translate.instant("whitelist")}];

            //CP列表
            $scope.cpList=[{cpId:null,name:$translate.instant("nothing")}];
            cpService.getCpList().then(list=>{
                $scope.cpList=list;
            });

            //域名列表
            $scope.domainList=[defaultDomain];

            //SNS节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getSNSNodeList().then(list=>{
                $scope.nodeList=list;
            });

            //群组列表
            $scope.groupList=[nodeService.defaultGroup];
           
            if($scope.id==0){//添加

                $scope.item={
                    cpID:null,//CPID
                    domainName:null,//域名
                    nodeID:null,//节点
                    dispatchGroupID:null,//群组
                    type:0,//名单类型
                    validity:null//有效期
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/local/domain/get?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                        // 处理数据
                        $scope.getDomainByCp($scope.item.cpID);

                        //避免Timestamp相同
                        // setTimeout(function(){
                            $scope.item.dispatchGroupID=String($scope.item.dispatchGroupID);
                            $scope.getGroupByNode($scope.item.nodeID);
                        // },10);
                        
                    };
                    
                }).catch((err)=>{});
            }

        };

        //获取域名列表的方法
        $scope.getDomainByCp=(cpID)=>{
            if(cpID){
                cpService.getDomainByCp(cpID).then(list=>{
                    //处理domainlist数组
                    $scope.domainList= list.map((value,index)=>{
                        if(index==0){
                            value=defaultDomain;
                        }else{
                            value.alias=value.domainName;
                        }
                        return value
                    });

                });
            }else{
                $scope.domainList=[defaultDomain];
            }
        }
        //获取分组列表方法
        $scope.getGroupByNode=(nodeID)=>{
            if(nodeID){
                nodeService.getGroupByNode(nodeID).then(list=>{
                    $scope.groupList= list;
                });
            }else{
                $scope.groupList=[nodeService.defaultGroup];
            }
            
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/local/domain/add";
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/local/domain/edit";

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                };
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.localSchedulingS.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=localSchedulingSEditCtrl;

})(angular.module("app"));