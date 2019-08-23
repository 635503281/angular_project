(function(app){
    "use strict";

    app.controller("globalSchedulingSEditCtrl",globalSchedulingSEditCtrl);
    globalSchedulingSEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","nodeService"];
    function globalSchedulingSEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,nodeService){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);
            
            //策略list
            $scope.policyList=[
                {id:0,name:$translate.instant("policy_t0")},
                {id:1,name:$translate.instant("policy_t1")},
                {id:2,name:$translate.instant("policy_t2")},
                {id:3,name:$translate.instant("policy_t3")},
                {id:4,name:$translate.instant("policy_t4")},
                {id:5,name:$translate.instant("policy_t5")}
            ];

            //状态
            $scope.statusList=[
                {id:0,name:$translate.instant("status_0")},
                {id:1,name:$translate.instant("status_1")}
            ];

            //LTC节点列表
            $scope.ltcNodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getNodeList([7,12]).then(list=>{
                $scope.ltcNodeList=list;
            });
            

            //CCS节点列表
            $scope.ccsNodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getCCSNodeList().then(list=>{
                $scope.ccsNodeList=list;
            });
            

            //SNS节点列表
            $scope.snsNodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getSNSNodeList().then(list=>{
                $scope.snsNodeList=list;
            });
            
            
            //群组列表(二维数组)
            $scope.ltcGroupList=[[nodeService.defaultGroup]];
            $scope.ccsGroupList=[[nodeService.defaultGroup]];
            $scope.snsGroupList=[[nodeService.defaultGroup]];
            
            if($scope.id==0){//添加

                $scope.item={
                    domain:null,//域名
                    status:0,//状态
                    ttl:-1,//域名的TTL设置 -1：代表使用全局TTL配置  >=0：TTL值，单位为秒
                    policy:0,//调度策略
                    ltcNodes:[],//边缘节点列表{nodeID:null,dispatchGroupID:null}
                    ccsNodes:[{nodeID:null,dispatchGroupID:null}],//内容中心列表{nodeID:null,dispatchGroupID:null}
                    snsNodes:[{nodeID:null,dispatchGroupID:null,weight:null}],//边缘节点列表{nodeID:null,dispatchGroupID:null,weight:null}           
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/get?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;

                        //获取分组列表
                        if($scope.item.ltcNodes){
                            for(let {nodeID} of $scope.item.ltcNodes){
                                $scope.getGroupByNode(nodeID,'LTC');
                            }
                        }else{
                            $scope.item.ltcNodes=[];
                        }
                        
                        if($scope.item.ccsNodes){
                            for(let {nodeID} of $scope.item.ccsNodes){
                                $scope.getGroupByNode(nodeID,'CCS');
                            }
                        }else{
                            $scope.item.ccsNodes=[];
                        }

                        if($scope.item.snsNodes){
                            for(let {nodeID} of $scope.item.snsNodes){
                                $scope.getGroupByNode(nodeID,'SNS');
                            }
                        }else{
                            $scope.item.snsNodes=[];
                        }
                        
                    };
                    
                }).catch((err)=>{});
            }

        };
        
        //添加LTC节点
        $scope.addLTCNode=()=>{
            $scope.item.ltcNodes.push({nodeID:null,dispatchGroupID:null});
        };

        //删除LTC节点
        $scope.delLTCNode=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDeleteConfig"),event.target).then(function(){
                $scope.item.ltcNodes.splice(index,1);
            });
            
        };

        //添加内容中心
        $scope.addCCSNode=()=>{
            $scope.item.ccsNodes.push({nodeID:null,dispatchGroupID:null});
        };

        //删除内容中心
        $scope.delCCSNode=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDeleteConfig"),event.target).then(function(){
                $scope.item.ccsNodes.splice(index,1);
            });
            
        };

        //添加边缘节点
        $scope.addSNSNode=()=>{
            $scope.item.snsNodes.push({nodeID:null,dispatchGroupID:null,weight:null});
        };

        //删除边缘节点
        $scope.delSNSNode=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDeleteConfig"),event.target).then(function(){
                $scope.item.snsNodes.splice(index,1);
            });
            
        };

        //获取分组列表方法
        $scope.getGroupByNode=(nodeID,type)=>{

            if(nodeID){
                nodeService.getGroupByNode(nodeID).then(list=>{
                    if(type=="SNS")
                        $scope.snsGroupList[nodeID]= list;
                    else if(type=="CCS")
                        $scope.ccsGroupList[nodeID]= list;
                    else if(type=="LTC")
                        $scope.ltcGroupList[nodeID]= list;
                });
            }else{
                $scope.snsGroupList[0]=[nodeService.defaultGroup];
                $scope.ccsGroupList[0]=[nodeService.defaultGroup];
                $scope.ltcGroupList[0]=[nodeService.defaultGroup];
            }
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/add";
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/edit";

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.globalSchedulingS.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=globalSchedulingSEditCtrl;

})(angular.module("app"));