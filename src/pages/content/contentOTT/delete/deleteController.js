(function(){
    "use strict";

    module.exports=["$scope","$http","$translate","commonMethod","nodeService","contentService",
            function($scope,$http,$translate,commonMethod,nodeService,contentService){

        //初始化
        $scope.init=()=>{
            
            //删除对象
            $scope.item={
                nodeId:null,//节点id

                systemId:null,//命令来源系统标识
                cmsId:null,//CMS标识
                targetSystemId:null,//目标系统标识
                contentList:[//内容对象
                    {contentId:null}
                ],
                deleteMethod:null,//删除方式

            };

            //SNS节点
            nodeService.getSNSNodeList().then(list=>{$scope.nodeList=list;});

            //删除方式
            $scope.deleteMethodList=[
                {id:null,name:$translate.instant("nothing")},{id:"force",name:$translate.instant("force")},{id:"graceful",name:$translate.instant("graceful")}
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

        //删除
        $scope.delete=()=>{
         
            let url=commonMethod.getServerUrl()+"/rest/content/ottContentDelete";
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