(function(app){
    "use strict";

    app.controller("areaSchedulingSEditCtrl",areaSchedulingSEditCtrl);
    areaSchedulingSEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","publicService","nodeService"];
    function areaSchedulingSEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,publicService,nodeService){
        const defaultGroupIP={id:null,serviceVIPAddr:$translate.instant("nothing")};
        const defaultGroup={groupID:null,groupName:$translate.instant("nothing")};
        const defaultNode={nodeID:null,nodeName:$translate.instant("nothing")};
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);
            
            //策略list
            $scope.policyList=[
                {id:0,name:$translate.instant("policy_t0")},
                {id:1,name:$translate.instant("policy_t4")},
                {id:2,name:$translate.instant("policy_t6")}
            ];

            //省份list
            $scope.provinceList=publicService.provinceList;

            //重定向URL格式list
            $scope.redirectFormatList=[
                {id:"1",name:$translate.instant("redirectFormat_t1")},
                {id:"2",name:$translate.instant("redirectFormat_t2")}
            ];

            //SNS节点列表
            $scope.nodeList=[defaultNode];
            nodeService.getSNSNodeList().then(list=>{
                $scope.nodeList=list;
            });

            //群组列表(二维数组)
            $scope.groupList=[[defaultGroup]];
  
            //群组ip列表(二维数组)
            $scope.groupIPList=[[defaultGroupIP]];//[defaultGroupIP]

            if($scope.id==0){//添加

                $scope.item={
                    province:null,//省份
                    domain:null,//域名
                    policy:0,//策略
                    redirectFormat:"1",//重定向URL格式 "1"-用目标Host替换原始Host "2"-在原始Host前面插入目标Host
                    clients:[],//IP地址段列表 {ipAddr:null,mask:null,ipv6Addr:null}
                    nodes:[{nodeID:null,groupID:null,groupIP:null,groupIPv6:null,port:null,serviceId:null}],//节点相关信息{nodeID:null,groupID:null,groupIP:null,groupIPv6:null,port:null,serviceId:null}
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/get?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                        
                        //页面回显
                        $scope.item.nodes.map((value,index)=>{
                            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/nodeInfo/getNodeDispatchInfoByNodeId?nodeID="+value.nodeID;
                            $http.get(url,{headers:{Timestamp:(Date.now()+index).toString(),noLoading:true}}).then(({data})=>{
                                if(data.success){
                                    let list=data.data.list;
                                    if(!list)list=[];
                                    list.unshift(defaultGroup);
                                    $scope.groupList[index]=list;

                                    for(let {groupID,serviceList} of $scope.groupList[index]){
                                        if(value.groupID==groupID){
                                            
                                            if(serviceList.length>0){
                                                //群组ip列表
                                                $scope.groupIPList[index]=serviceList;
                                                //循环判断生成serviceId
                                                serviceList.map(val=>{
                                                    if(val.serviceVIPAddr==value.groupIP&&val.serviceVIPv6Addr==value.groupIPv6&&val.servicePort==value.port){
                                                        value.serviceId=val.id
                                                    }
                                                })
    
                                                $scope.groupIPList[index].unshift(defaultGroupIP);     
                                                break;
                                            }
                                            
                                        }
                                    }

                                }else{
                                    $scope.groupList[index]=[defaultGroup];
                                }
            
                            }).catch(e=>{});
     
                        });
                        
                    };
                    
                }).catch((err)=>{});
            }

        };
        
        //获取群组
        $scope.getGroupByNode=(nodeID,index)=>{
            if(nodeID){
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/nodeInfo/getNodeDispatchInfoByNodeId?nodeID="+nodeID;
                $http.get(url,{headers:{noLoading:true}}).then(({data})=>{
                    if(data.success){
                        let list=data.data.list;
                        if(!list)list=[];
                        list.unshift(defaultGroup);
                        $scope.groupList[index]=list;
                    }else{
                        $scope.groupList[index]=[defaultGroup];
                    }

                }).catch(e=>{});
         
            }else{
                $scope.groupList[index]=[defaultGroup];
            }
            $scope.item.nodes[index].groupID=null;
            $scope.groupIPList[index]=[defaultGroupIP];
           
        };
        
        //获取群组ip列表
        $scope.getGroupIPList=(groupId,index)=>{
            if(groupId){
                for(let {groupID,serviceList} of $scope.groupList[index]){
                    if(groupId==groupID){
                        if(serviceList.length>0){
                            $scope.groupIPList[index]=[defaultGroupIP,...serviceList];
                            return
                        }
                        
                    }
                }
            }else{
                $scope.groupIPList[index]=[defaultGroupIP];
            }
        };

        //添加IP地址段
        $scope.addClient=()=>{ 
            $scope.item.clients.push({ipAddr:null,mask:null,ipv6Addr:null});
        };

        //删除IP地址段
        $scope.delClient=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDelete"),event.target).then(function(){
                $scope.item.clients.splice(index,1);
            });
            
        };

        //添加节点  
        $scope.addNode=()=>{
            $scope.groupList.push([defaultGroup]);
            $scope.groupIPList.push([defaultGroupIP]);
            $scope.item.nodes.push({nodeID:null,groupID:null,groupIP:null,groupIPv6:null,port:null,serviceId:null});

        };

        //删除节点
        $scope.delNode=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDeleteConfig"),event.target).then(function(){
                $scope.groupList.splice(index,1);
                $scope.groupIPList.splice(index,1);
                $scope.item.nodes.splice(index,1);
            });
     
        };

        //填充服务列表中的groupIP/groupIPv6/port
        $scope.fillService=(serviceId,index)=>{
            if(serviceId){
                for(let {id,serviceVIPAddr,serviceVIPv6Addr,servicePort} of $scope.groupIPList[index]){
                    if(id==serviceId){
                        $scope.item.nodes[index].groupIP=serviceVIPAddr;
                        $scope.item.nodes[index].groupIPv6=serviceVIPv6Addr;
                        $scope.item.nodes[index].port=servicePort;
                        return
                    }
                }

            }else{
                $scope.item.nodes[index].groupIP=null;
                $scope.item.nodes[index].groupIPv6=null;
                $scope.item.nodes[index].port=null;
            }
           
  
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/add";//添加
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/edit";//修改

            //域名与IP地址必填其一
            if(!$scope.item.domain&&$scope.item.clients.length==0){
                commonMethod.layuiTip($translate.instant("nodeORclient"),"notice");
                return
            }

            let obj=angular.copy($scope.item);
            //添加的时候传domainList
            if($scope.id==0){
                if(obj.domain)obj.domainList=obj.domain.trim().split(/\s+/);
                else obj.domainList=[];
                delete obj.domain
            };
            
            $http.post(url,obj).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.areaSchedulingS.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=areaSchedulingSEditCtrl;

})(angular.module("app"));