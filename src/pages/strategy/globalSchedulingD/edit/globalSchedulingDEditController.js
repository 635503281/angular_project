(function(app){
    "use strict";

    app.controller("globalSchedulingDEditCtrl",globalSchedulingDEditCtrl);
    globalSchedulingDEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","nodeService","cpService"];
    function globalSchedulingDEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,nodeService,cpService){

        //域名显示alias，传domainName
        const defaultDomain={domainName:null,alias:$translate.instant("nothing")};
        const defaultGroup={groupID:null,groupName:$translate.instant("nothing")};
        const defaultNode={nodeID:null,nodeName:$translate.instant("nothing")};

        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            //CP列表
            $scope.cpList=[{cpId:null,name:$translate.instant("nothing")}];
            cpService.getCpList().then(list=>{
                $scope.cpList=list;
            });

            //域名列表
            $scope.domainList=[defaultDomain];

            //群组list
            $scope.groupList=[defaultGroup];

            //获取SNS和ccs节点
            $scope.nodeList=[defaultNode];
            nodeService.getSCNodeList().then(list=>{
                $scope.nodeList=list;
            });

            if($scope.id==0){//添加

                $scope.item={
                    cpID:null,//cpID
                    domainList:[{domainName:null}],//域名
                    nodeID:null,//节点
                    groupID:null,//群组
                    
                };
                
            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/domain/get?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                        //获取域名列表
                        $scope.getDomainByCp($scope.item.cpID);
                        
                        //获取分组列表
                        $scope.getGroupByNode($scope.item.nodeID);
                        
                        

                    };
                    
                }).catch((err)=>{});
            }

        };

        //获取域名列表的方法
        $scope.getDomainByCp=(cpID)=>{
            if(cpID){
                cpService.getDomainByCp(cpID).then(list=>{
                    //处理域名列表
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
                $scope.groupList=[defaultGroup];
            }
            
        };

        //添加域名
        $scope.addDomain=()=>{
            $scope.item.domainList.push({domainName:null});
        };

        //删除域名
        $scope.delDomain=(i,event)=>{
            commonMethod.listDelTip($translate.instant("isDelete"),event.target).then(function(){
                $scope.item.domainList.splice(i,1);
            });    
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/domain/add";
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/domain/edit";

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.globalSchedulingD.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=globalSchedulingDEditCtrl;

})(angular.module("app"));