(function(){
    "use strict";

    module.exports=["$scope","$http","$translate","commonMethod","nodeService","contentService",
            function($scope,$http,$translate,commonMethod,nodeService,contentService){

        //初始化
        $scope.init=()=>{
            
            //更新对象
            $scope.item={
                nodeId:null,//节点id

                systemId:null,//源系统标识
                cmsId:null,//牌照方标识
                contentList:[//内容对象
                    {contentId:null}
                ],
                targetSystemId:null,//标系统标识
                tsSupport:null,//是否时移
                tdDuration:null,//时移时长 s
                rdSupport:null,//是否录制
                rdDuration:null,//录制时长 h

            };

            //SNS CCS节点
            nodeService.getSCNodeList().then(list=>{$scope.nodeList=list;});

            //是否支持时移
            $scope.tsSupportList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("noSupport")},{id:1,name:$translate.instant("support")}
            ];

            //是否支持录制
            $scope.rdSupportList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("noSupport")},{id:1,name:$translate.instant("support")}
            ];

        };

        //添加content
        $scope.addContent=()=>{
            $scope.item.contentList.push({contentId:null});
        };

        //删除content
        $scope.delContent=(index)=>{
            $scope.item.contentList.splice(index,1);
        };

        //重置时移参数
        $scope.resetTSupport=(tsSupport)=>{
            if(!tsSupport){
                $scope.item.tsDuration=null;
            }
            
        };

        //重置录制参数
        $scope.resetRdSupport=(rdSupport)=>{
            if(!rdSupport){
                $scope.item.rdDuration=null;
            }
        };

        //更新
        $scope.update=()=>{
         
            let url=commonMethod.getServerUrl()+"/rest/content/ottContentUpdate";
            $http.post(url,$scope.item).then(({data})=>{
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