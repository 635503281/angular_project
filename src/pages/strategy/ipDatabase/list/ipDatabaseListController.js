import { trace } from "@uirouter/core";

(function(app){
    "use strict";

    app.controller("ipDatabaseListCtrl",ipDatabaseListCtrl);
    ipDatabaseListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","ngDialog","nodeService","publicService"];
    function ipDatabaseListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,ngDialog,nodeService,publicService){
        //初始化
        $scope.init=async ()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.ipDatabase_pagingOptions){
                $scope.pagingOptions=$rootScope.ipDatabase_pagingOptions;
                $scope.searchOptions=$rootScope.ipDatabase_searchOptions;    

            }else{
                //分页参数
                $scope.pagingOptions={
                    pageSizes: [10, 20, 30, 50, 100],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,// 存放list总记录数
                    maxPages: 1,// 最大页数
                };

                //搜索字段
                $scope.searchOptions={
                    nodeID:null
                }
            }
            

            //展示数据
            $scope.items=[];

            //选中
            $scope.selectItems=[];

            $rootScope.loading=true;
            //SNS节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("all")}];
            $scope.nodeList=await nodeService.getSNSNodeList().then(list=>{
                return  list.map((value,index)=>{
                    if(index==0)value.nodeName=$translate.instant("all");
                    return value
                })  
            });

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"nodeID",title:$translate.instant("node"),align:"left",minWidth:120,
                     templet:(d)=>{
                        for(let {nodeID,nodeName} of $scope.nodeList){
                            if(d.nodeID&&nodeID==d.nodeID)return nodeName
                        }
                        return d.nodeID
                     }
                    },
                    {field:"province",title:$translate.instant("province"),align:"left",minWidth:120,
                     templet:(d)=>{
                        for(let {id,alias,name} of publicService.provinceList){
                            if(d.province&&(id==d.province||alias==d.province))return name
                        }
                        return "--"
                     }
                    },
                    {field:"city",title:$translate.instant("city"),align:"left",minWidth:120,
                     templet:`<div>{{d.city||"--"}}</div>`
                    },
                    {field:"ip",title:$translate.instant("ipAddr"),align:"left",minWidth:150,
                    templet:`<div><span title="{{d.ip}}">{{d.ip||"--"}}</span></div>`
                    },
                    {field:"ipv6",title:$translate.instant("ipv6Addr"),align:"left",minWidth:180,
                     templet:d=>{
                        let str=d.ipv6&&d.ipv6!="null"?d.ipv6:"--";
                        return `<div>${str}</div>`
                     }
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:120,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.ipDatabase.modifyBtn}?'':'none'}}" lay-event="edit"   title=${$rootScope.ipDatabase.modifyName}></button>
                        <button class="btn icon_issued {{${$rootScope.ipDatabase.issuedBtn}?'':'none'}}" lay-event="issued" title=${$rootScope.ipDatabase.issuedName}></button>
                        <button class="btn icon_delete {{${$rootScope.ipDatabase.deleteBtn}?'':'none'}}" lay-event="del"    title=${$rootScope.ipDatabase.deleteName}></button>
                     </div></div>`
                    }
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数       
                
            });
            
            //修改及删除
            layui.table.on("tool(tab)",function({data,event}){
          
                switch(event){
                    case "edit"://编辑
                        $rootScope.ipDatabase_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $rootScope.ipDatabase_searchOptions=$scope.searchOptions; 
                        $state.go("index.strategy.ipDatabase.edit",{id:data.id});
                    break;
                    case "issued"://下发
                        let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/apply";
                        $http.post(url,[data.id]).then(({data})=>{
                            if(data.success){
                                commonMethod.layuiTip($translate.instant("issued_S"));
                            }
                        }).catch((err)=>{});

                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/delete";
                            $http.post(url,[data.id]).then(({data})=>{        
                                if(data.success){
                                    commonMethod.layuiTip($translate.instant("delete_S"));
                                    $scope.getPageData(); 
                                }                  
                            }).catch((err)=>{});

                        },()=>{});
                      
                    break;
                }

            });

            //监听选中
            layui.table.on('checkbox(tab)',function(obj){
                $scope.$apply(function(){
                    $scope.selectItems=layui.table.checkStatus('tab').data;
                });
                
            });
        
            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/list";
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,
                search:{
                    nodeID:$scope.searchOptions.nodeID
                }
            };
            $http.post(url,obj).then(({data})=>{
                if(data.success&&data.data.list.length>0){
                    $scope.pagingOptions.total=data.data.total;
                    $scope.pagingOptions.maxPages=Math.ceil($scope.pagingOptions.total/$scope.pagingOptions.pageSize);

                    $scope.items=data.data.list;
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

        };

        //搜索
        $scope.search=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getPageData();
        };

        //批量删除
        $scope.deleteMore=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/delete";
            let ids=$scope.selectItems.map((value)=>value.id);

            commonMethod.commonTip({tip:$translate.instant("isDeleteMore")}).then(function(){
                $http.post(url,ids).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("delete_S"));
                        $scope.getPageData();
                    }
                }).catch((err)=>{});

            },()=>{});
        };

        //批量下发
        $scope.issuedMore=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/apply";
            let ids=$scope.selectItems.map((value)=>value.id);

            commonMethod.commonTip({tip:$translate.instant("isIssuedMore")}).then(function(){
                $http.post(url,ids).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("issued_S"));
                        $scope.getPageData();
                    }

                }).catch((err)=>{});
                
            },()=>{});
        };

        //导入
        $scope.import=()=>{
            commonMethod.fileUpload({
                title:$translate.instant("importIPDispatchList"),
                isTemplateDownLoad:true,
                templateDownLoadUrl:commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/exportTemplate",
                url:'/rest/v1/dispatch/ip/policy/import',
                isAutoUpload:true,
                types:['xls','xlsx'],
                formatError:'fileFormatError',
                success:function(data){
                    return new Promise((resolve,reject)=>{
                        
                        if($scope.pagingOptions.currentPage==1)$scope.getPageData();
                        else $scope.pagingOptions.currentPage=1;
                        
                        resolve();
                    })
                }
                
            }).catch(()=>{});

            // let dialog=ngDialog.openConfirm({
            //     plain:true,
            //     scope:$scope,
            //     appendClassName:"commonDialog",
            //     template:require("../import/import.html"),
            //     controller:require("../import/importController"),
            //     width:"60%",
            // }).catch(()=>{});

        }

        //导出
        $scope.export=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/export";
            $('.ipDispatchListDownLoad').attr('href', url);
        }

        $scope.init();

        delete $rootScope.ipDatabase_pagingOptions;
    };
    module.exports=ipDatabaseListCtrl;

})(angular.module("app"));