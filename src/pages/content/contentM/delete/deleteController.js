(function(){
    "use strict";

    module.exports=["$scope","$rootScope","$http","$translate","commonMethod","nodeService","contentService","cpService","$state",
            function($scope,$rootScope,$http,$translate,commonMethod,nodeService,contentService,cpService,$state){

        //初始化
        $scope.init=()=>{
            
            //删除对象
            $scope.item={
                nodeId:null,//节点id

                responseType:null,//是否需要返回内容注入结果：0-不需要，1-需要，默认为0
                cpId:null,//CPID
                contentId:null,
                contentUrl:null,
                contentDir:null,
                flag:0

            };

            //内容url还是目录标记
            $scope.flagList=[
                {id:0,name:$translate.instant("contentUrl")},
                {id:1,name:$translate.instant("contentDir")}
            ];

            //SNS CCS节点
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getSCNodeList().then(list=>{$scope.nodeList=list;});

            //获取cp列表
            $scope.cpList=[{cpId:null,name:$translate.instant("nothing")}];
            cpService.getCpList().then(list=>{ $scope.cpList=list;});

            //是否返回注入结果list
            $scope.responseTypeList=[
                {id:null,name:$translate.instant("nothing")},{id:0,name:$translate.instant("noNeed")},{id:1,name:$translate.instant("need")}
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

        //删除
        $scope.delete=()=>{
            let obj=angular.copy($scope.item);
            delete obj.flag;

            let url=commonMethod.getServerUrl()+"/rest/content/contentDelete";
            $http.post(url,[obj]).then(({data})=>{
                if(data.success){ 
                    //提示信息
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

            }).catch((err)=>{});


        };

        $scope.init();

    }];
})();