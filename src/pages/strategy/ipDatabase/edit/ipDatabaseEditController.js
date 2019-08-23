(function(app){
    "use strict";

    app.controller("ipDatabaseEditCtrl",ipDatabaseEditCtrl);
    ipDatabaseEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","nodeService"];
    function ipDatabaseEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,nodeService){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            //SNS节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getSNSNodeList().then(list=>{
                $scope.nodeList=list;
            });
            

            if($scope.id==0){//添加
               //初始配置
                $scope.item={
                    nodeID:null,//节点
                    ipList:[{startIp:null,endIp:null}],//{startIp:null,endIp:null}
                    ipv6List:[],//{startIp:null,endIp:null}
                
                }; 
                      
            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/get?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        let result=data.data;
                        //解析数据
                        $scope.item={
                            id:result.id,
                            nodeID:result.nodeID,
                            ipList:result.ip?result.ip.split("|").map(value=>{return{
                                startIp:value.split("-")[0],
                                endIp:value.split("-")[1]
                            }}):[],
                            ipv6List:result.ipv6?result.ipv6.split("|").map(value=>{return{
                                startIp:value.split("-")[0],
                                endIp:value.split("-")[1]     
                            }}):[]
                        };
                        
                    }

                }).catch(err=>{});

            }

        };
        
        //添加ip
        $scope.addIp=()=>{
            $scope.item.ipList.push({startIp:null,endIp:null});
        };

        //删除ip
        $scope.delIp=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDeleteConfig"),event.target).then(function(){
                $scope.item.ipList.splice(index,1);
            });
        };

        //添加ipv6
        $scope.addIpv6=()=>{
            $scope.item.ipv6List.push({startIp:null,endIp:null});
        };

        //删除ipv6
        $scope.delIpv6=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDeleteConfig"),event.target).then(function(){
                $scope.item.ipv6List.splice(index,1);
            });
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/add";
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/edit";
            //判断IP范围
            let hasInvalidIPRange = false;
            for(let{startIp,endIp} of $scope.item.ipList) {
                if (!isValidIpAddressRange(startIp, endIp)) {
                    hasInvalidIPRange = true;
                    break;
                }
            }
            if(hasInvalidIPRange){
                commonMethod.layuiTip($translate.instant("IPRangeTip"),"notice");
                return
            }

            //判断IPv6范围
            let hasInvalidIPv6Range = false;
            for(let{startIp,endIp} of $scope.item.ipv6List) {
                if (!isValidIpv6AddressRange(startIp, endIp)) {
                    hasInvalidIPv6Range = true;
                    break;
                }
            }
            if(hasInvalidIPv6Range) {
                commonMethod.layuiTip($translate.instant("IPv6RangeTip"),"notice");
                return
            }

            //处理数据
            let obj={
                id:$scope.item.id,
                nodeID:$scope.item.nodeID,
                ip:$scope.item.ipList.map(value=>value.startIp+"-"+value.endIp).join("|"),
                ipv6:$scope.item.ipv6List.map(value=>value.startIp+"-"+value.endIp).join("|")
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
            $state.go("index.strategy.ipDatabase.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=ipDatabaseEditCtrl;

})(angular.module("app"));