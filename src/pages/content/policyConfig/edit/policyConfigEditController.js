(function(app){
    "use strict";

    app.controller("policyConfigEditCtrl",policyConfigEditCtrl);
    policyConfigEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","cpService","nodeService"];
    function policyConfigEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,cpService,nodeService){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);
            //类型 1-注入 2-分发 3-同步
            $scope.type=parseInt($stateParams.type);

            //获取cp列表
            $scope.cpList=[{cpId:null,name:$translate.instant("nothing")}];
            cpService.getCpList().then(list=>{
                $scope.cpList=list;
            });

            //策略类型
            $scope.policyTypeList=[
                {id:0,name:$translate.instant("policyType_0")},
                {id:1,name:$translate.instant("injectPolicy")}
            ];

            switch($scope.type){
                case 2://SNS分发节点
                    $scope.policyTypeList[1].name=$translate.instant("distributePolicy");
                    nodeService.getSNSNodeList().then(list=>{$scope.distributeNodeList=list.mapp((value,i)=>{if(i!=0)return value});});
                break;
                case 3://CCS同步节点
                    $scope.policyTypeList[1].name=$translate.instant("synchroPolicy");
                    nodeService.getCCSNodeList().then(list=>{$scope.syncNodeList=list.mapp((value,i)=>{if(i!=0)return value});});
                break;
            }
          
            let defaultItem={
                policyType:1,//策略类型 
                cpId:null,//cpId
                url:null,//url
                domain:null,//域名
                fileType:null,//文件类型
                effectiveTime:null,//有效期
                injectType:"0",//注入类型 0-立即注入 1-延时注入 2-定时注入
                delayedHours:null,//延迟时间
                dailyTime:null,//定时时间
                // dailyStartTime:null,//定时开始时间
                // dailyEndTime:null,//定时结束时间
                distributeNodes:[],//分发节点
                syncNodes:[],//同步节点
            };

            if($scope.id==0){//添加
                $scope.item=defaultItem;
                   
            }else{//修改

                $scope.findItem({id:$scope.id},$scope.type).then(item=>{
                    if(item){
                        //处理数据
                        if(item.startTime){
                            item.effectiveTime=new Date(item.startTime).format("yyyy-MM-dd hh:mm:ss") +" ~ "+ new Date(item.endTime).format("yyyy-MM-dd hh:mm:ss");
                        }
                        if(item.dailyStartTime){
                            item.dailyTime=new Date(item.dailyStartTime).format("hh:mm:ss")+" ~ "+new Date(item.dailyEndTime).format("hh:mm:ss");
                            item.injectType="2";
                        }else if(item.delayedHours!=null)item.injectType="1";
                        else item.injectType="0";

                        if(item.distributeNodes&&item.distributeNodes.length>0){
                            item.distributeNodes=item.distributeNodes.map(value=>value.nodeID);
                        }else{  
                            item.distributeNodes=[];
                        }
                        if(item.syncNodes&&item.syncNodes.length>0){
                            item.syncNodes=item.syncNodes.map(value=>value.nodeID);
                        }else{  
                            item.syncNodes=[];
                        }

                        $scope.item=item; 
                        $scope.$apply();

                    }else $scope.item=defaultItem;

                },err=>{});
               
            }

        };

        //保存
        $scope.save=async ()=>{
            //处理数据
            var obj=angular.copy($scope.item);
            obj.startTime=obj.effectiveTime?new Date(obj.effectiveTime.split(" ~ ")[0]).getTime():null,
            obj.endTime=obj.effectiveTime?new Date(obj.effectiveTime.split(" ~ ")[1]).getTime():null,
            delete obj.effectiveTime;

            switch(obj.injectType){
                case "1": obj.dailyTime=null;break;
                case "2": obj.delayedHours=null;break;
                default: obj.dailyTime=null,obj.delayedHours=null;break;
            }
            delete obj.injectType;

            if(obj.policyType==0){
                obj.cpId=null;
                obj.url=null;
                obj.domain=null;
                obj.fileType=null;
            }

            let url=commonMethod.getServerUrl();
            switch($scope.type){
                case 1://注入
                    url+="/rest/content/addContentInjectPolicy";//添加
                    if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/content/modifyContentInjectPolicy";//修改

                    obj.dailyStartTime=obj.dailyTime?new Date("2000-01-01 "+obj.dailyTime.split(" ~ ")[0]).getTime():null;
                    obj.dailyEndTime=obj.dailyTime?new Date("2000-01-01 "+obj.dailyTime.split(" ~ ")[1]).getTime():null;
                    delete obj.dailyTime;

                    delete obj.distributeNodes;
                    delete obj.syncNodes;

                break;
                case 2://分发
                    url+="/rest/content/addContentDistributePolicy";//添加
                    if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/content/modifyContentDistributePolicy";//修改

                    delete obj.delayedHours;
                    delete obj.dailyTime;
                    delete obj.syncNodes;
                break;
                case 3://同步
                    url+="/rest/content/addContentSyncPolicy";//添加
                    if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/content/modifyContentSyncPolicy";//修改

                    delete obj.delayedHours;
                    delete obj.dailyTime;
                    delete obj.distributeNodes;
                break;
            }

            //只能添加一个默认策略 先查询有没有默认策略
            if($scope.id==0){
                var item=await $scope.findItem({policyType:0},$scope.type);
                if(item&&obj.policyType==0){
                    commonMethod.layuiTip($translate.instant("default_policy_exist"),"notice");
                    return
                }
            }
            
            $http.post(url,obj).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //查找
        $scope.findItem=(obj,type=$scope.type)=>{
            obj=Object.assign({first:0,max:10},obj);
            return new Promise((resolve,reject)=>{
                let url=commonMethod.getServerUrl();
                switch(type){
                    case 1:url+="/rest/content/getContentInjectPolicy";break;
                    case 2:url+="/rest/content/getContentDistributePolicy";break;
                    case 3:url+="/rest/content/getContentSyncPolicy";break;
                }

                $http.post(url,obj).then(({data})=>{
                    if(data.success&&data.data.list.length>0){
                        resolve(data.data.list[0]);
                    }else{
                        resolve(null);
                    }

                }).catch(err=>{});
            
            })
        };

        //取消
        $scope.return=()=>{
            $state.go("index.content.policyConfig.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=policyConfigEditCtrl;

})(angular.module("app"));