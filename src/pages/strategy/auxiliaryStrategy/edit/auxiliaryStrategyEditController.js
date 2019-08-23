(function(app){
    "use strict";

    app.controller("auxiliaryStrategyEditCtrl",auxiliaryStrategyEditCtrl);
    auxiliaryStrategyEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","publicService","cpService"];
    function auxiliaryStrategyEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,publicService,cpService){
        //域名显示alias，传domainName
        const defaultDomain={domainName:null,alias:$translate.instant("nothing")};

        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);
            
            //优先级
            $scope.priorityList=[
                {id:0,name:$translate.instant("priority_b")},
                {id:1,name:$translate.instant("priority_f")},
            ];

            //类型
            $scope.typeList=[
                {id:1,name:$translate.instant("staticResource")},
                {id:2,name:$translate.instant("dynamicResource")},
                {id:3,name:"cname"},
                {id:4,name:"NS"}
            ];

            //CP列表
            $scope.cpList=[{cpId:null,name:$translate.instant("nothing")}];
            cpService.getCpList().then(list=>{
                $scope.cpList=list;
            });

            //域名列表
            $scope.domainList=[defaultDomain];

            if($scope.id==0){//添加

                $scope.item={
                    domain:null,
                    cpId:null,
                    priority:0,
                    type:1,
                    staticIP:null,
                    staticIPv6:null,
                    dynamicIP:null,
                    dynamicIPv6:null,
                    cname:null,
                    nameserverIP:null,
                    ipList:[],
                    ipv6List:[],
   
                }
                $scope.ipViewList=[];
                $scope.ipv6ViewList=[];

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/getTCSAuxiliaryPolicy";
                $http.post(url,{id:$scope.id}).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data.list[0];
                        //获取域名列表
                        $scope.getDomainByCp($scope.item.cpId);
                        //处理数据
                        if($scope.item.ipList){
                            // $scope.ipViewList=$scope.item.ipList.split("|").map(value=>{
                            //     let list=value.split("-");
                            //     return{ipStart:list[0],ipEnd:list[1]}
                            // })
                            $scope.ipViewList=$scope.item.ipList.split("|").map(value=>{
                                return {ip:value}
                            });

                        }else{
                            $scope.ipViewList=[]; 
                        }
                        if($scope.item.ipv6List){
                            // $scope.ipv6ViewList=$scope.item.ipv6List.split("|").map(value=>{
                            //     let list=value.split("-");
                            //     return{ipStart:list[0],ipEnd:list[1]}
                            // })
                            $scope.ipv6ViewList=$scope.item.ipv6List.split("|").map(value=>{
                                return {ip:value}
                            });
                        }else{
                            $scope.ipv6ViewList=[]; 
                        }
                        
                    };
                    
                }).catch((err)=>{});
            }

        };

        //获取域名列表的方法
        $scope.getDomainByCp=(cpId)=>{
            if(cpId){
                cpService.getDomainByCp(cpId).then(list=>{
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

        //type切换
        $scope.changeType=(type)=>{
            if($scope.id==0 && (type==3||type==4)){
                $scope.item.nameserverIP = "";
            }
        }
        
        //添加IP地址段
        $scope.addIpv4=()=>{ 
            // $scope.ipViewList.push({ipStart:null,ipEnd:null});
            $scope.ipViewList.push({ip:null});
        };

        //删除IP地址段
        $scope.delIpv4=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDelete"),event.target).then(function(){
                $scope.ipViewList.splice(index,1);
            });
        };

        //添加IPV6地址段
        $scope.addIpv6=()=>{ 
            // $scope.ipv6ViewList.push({ipStart:null,ipEnd:null});
            $scope.ipv6ViewList.push({ip:null});
        };

        //删除IPV6地址段
        $scope.delIpv6=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDelete"),event.target).then(function(){
                $scope.ipv6ViewList.splice(index,1);
            });
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/addTCSAuxiliaryPolicy";//添加
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/modifyTCSAuxiliaryPolicy";//修改
            
            //处理数据
            switch($scope.item.type){
                case 1:
                    $scope.item.dynamicIP=null;
                    $scope.item.dynamicIPv6=null;
                    $scope.item.cname=null;
                    $scope.item.nameserverIP=null;
                break;
                case 2:
                    $scope.item.staticIP=null;
                    $scope.item.staticIPv6=null;
                    $scope.item.cname=null;
                    $scope.item.nameserverIP=null;
                break;
                case 3:
                    $scope.item.staticIP=null;
                    $scope.item.staticIPv6=null;
                    $scope.item.dynamicIP=null;
                    $scope.item.dynamicIPv6=null;    
                break;
                case 4:
                    $scope.item.staticIP=null;
                    $scope.item.staticIPv6=null;
                    $scope.item.dynamicIP=null;
                    $scope.item.dynamicIPv6=null;
                    $scope.item.cname=null;
                break;
            }
            // $scope.item.ipList=$scope.ipViewList.map(({ipStart,ipEnd})=>ipStart+'-'+ipEnd).join("|");
            // $scope.item.ipv6List=$scope.ipv6ViewList.map(({ipStart,ipEnd})=>ipStart+'-'+ipEnd).join("|");
            $scope.item.ipList=$scope.ipViewList.map(({ip})=>ip).join("|");
            $scope.item.ipv6List=$scope.ipv6ViewList.map(({ip})=>ip).join("|");
            $scope.item.ipList=$scope.item.ipList?$scope.item.ipList:null;
            $scope.item.ipv6List=$scope.item.ipv6List?$scope.item.ipv6List:null;
            

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }

            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.strategy.auxiliaryStrategy.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=auxiliaryStrategyEditCtrl;

})(angular.module("app"));