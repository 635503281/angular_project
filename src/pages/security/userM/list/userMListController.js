(function(app){
    "use strict";

    app.controller("userMListCtrl",userMListCtrl);
    userMListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","loginService"];
    function userMListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,loginService){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.userM_pagingOptions){
                $scope.pagingOptions=$rootScope.userM_pagingOptions;
                $scope.searchOptions=$rootScope.userM_searchOptions;
            }else{
                //分页参数
                $scope.pagingOptions={
                    pageSizes: [10, 20, 30, 50, 100],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,// 存放list总记录数
                    maxPages: 1,// 最大页数
                };
                //搜索条件
                $scope.searchOptions={
                    name:null,//用户名
                };
            }
            

            //展示数据
            $scope.items=[];

            //选中
            $scope.selectItems=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"name",title:$translate.instant("userName"),align:"left",minWidth:150,
                     templet:`<div>{{d.name||"--"}}</div>`
                    },
                    {field:"roleName",title:$translate.instant("roleName"),align:"left",minWidth:150,
                     templet:`<div>{{d.roleName||"--"}}</div>`
                    },
                    {field:"enable",title:$translate.instant("enable"),align:"left",minWidth:130,
                     templet:d=>{
                        if(d.enable)return $translate.instant("yes")
                        else return $translate.instant("not")
                     }
                    },
                    {field:"createUser",title:$translate.instant("createUser"),align:"left",minWidth:130,
                     templet:`<div>{{d.createUser||"--"}}</div>`
                    },
                    {field:"email",title:$translate.instant("email"),align:"left",minWidth:150,
                     templet:`<div>{{d.email||"--"}}</div>`
                    },
                    {field:"telephone",title:$translate.instant("telephone"),align:"left",minWidth:150,
                     templet:`<div>{{d.telephone||"--"}}</div>`
                    },
                    
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:120,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.userM.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.userM.modifyName}></button>
                        <button class="btn icon_reset {{${$rootScope.userM.resetPsdBtn}?'':'none'}}"  lay-event="resetPsd" title=${$rootScope.userM.resetPsdName}></button>
                        {{#  if(d. name=='sysadmin'){ }}
                        <button class="btn icon_stop {{${$rootScope.userM.disableBtn}?'':'none'}}"  lay-event="enable" disabled title=${$rootScope.userM.disableName}></button>
                        {{#  } else { }}
                            {{#  if(d. enable){ }}
                            <button class="btn icon_stop {{${$rootScope.userM.disableBtn}?'':'none'}}"  lay-event="enable" title=${$rootScope.userM.disableName}></button>
                            {{#  } else { }}
                            <button class="btn icon_enable {{${$rootScope.userM.enableBtn}?'':'none'}}"  lay-event="enable" title=${$rootScope.userM.enableName}></button>
                            {{#  } }}
                        {{#  } }}
                     </div></div>`
                    }
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数      

            });
            
            //监听选中
            layui.table.on('checkbox(tab)',function(obj){
                $scope.$apply(function(){
                    $scope.selectItems=layui.table.checkStatus('tab').data;
                });
                
            });

            //修改/重置密码/是否启用
            layui.table.on("tool(tab)",function({data,event}){
                let data1=data;
                switch(event){
                    case "edit"://编辑
                        $rootScope.userM_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $rootScope.userM_searchOptions=$scope.searchOptions;
                        $state.go("index.security.userM.edit",{id:data.id});
                    break;
                    case "resetPsd"://重置密码
                        commonMethod.commonTip({tip:$translate.instant('isResetPsd')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/userManagement/user/resetPwd";;
                            $http.post(url,{id:data.id}).then(({data})=>{        
                                if(data.success){
                                    commonMethod.layuiTip($translate.instant("reset_S")).then(function(){
                                        //重置的是自己就退出
                                        if(data1.name==$rootScope.userName){
                                            loginService.exit();
                                        }
                                    });
      
                                }
                                                  
                            }).catch((err)=>{});

                        },()=>{});     
                    break;
                    case "enable"://启用
                        let tipStr=data.enable?"isStop":"isEnable";
                        commonMethod.commonTip({tip:$translate.instant(tipStr)}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/userManagement/user/enable";;
                            $http.post(url,{id:data.id,enable:!data.enable}).then(({data})=>{        
                                if(data.success){
                                    // 提示启用停用成功
                                    if(data1.enable){//停用
                                        commonMethod.layuiTip($translate.instant("stop_S")).then(function(){
                                            //停用的是自己就退出
                                            if(data1.enable&&data1.name==$rootScope.userName){
                                                loginService.exit();
                                                return
                                            }
                                            $scope.getPageData();
                                        });

                                    }else{//启用
                                        commonMethod.layuiTip($translate.instant("enable_S")).then($scope.getPageData);
                                    
                                    } 

                                }
                                                        
                            }).catch((err)=>{});

                        },()=>{});     
                    break;

                }

            });

            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];

            let url=commonMethod.getServerUrl()+"/rest/userManagement/user/getUserLikeName";
            let obj={
                name:$scope.searchOptions.name,
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize
            };
            $http.get(url,{params:obj}).then(({data})=>{
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

        //查询
        $scope.search=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getPageData();
        };

        //删除用户
        $scope.delUser=()=>{
            for(let {name} of $scope.selectItems){
                if(name=="sysadmin"){
                    commonMethod.layuiTip($translate.instant("noDelSysadmin"),"notice");
                    return 
                }
            }
            commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                let url=commonMethod.getServerUrl()+"/rest/userManagement/user/deleteUser";
                let ids=$scope.selectItems.map(value=>value.id);
                $http.post(url,{ids}).then(({data})=>{        
                    if(data.success){
                        //提示删除成功
                        commonMethod.layuiTip($translate.instant("delete_S")).then(function(){
                            //删除自己则退出
                            for(let {name} of $scope.selectItems){
                                if(name==$rootScope.userName){
                                    loginService.exit();  
                                    return    
                                }
                            }

                            $scope.getPageData();    

                        });
                           
                    } 
                                        
                }).catch((err)=>{});

            },()=>{});
        };

        $scope.init();

        delete $rootScope.userM_pagingOptions;
        delete $rootScope.userM_searchOptions;
    };
    module.exports=userMListCtrl;

})(angular.module("app"));