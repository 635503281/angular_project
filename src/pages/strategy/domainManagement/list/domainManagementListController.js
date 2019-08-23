(function(app){
    "use strict";

    app.controller("domainManagementListCtrl",domainManagementListCtrl);
    domainManagementListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","$filter"];
    function domainManagementListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,$filter){

        //初始化
        $scope.init=()=>{
            //tab选项
            $scope.tabList=[
                {id:1,name:$rootScope.cpdomainConfig.cpName,isShow:$rootScope.cpdomainConfig.cpBtn},
                {id:2,name:$rootScope.cpdomainConfig.domainName,isShow:$rootScope.cpdomainConfig.domainBtn}
            ];

            //当前tab页
            $scope.currentTab=$stateParams.currentTab!=null?$stateParams.currentTab:$filter('filter')($scope.tabList,{isShow:true})[0]?$filter('filter')($scope.tabList,{isShow:true})[0].id:0;

            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$scope.currentTab==1&&$rootScope.cpManagement_pagingOptions){
                $scope.pagingOptions=$rootScope.cpManagement_pagingOptions;
                $scope.searchOptions=$rootScope.cpManagement_searchOptions;
            }else if($stateParams.flag!=0&&$scope.currentTab==2&&$rootScope.domainManagement_pagingOptions){
                $scope.pagingOptions=$rootScope.domainManagement_pagingOptions;
                $scope.searchOptions=$rootScope.domainManagement_searchOptions;
            } else{
                //分页参数
                $scope.pagingOptions={
                    pageSizes: [10, 20, 30, 50, 100],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,// 存放list总记录数
                    maxPages: 1,// 最大页数
                };

                //搜索字段
                $scope.searchOptions= {
                    cpId: null,
                    domainName:null
                };
               

            }

            $scope.initTab($scope.currentTab);

        };

        //tab切换
        $scope.switchTab=(index)=>{
            if($scope.currentTab!=index){
                $scope.currentTab=index;
                $scope.initTab(index);
            }

            ///分页参数
            $scope.pagingOptions={
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                currentPage: 1,
                total: 0,// 存放list总记录数
                maxPages: 1,// 最大页数
            };

            //搜索字段
            $scope.searchOptions= {
                cpId: null,
                domainName:null
            };
        };

        $scope.getPageData=(index)=>{
            switch (index) {
                case 1://CP配置
                    $scope.getCpPageData();
                    break;
                case 2://Domain配置
                    $scope.getDomainPageData();
                    break;
            }
        };

        //初始化tab
        $scope.initTab=(index)=>{
            switch (index) {
                case 1://CP配置

                    //展示数据
                    $scope.items = [
                        {
                            cpId: null,//CP标识
                            name: null,//名称
                            address: null,//地址
                            contactName: null,//联系人名称
                            phone: null,//电话
                            isSign: false//签约客户
                        }
                    ];
                    $scope.selectItems = [];

                    //初始化渲染table
                    $scope.table = layui.table.render({
                        elem: "#tab",
                        cols: [[
                            {type: "checkbox", fixed: "left"},
                            {
                                field: "cpId", title: $translate.instant("CPID"), align: "left",
                                templet: `<div>{{d.cpId||"--"}}</div>`
                            },
                            {
                                field: "name", title: $translate.instant("cpName"), align: "left",
                                templet: `<div>{{d.name||"--"}}</div>`
                            },
                            {
                                field: "address", title: $translate.instant("address"), align: "left",
                                templet: `<div><span title="{{d.address}}">{{d.address||"--"}}</span></div>`
                            },
                            {
                                field: "contactName", title: $translate.instant("contactName"), align: "left",
                                templet: `<div>{{d.contactName||"--"}}</div>`
                            },
                            {
                                field: "phone", title: $translate.instant("phone"), align: "left",
                                templet: `<div>{{d.phone||"--"}}</div>`
                            },
                            {
                                field: "priority", title: $translate.instant("priority"), align: "left",
                                templet: function (d) {
                                    switch (d.priority) {
                                        case 0:
                                            return $translate.instant("priority_0");
                                            break;
                                        case 1:
                                            return $translate.instant("priority_1");
                                            break;
                                        case 2:
                                            return $translate.instant("priority_2");
                                            break;
                                    }
                                }
                            },
                            {
                                field: "isSign", title: $translate.instant("isSign"), align: "left",
                                templet: function (d) {
                                    return d.isSign ? $translate.instant("yes") : $translate.instant("not")
                                }
                            },
                            {
                                title: $translate.instant("operation"), fixed: "right", align: "left",width: 100,
                                toolbar: `<div><div class="operation_btn">
                                 <button class="btn icon_modify {{${$rootScope.cpdomainConfig.cp_modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.cpdomainConfig.cp_modifyName}></button>
                                 <button class="btn icon_delete {{${$rootScope.cpdomainConfig.cp_deleteBtn}?'':'none'}}"  lay-event="del" title=${$rootScope.cpdomainConfig.cp_deleteName}></button>
                                </div></div>`
                            }
                        ]],
                        data: $scope.items,//数据
                        limit: $scope.items.length,//渲染显示的个数

                    });


                    //修改及删除
                    layui.table.on("tool(tab)", function ({data, event}) {
                        switch (event) {
                            case "edit"://编辑
                                $rootScope.cpManagement_pagingOptions = $scope.pagingOptions;//保存分页参数
                                $rootScope.cpManagement_searchOptions = $scope.searchOptions;
                                $state.go("index.strategy.domainManagement.cpEdit", {id: data.id});
                            break;
                            case "del"://删除
                                commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function () {
                                    let url = commonMethod.getServerUrl() + "/rest/v1/dispatch/domainManagement/deleteCp";
                                    $http.post(url, [data.id]).then(({data}) => {
                                        if(data.success){
                                            commonMethod.layuiTip($translate.instant("delete_S"));
                                            $scope.getCpPageData();
                                        }
                                            
                                     }).catch((err) => {});

                                },()=>{})
                            break;
                        }
                    });

                    //监听选中
                    layui.table.on('checkbox(tab)', function (obj) {
                        $scope.$apply(function () {
                            $scope.selectItems = layui.table.checkStatus('tab').data;
                        });

                    });

                    $scope.getCpPageData();
                break;
                case 2:   //域名列表

                    //展示数据
                    $scope.items = [
                        {
                            domainName: null,//域名
                            cpID: null,//CP标识
                            cpName: null//CP名称
                        }
                    ];
                    $scope.selectItems = [];

                    //初始化渲染table
                    $scope.table = layui.table.render({
                        elem: "#tab",
                        cols: [[
                            {type: "checkbox", fixed: "left"},
                            {
                                field: "domainName", title: $translate.instant("domainList"), align: "left",
                                templet: `<div>{{d.domainName||"--"}}</div>`
                            },
                            {
                                field: "cpID", title: $translate.instant("CPID"), align: "left",
                                templet: `<div>{{d.cpID||"--"}}</div>`
                            },
                            {
                                field: "cpName", title: $translate.instant("cpName"), align: "left",
                                templet: `<div>{{d.cpName||"--"}}</div>`
                            },

                            {
                                title: $translate.instant("operation"), fixed: "right", align: "left",width: 100,
                                toolbar: `<div><div class="operation_btn">
                                    <button class="btn icon_modify {{${$rootScope.cpdomainConfig.domain_modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.cpdomainConfig.domain_modifyName}></button>
                                    <button class="btn icon_delete {{${$rootScope.cpdomainConfig.domain_deleteBtn}?'':'none'}}"  lay-event="del" title=${$rootScope.cpdomainConfig.domain_deleteName}></button>
                                </div></div>`
                            }
                        ]],
                        data: $scope.items,//数据
                        limit: $scope.items.length,//渲染显示的个数

                    });

                    //修改及删除
                    layui.table.on("tool(tab)", function ({data, event}) {

                        switch (event) {
                            case "edit"://编辑
                                $rootScope.domainManagement_pagingOptions = $scope.pagingOptions;//保存分页参数
                                $rootScope.domainManagement_searchOptions = $scope.searchOptions;
                                $state.go("index.strategy.domainManagement.domainEdit", {id: data.id});
                            break;
                            case "del"://删除
                                commonMethod.commonTip({tip:$translate.instant('isDelete'),message:$translate.instant("domainManagement_del_tip")}).then(function () {
                                    let url = commonMethod.getServerUrl() + "/rest/v1/dispatch/domainManagement/deleteDomain";
                                    $http.post(url, [data.id]).then(({data}) => {
                                        if(data.success){
                                            commonMethod.layuiTip($translate.instant("delete_S"));
                                            $scope.getDomainPageData();
                                        }
                                            
                                    }).catch((err) => {});
                                
                                },()=>{});    
                            break;
                        }
                    });

                    //监听选中
                    layui.table.on('checkbox(tab)', function (obj) {
                        $scope.$apply(function () {
                            $scope.selectItems = layui.table.checkStatus('tab').data;
                        });
                    });

                    $scope.getDomainPageData();
                break;
            }
        }

        //获取CP列表
        $scope.getCpPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/listCp";
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,
                search:{
                    cpId:$scope.searchOptions.cpId
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

        //获取域名列表
        $scope.getDomainPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/listDomain";
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,
                search:{
                    domainName:$scope.searchOptions.domainName
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
        $scope.searchCp=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getCpPageData();
        };

        $scope.searchDomain=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getDomainPageData();
        };

        //批量删除
        $scope.deleteMore=()=>{
            let url=commonMethod.getServerUrl();
            let tip={tip:$translate.instant("isDeleteMore")};
            if($scope.currentTab==1){url+="/rest/v1/dispatch/domainManagement/deleteCp";}
            else {
                url+="/rest/v1/dispatch/domainManagement/deleteDomain";
                tip.message=$translate.instant("domainManagement_del_tip")
            }
            let ids=$scope.selectItems.map((value)=>value.id);

            commonMethod.commonTip(tip).then(function(){
                $http.post(url,ids).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("delete_S"));
                        $scope.getPageData($scope.currentTab);
                    }
                }).catch((err)=>{});

            },()=>{});
        };

        $scope.init();

        delete $rootScope.cpManagement_pagingOptions;
        delete $rootScope.domainManagement_pagingOptions;
    };
    module.exports=domainManagementListCtrl;

})(angular.module("app"));