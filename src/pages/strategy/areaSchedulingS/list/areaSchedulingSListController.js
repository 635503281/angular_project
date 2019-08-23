(function(app){
    "use strict";

    app.controller("areaSchedulingSListCtrl",areaSchedulingSListCtrl);
    areaSchedulingSListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","publicService","ngDialog"];
    function areaSchedulingSListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,publicService,ngDialog){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.areaSchedulingS_pagingOptions){
                $scope.pagingOptions=$rootScope.areaSchedulingS_pagingOptions;
                $scope.searchOptions=$rootScope.areaSchedulingS_searchOptions;

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
                    province:null,
                    domain:null
                }
            }

            //展示数据
            $scope.items=[
                // {
                //     province:"01",//省份
                //     domain:"www.baidu.com",//域名
                //     policy:0,//调度策略 0-基于地理位置就近 1-基于节点健康度  2-基于业务分担
                //     redirectFormat:"1",//重定向URL格式1：用目标Host替换原始Host 2：在原始Host前面插入目标Host
                //     clientList:[//用户IP地址段列表
                //         {
                //             ipAddr:"test",
                //             ipv6Addr:"test",
                //             mask:"test"
                //         }
                //     ]
                // }
            ];

            //选中
            $scope.selectItems=[];

            //省份
            $scope.provinceList=publicService.provinceList.map((value,index)=>{
                if(index==0){
                    let item=angular.copy(value);
                    item.name=$translate.instant("all");
                    return item
                }
                return value
            });

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"province",title:$translate.instant("province"),align:"left",minWidth:120,
                     templet:(d)=>{
                        for(let {alias,name} of publicService.provinceList){
                            if(d.province==alias&&d.province)return name
                        }
                        return "--"
                     }
                    },
                    {field:"domain",title:$translate.instant("domain"),align:"left",minWidth:180,
                     templet:`<div><span title="{{d.domain}}">{{d.domain||"--"}}</span></div>`
                    },
                    {field:"policy",title:$translate.instant("policy"),align:"left",minWidth:150,
                     templet:function(d){
                        switch(d.policy){
                            case 0:return $translate.instant("policy_t0");break;
                            case 1:return $translate.instant("policy_t4");break;
                            case 2:return $translate.instant("policy_t6");break;
                        }
                        return "--"
                     }
                    },
                    {field:"redirectFormat",title:$translate.instant("redirectFormat"),align:"left",minWidth:150,
                     templet:function(d){
                        switch(d.redirectFormat){
                           case "1":return $translate.instant("redirectFormat_t1");break;
                           case "2":return $translate.instant("redirectFormat_t2");break;
                        }
                        return "--"
                     }
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.areaSchedulingS.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.areaSchedulingS.modifyName}></button>
                        <button class="btn icon_delete {{${$rootScope.areaSchedulingS.deleteBtn}?'':'none'}}"  lay-event="del" title=${$rootScope.areaSchedulingS.deleteName}></button>
                     </div></div>`
                     //<button class="btn icon_issued" lay-event="issued" title=${$translate.instant("issued")}></button>
                    }
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数      
                   
            });
            
            //修改及删除
            layui.table.on("tool(tab)",function({data,event}){
          
                switch(event){
                    case "edit"://编辑
                        $rootScope.areaSchedulingS_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $rootScope.areaSchedulingS_searchOptions=$scope.searchOptions;
                        $state.go("index.strategy.areaSchedulingS.edit",{id:data.id});
                    break;
                    // case "issued"://下发
                    //     let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/apply";
                    //     $http.post(url,[data.id]).then(({data})=>{
                    //         if(data.success){
                    //             commonMethod.layuiTip($translate.instant("issued_S"));
                    //         }
                    //     }).catch((err)=>{});

                    // break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/delete";
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

        //搜索
        $scope.search=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/list";
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,
                search:{
                    province:$scope.searchOptions.province,
                    domain:$scope.searchOptions.domain
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

        //批量删除
        $scope.deleteMore=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/delete";
            let ids=$scope.selectItems.map((value)=>value.id);

            commonMethod.commonTip({tip:$translate.instant('isDeleteMore')}).then(function(){
                $http.post(url,ids).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("delete_S"));
                        $scope.getPageData();
                    }
                }).catch((err)=>{});

            },()=>{});
        };

        //下发
        $scope.issued=()=>{
            let dialog=ngDialog.openConfirm({
                plain:true,
                scope:$scope,
                showClose: false,
                closeByDocument :false,
                appendClassName:"commonDialog",
                template:`
                    <div class="commonDialog_box">
                        <h3>{{"issued"|translate}}</h3>
                        <form name="edit_form">
                            <div class="commonDialog_main">
                                <div class="commonDialog_content">
                                    <div class="strategy_content">
                                        <div class="item_title">{{"province"|translate}}:</div>
                                        <div class="">
                                            <label class="checkbox" ng-repeat="province in provinceList">
                                                <input type="checkbox" value={{province.alias}}><i class="layui-icon"></i>
                                                <span>{{province.name}}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="msgTips">
                                    <span>{{"considerations"|translate}}:</span><br>
                                    <span>1. {{"areaSchedulingS_tip1"|translate}}</span><br>
                                    <span>2. {{"areaSchedulingS_tip2"|translate}}</span>
                                </div>
                            </div>
                         
                            <div class="btn_group">
                                <button type="button" class="pageBtn_blue40" ng-click="issuedItem()" ng-disabled="loading">{{loading?("loading"|translate):("issued"|translate)}}</button>
                                <button type="button" class="pageBtn_bai40" ng-click="closeThisDialog('cancel')">{{"cancel"|translate}}</button>
                            </div>
                        </form>
                    </div>
                `,
               
                controller:["$rootScope","$scope","$http","commonMethod","publicService",function($rootScope,$scope,$http,commonMethod,publicService){
                    //初始化
                    $scope.init=()=>{
                        //省份列表
                        $scope.provinceList=angular.copy(publicService.provinceList);
                        $scope.provinceList.shift();
                        
                        $scope.arr=[];
                    };

                    //下发
                    $scope.issuedItem=()=>{
                        let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/apply";
                        let arr=[];
                        $(".checkbox input").map((index,value)=>{
                            if($(value).prop("checked"))arr.push($(value).val());
                        });
                        if(arr.length==0){
                            commonMethod.layuiTip($translate.instant("selectProvince"),'notice')
                            return 
                        }
                        $http.post(url,arr).then(({data})=>{
                            if(data.success){
                                commonMethod.layuiTip($translate.instant("issued_S"));
                                $scope.closeThisDialog('cancel');
                            }

                        });

                    };

                    $scope.init();

                }],
                width:"70%",
            }).catch(()=>{});
        };

        //批量下发
        // $scope.issuedMore=()=>{
        //     let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/area/domain/apply";
        //     let ids=$scope.selectItems.map((value)=>value.id);

        //     commonMethod.layuiConfirm($translate.instant("isIssuedMore")).then(function(){
        //         $http.post(url,ids).then(({data})=>{
        //             if(data.success){
        //                 layui.layer.msg($translate.instant("issued_S"),{time:2000,icon:1});
        //                 $scope.getPageData();
        //             }

        //         }).catch((err)=>{});
                
        //     });
        // };

        $scope.init();

        delete $rootScope.areaSchedulingS_pagingOptions;
    };
    module.exports=areaSchedulingSListCtrl;

})(angular.module("app"));