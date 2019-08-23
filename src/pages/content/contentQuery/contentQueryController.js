(function(app){
    "use strict";

    app.controller("contentQueryCtrl",contentQueryCtrl);
    contentQueryCtrl.$inject=["$scope","$http","$translate","$rootScope","commonMethod","nodeService","cpService","$filter"];
    function contentQueryCtrl($scope,$http,$translate,$rootScope,commonMethod,nodeService,cpService,$filter){
        //初始化
        $scope.init=()=>{
            //tablist
            $scope.tabList=[
                {id:1,name:$rootScope.contentQuery.fuzzyContentQueryName,isShow:$rootScope.contentQuery.fuzzyContentQueryBtn},
                {id:2,name:$rootScope.contentQuery.accurateContentQueryName,isShow:$rootScope.contentQuery.accurateContentQueryBtn}
            ];
            //当前tab页
            $scope.currentTab=$filter('filter')($scope.tabList,{isShow:true})[0]?$filter('filter')($scope.tabList,{isShow:true})[0].id:0;

            //CCS SNS节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getSCNodeList().then(list=>{
                $scope.nodeList=list;
            });

            //获取cp列表
            cpService.getCpList().then(list=>{ $scope.cpList=list;});

            $scope.initTab($scope.currentTab);
        };

        //tab切换
        $scope.switchTab=(index)=>{
            if($scope.currentTab!=index){
                $scope.currentTab=index;
                $scope.initTab(index);
            }
        };

        //初始化tab
        $scope.initTab=(index)=>{
            //展示数据
            $scope.items=[];
            $scope.noData=true;

            switch(index){
                case 1://
                 
                    //分页参数
                    $scope.pagingOptions={
                        pageSizes: [10, 20, 30, 50, 100],
                        pageSize: 10,
                        currentPage: 1,
                        total: 0,// 存放list总记录数
                        maxPages: 1,// 最大页数
                    };

                    // 搜索字段
                    $scope.searchOptions={
                        nodeId:null,//节点id
                        cpId:null,//CP标识 
                        contentId:null,//内容标识 
                        contentUrl:null,//内容URL
                        contentName:null//内容名称
                    };

                break;
                case 2://
                    // 搜索字段
                    $scope.searchOptions={
                        nodeId:null,//节点id
                        cpId:null,//CP标识 
                        contentId:null,//内容标识 
                        contentUrl:null,//内容URL
                    };

                break;
            }
            
            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"cpId",title:$translate.instant("cpId"),align:"left",minWidth:120,
                     templet:`<div>{{d.cpId||"--"}}</div>`
                    },
                    {field:"contentUrl",title:$translate.instant("contentUrl"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.contentUrl}}">{{d.contentUrl||"--"}}</span></div>`
                    },
                    {field:"contentId",title:$translate.instant("contentId"),align:"left",minWidth:130,
                     templet:`<div>{{d.contentId||"--"}}</div>`
                    },
                    {field:"contentName",title:$translate.instant("contentName"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.contentName}}">{{d.contentName||"--"}}</span></div>`
                    },
                    {field:"contentSize",title:$translate.instant("contentSize"),align:"left",minWidth:120,
                     templet:`<div>{{d.contentSize!=null?d.contentSize:'--'}}</div>`
                    },
                    {field:"cacheTime",title:$translate.instant("cacheTime"),align:"left",width:160,
                     templet:`<div><span title="{{d.cacheTime?new Date(d.cacheTime).format('yyyy-MM-dd hh:mm:ss'):'--'}}">{{d.cacheTime?new Date(d.cacheTime).format('yyyy-MM-dd hh:mm:ss'):'--'}}</span></div>`
                    },             
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数     
                   
            });

            // $scope.getPageData();
        };

        //分页
        $scope.getPageData=function(){
            if($scope.currentTab==2){
                let url=commonMethod.getServerUrl()+"/rest/content/contentQuery";
                let obj={
                    nodeId:$scope.searchOptions.nodeId,
                    cpId:$scope.searchOptions.cpId,
                    contentId:$scope.searchOptions.contentId,
                    contentUrl:$scope.searchOptions.contentUrl,
                }
                $http.post(url,obj).then(({data})=>{
                    if(data.success){
                        if(data.data.contentUrl){//没有查到内容
                            $scope.items=[data.data];
                            $scope.noData=false;

                        }else{
                            $scope.items=[];
                            $scope.noData=true;
                            commonMethod.layuiTip($translate.instant("noQueryContent"),"notice");
    
                        }
                        
                        //重新加载表格
                        $scope.table.reload({
                            data:$scope.items,
                            limit:$scope.items.length
                        });
                        
                    }else{
                        $scope.noData=true;
                    }
                    
                }).catch((err)=>{ $scope.noData=true; });
            }else{
                if($scope.searchOptions.nodeId){
                    let url=commonMethod.getServerUrl()+"/rest/content/fhContentQuery";
                    let obj={
                        nodeId:$scope.searchOptions.nodeId,
                        cpId:$scope.searchOptions.cpId,
                        contentId:$scope.searchOptions.contentId,
                        contentUrl:$scope.searchOptions.contentUrl,
                        contentName:$scope.searchOptions.contentName,
                        pageIndex:$scope.pagingOptions.currentPage-1,
                        pageSize:$scope.pagingOptions.pageSize
                    
                    };
                    $http.post(url,obj).then(({data})=>{
                        if(data.success&&data.data.contentQueryRespBodyList.length>0){
                            $scope.pagingOptions.total=data.data.total;
                            $scope.pagingOptions.maxPages=Math.ceil($scope.pagingOptions.total/$scope.pagingOptions.pageSize);
    
                            $scope.items=data.data.contentQueryRespBodyList;
                            $scope.noData=false;

                             //重新加载表格
                            $scope.table.reload({
                                data:$scope.items,
                                limit:$scope.items.length
                            });
                            
                        }else{
                            $scope.noData=true;
                        }
                       
    
                    }).catch((err)=>{ $scope.noData=true; });
    
                }
               
            }    

        };

        //查询
        $scope.search=()=>{
            $scope.getPageData();
        };

        $scope.init();
    };
    module.exports=contentQueryCtrl;

})(angular.module("app"));