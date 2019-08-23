(function(){
    "use strict";

    module.exports=["$scope","$http","$translate","commonMethod","nodeService","contentService",
            function($scope,$http,$translate,commonMethod,nodeService,contentService){

        //初始化
        $scope.init=()=>{
            
            //分发对象
            $scope.item={
                nodeId:null,//节点id

                responseType:0,//是否需要返回内容注入结果：0-不需要，1-需要，默认为0
                streamingNo:Date.now(),//流水号
                cmsId:null,//牌照方标识
                contentList:[//内容对象
                    {contentId:null,contentName:null,contentUrl:null}
                ],
                urlType:1,//内容下载地址
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
                tsDuration:null,//时移时长单位秒
                beginTime:null,//tsSupport=1,开始录制时间
                endTime:null,//tsSupport=1,结束录制时间
                isFloatIPQAM:null,//ContentType=2,指定是否是浮动频点：0-是，1-不是
                rdSupport:null,//是否支持录制
                rdDuration:null,//录制时长
                accessURL:null,//内容访问路径
                providerId:null,//内容提供商
                needDelivery:null,//内容是否需要分发 0-不需要， 1-需要
                serviceId:null,//内容源业务标识
                serviceType:null,//业务类型：1-宽带视频 2-IPTV视频
                mediaType:null,//媒体类型：0-电影，1-电视剧，2-视频新闻，3-视频栏目
                copyrightStart:null,//版权开始日期
                copyrightEnd:null,//版权结束日期
                item1:null,//一级分类
                item2:null,//二级分类
                label:null,//标签，多个标签之间以逗号
                iptvChannelType:null,//组播类型,当ContentType 取值为2且需要CDN支持RTSP直播单播时有效  0-TS/UDP单播入流 1-TS/UDP组播入流
                iptvChannelMulticastIP:null,//组播IP iptvChannelType = 0时，此参数不填写 iptvChannelType =1时，此参数填写编码器发送的组播IP
                iptvChannelMulticastPort:null,//组播端口  iptvChannelType = 0时，此参数不填写；iptvChannelType = 1时，此参数填写编码器发送的组播端口；
                ingestType:null,//点播内容注入方式,1-表示缓存,2-表示托管

            };

            //SNS节点
            nodeService.getSNSNodeList().then(list=>{$scope.nodeList=list;});

            //是否返回注入结果list
            $scope.responseTypeList=[
                {id:0,name:$translate.instant("noNeed")},{id:1,name:$translate.instant("need")}
            ];

            //url类型列表
            $scope.urlTypeList=[
                {id:1,name:$translate.instant("urlType_1")},{id:2,name:$translate.instant("urlType_2")}
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

            //是否支持录制
            $scope.rdSupportList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("noSupport")},{id:1,name:$translate.instant("support")}
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

            //组播类型
            $scope.iptvChannelTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("iptvChannelType_0")},{id:1,name:$translate.instant("iptvChannelType_1")}
            ];

            //点播内容注入方式
            $scope.ingestTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:1,name:$translate.instant("ingestType_1")},{id:2,name:$translate.instant("ingestType_2")}
            ];

        };

        //添加content
        $scope.addContent=()=>{
            $scope.item.contentList.push({contentId:null,contentName:null,contentUrl:null});
        };

        //删除content
        $scope.delContent=(index)=>{
            $scope.item.contentList.splice(index,1);
        };

        //读取文件
        $scope.readFile=(files)=>{
            if(files.length){
                let file = files[0];
                let reader = new FileReader();//new一个FileReader实例
                if (/text+/.test(file.type)) {//判断文件类型，是不是text类型
                    reader.onload = function() {
                        //以换行符分割数据
                        var arr=this.result.split(/\n/g);
                      
                        $scope.$apply(function(){
                            $scope.item.contentList=[];

                            arr.map(function(value,index){
                                value=value.trim();
                                if(value){//除去空的
                                    //以一个或多个空格分隔成列(标准3列)
                                    let colList=value.split(/\s+/);
                                    switch(colList.length){
                                        case 3:
                                            $scope.item.contentList.push({contentId:colList[0],contentName:colList[1],contentUrl:colList[2]});
                                        break;
                                    }
                                }
                               
                            });

                            if($scope.item.contentList.length==0){
                                $scope.item.contentList=[{contentId:null,contentName:null,contentUrl:null}];
                                layui.layer.msg($translate.instant("importFile_F"),{time:2000,icon:2});
                            }else{
                                layui.layer.msg($translate.instant("importFile_S"),{time:2000,icon:1});
                            }

                        });
                       
                    }
                    reader.readAsText(file,"UTF-8");

                }else{
                    layui.layer.msg($translate.instant("type_text"),{time:2000,icon:2})
                }      
            }

        };

        //重置内容类型参数
        $scope.resetContent=(contentType)=>{
            switch(contentType){
                case null:
                    $scope.item.ingestType=null;

                    $scope.item.tsSupport=null;
                    $scope.item.rdSupport=null;
                    $scope.item.iptvChannelType=null;
                    $scope.resetIptvChannel(null);
                    $scope.resetRdSupport(null);
                    $scope.resetTSupport(null);
                    $scope.item.isFloatIPQAM=null;
                break;
                case 1 :
                    $scope.item.tsSupport=null;
                    $scope.item.rdSupport=null;
                    $scope.item.iptvChannelType=null;
                    $scope.resetIptvChannel(null);
                    $scope.resetRdSupport(null);
                    $scope.resetTSupport(null);
                    $scope.item.isFloatIPQAM=null;
                break;
                case 2:
                    $scope.item.ingestType=null;
                break;
            }
        };

        //重置时移参数
        $scope.resetTSupport=(tsSupport)=>{
            if(!tsSupport){
                $scope.item.tsDuration=null;
                $scope.item.beginTime=null;
                $scope.item.endTime=null;
            }
            
        };

        //重置录制参数
        $scope.resetRdSupport=(rdSupport)=>{
            if(!rdSupport){
                $scope.item.rdDuration=null;
            }
        };

        //重置组播参数
        $scope.resetIptvChannel=(iptvChannelType)=>{
            if(!iptvChannelType){
                $scope.item.iptvChannelMulticastIP=null;
                $scope.item.iptvChannelMulticastPort=null;
            }
        };

        //分发
        $scope.distribute=()=>{
            // 传参处理,转成时间戳
            let obj=angular.copy($scope.item);
            if(obj.beginTime)obj.beginTime=Date.parse(obj.beginTime);
            if(obj.endTime)obj.endTime=Date.parse(obj.endTime);
            if(obj.copyrightStart)obj.copyrightStart=Date.parse(obj.copyrightStart);
            if(obj.copyrightEnd)obj.copyrightEnd=Date.parse(obj.copyrightEnd);
            //去掉重复的内容url和目录url
            for(let i=0;i<obj.contentList.length;i++){
                let content_pre=obj.contentList[i]; 
                for(let k=i+1;k<obj.contentList.length;k++){
                    let content_suf=obj.contentList[k];
                    let urlFlag=content_pre.contentUrl&&content_suf.contentUrl&&content_pre.contentUrl==content_suf.contentUrl;
                    if(urlFlag){
                        obj.contentList.splice(k--,1);
                    }
                }
            }

            let url=commonMethod.getServerUrl()+"/rest/content/ottContentDistribute";
            $http.post(url,obj).then(({data})=>{
                if(data.success){
                    //提示信息
                    for(let {id,name} of contentService.operationResult){
                        if(data.data==id){
                            layui.layer.msg(name,{icon:1,time:2000});
                            break;
                        }
                    }

                    if(data.data!=2){//2--fail
                        $scope.closeThisDialog();
                        //重新更新展示列表
                        $scope.getPageData();
                    }
                }

            }).catch((err)=>{});


        };

        $scope.init();

    }];
})();