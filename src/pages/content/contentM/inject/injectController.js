(function(){
    "use strict";

    module.exports=["$scope","$rootScope","$state","$http","$translate","commonMethod","nodeService","contentService","cpService","ngDialog",
            function($scope,$rootScope,$state,$http,$translate,commonMethod,nodeService,contentService,cpService,ngDialog){

        //初始化
        $scope.init=()=>{
            
            //注入对象
            $scope.item={
                nodeId:null,//节点id

                responseType:null,//是否需要返回内容注入结果：0-不需要，1-需要，默认为0
                cpId:null,//CPID
              
                contentId:null,
                contentName:null,
                contentUrl:null,
                contentDir:null,
                flag:0,

                duration:null,//"时长"
                mimeType:null,//媒体类型
                bitRate:null,// 码率
                size:null,//大小
                resolution:null,//分辨率
                checkType:null,//需要校验文件内容时，需要指定，1-md5*/
                checkStr:null,//checkType==1填md5值
                systemId:null,//内容来源系统的ID
                contentType:null,//内容类型，1-点播，2-直播
                tsSupport:null,//ContentType=2，指定是否支持时移，0-不支持，1-支持
                beginTime:null,//tsSupport=1,开始录制时间
                endTime:null,//tsSupport=1,结束录制时间
                srcType:null,//ContentType=2,src类型1-单播，2-组播，3-SDP file
                isFloatIPQAM:null,//ContentType=2,指定是否是浮动频点：0-是，1-不是
                accessURL:null,//内容访问路径
                providerId:null,//内容提供商
                needDelivery:null,//内容是否需要分发 0-不需要， 1-需要
                serviceId:null,//内容源业务标识
                serviceType:null,//业务类型：1-宽带视频 2-IPTV视频
                mediaType:null,//媒体类型：0-电影，1-电视剧，2-视频新闻，3-视频栏目
                copyrightStart:null,//版权开始日期
                copyrightEnd:null,//版权结束日期

            };

            //内容url还是目录标记
            $scope.flagList=[
                {id:0,name:$translate.instant("contentUrl")},
                {id:1,name:$translate.instant("contentDir")}
            ];

            //CCS节点
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getCCSNodeList().then(list=>{$scope.nodeList=list;});

            //获取cp列表
            $scope.cpList=[{cpId:null,name:$translate.instant("nothing")}];
            cpService.getCpList().then(list=>{ $scope.cpList=list;});

            //是否返回注入结果list
            $scope.responseTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("noNeed")},{id:1,name:$translate.instant("need")}
            ];

            //校验文件内容
            $scope.checkTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:1,name:"md5"}
            ];

            //内容类型
            $scope.contentTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:1,name:$translate.instant("onDemand")},{id:2,name:$translate.instant("onLive")}
            ];

            //是否支持时移
            $scope.tsSupportList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("noSupport")},{id:1,name:$translate.instant("support")}
            ];

            //src类型
            $scope.srcTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:1,name:$translate.instant("unicast")},{id:2,name:$translate.instant("multicast")},{id:3,name:"SDP file"}
            ];

            //是否是浮动频点
            $scope.isFloatIPQAMList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("yes")},{id:1,name:$translate.instant("no")}
            ];

            //业务类型
            $scope.serviceTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:1,name:$translate.instant("broadbandVideo")},{id:2,name:$translate.instant("iptvVideo")}
            ];

            //媒体类型
            $scope.mediaTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("movie")},{id:1,name:$translate.instant("tvPlay")},{id:2,name:$translate.instant("videoNews")},{id:3,name:$translate.instant("videoColumn")}
            ];

        };

        //切换flag
        $scope.changeFlag=()=>{
            $scope.item.contentUrl=null;
            $scope.item.contentDir=null;
        };

        //返回
        $scope.return=()=>{
            $state.go("index.content.contentM.list");
        };
  
        //注入
        $scope.inject=()=>{
            // 传参处理,转换时间
            let obj=angular.copy($scope.item);
            if(obj.beginTime)obj.beginTime=obj.beginTime.replace(" ","T");
            if(obj.endTime)obj.endTime=obj.endTime.replace(" ","T");
            if(obj.copyrightStart)obj.copyrightStart=obj.copyrightStart.replace(" ","T");
            if(obj.copyrightEnd)obj.copyrightEnd=obj.copyrightEnd.replace(" ","T");
            delete obj.flag;

            let url=commonMethod.getServerUrl()+"/rest/content/matchPolicy";
            $http.post(url,[obj]).then(({data})=>{
                if(data.success){
                    //匹配到有策略才弹出策略框，没匹配到直接注入
                    if((data.data[0].matchDistributePolicyList&&data.data[0].matchDistributePolicyList.length>0)||
                        (data.data[0].matchInjectPolicyList&&data.data[0].matchInjectPolicyList.length>0)||
                        (data.data[0].matchSyncPolicyList&&data.data[0].matchSyncPolicyList.length>0)){

                        $scope.layerItems=data.data.map((value,index)=>{
                            value.id=index;
                            if(value.matchDistributePolicyList&&value.matchDistributePolicyList.length>0)value.matchDistributePolicyList[0].LAY_CHECKED=true;
                            if(value.matchInjectPolicyList&&value.matchInjectPolicyList.length>0)value.matchInjectPolicyList[0].LAY_CHECKED=true;
                            if(value.matchSyncPolicyList&&value.matchSyncPolicyList.length>0)value.matchSyncPolicyList[0].LAY_CHECKED=true;
    
                            value.injectD=false;value.distributeD=false;value.syncD=false;
                            return value
                        });
    
                        ngDialog.openConfirm({
                            plain:true,
                            scope:$scope,
                            template:require("./layer/injectLayer.html"),
                            controller:require("./layer/injectLayer"),
                            width:"70%",
                            showClose: false,
                            closeByDocument :false,
                            appendClassName:"commonDialog"
                        }).catch(()=>{});

                    }else{
                        let url1=commonMethod.getServerUrl()+"/rest/content/contentInject";
                        $http.post(url1,[data.data[0].contentInject]).then(({data})=>{
                            if(data.success){
                                // 提示信息
                                for(let {id,name} of contentService.operationResult){
                                    if(data.data==id){
                                        switch(data.data){
                                            case 1://运行中
                                                commonMethod.layuiTip($translate.instant("sameContent"),"err");
                                            break;
                                            case 2:
                                            case 4:
                                                commonMethod.layuiTip(name,"err").then($scope.return);
                                                
                                            break;
                                            case -1:
                                                commonMethod.layuiTip(name,"notice").then($scope.return);
                                                
                                            break;
                                            default:
                                                commonMethod.layuiTip(name).then($scope.return);
                                               
                                            break;
                                        }
            
                                        break;
                                    }
                                }
                                
                            }

                        }).catch(()=>{ });   

                    }
                    
                }

            }).catch((err)=>{});

            //注入成功返回
            $rootScope.$on("injectFinish",function(){
                $scope.return();
            });
        };

        $scope.init();

    }];
})();