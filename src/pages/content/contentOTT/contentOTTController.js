(function(app){
    "use strict";

    app.controller("contentOTTCtrl",contentOTTCtrl);
    contentOTTCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","ngDialog","contentService"];
    function contentOTTCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,ngDialog,contentService){
        //初始化
        $scope.init=()=>{
           
            //分页参数
            $scope.pagingOptions={
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                currentPage: 1,
                total: 0,// 存放list总记录数
                maxPages: 1,// 最大页数
            };
            
            //展示数据
            $scope.items=[];
            
            //选中数据
            $scope.selectItems=[];

            //能够注入、下发等
            $scope.isInject=true;
            $scope.isDistribute=true;
            $scope.isUpdate=true;
            $scope.isDelete=true;

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    // {type:"checkbox",fixed:"left"},
                    {field:"nodeName",title:$translate.instant("nodeName"),align:"center",fixed:"left",width:120,
                     templet:`<div>{{d.nodeName||"--"}}</div>`    
                    },  
                    {field:"createTime",title:$translate.instant("createTime"),sort:true,align:"center",width:160,
                     templet:`<div><span title="{{new Date(d.createTime).format('yyyy-MM-dd hh:mm:ss')}}">
                                {{new Date(d.createTime).format('yyyy-MM-dd hh:mm:ss')}}
                            </span></div>`
                    },
                    {field:"commandType",title:$translate.instant("commandType"),align:"center",width:100,
                     templet:function(d){
                        for(let key in contentService.ottCommandType){
                            if(key==d.commandType){
                                return contentService.ottCommandType[key]
                            }
                        }
                        return "--"
                     }
                    },
                    {field:"cmsId",title:$translate.instant("cmsId"),align:"center",width:80,
                     templet:`<div>{{d.cmsId||'--'}}</div>`
                    },
                    {field:"contentId",title:$translate.instant("contentId"),align:"center",minWidth:200,
                     templet:`<div>{{d.contentId||'--'}}</div>`
                    },
                    {field:"contentName",title:$translate.instant("contentName"),align:"center",minWidth:200,
                     templet:`<div>{{d.contentName||"--"}}</div>`
                    },
                    {field:"contentUrlDir",title:$translate.instant("contentUrlDir"),align:"center",minWidth:200,
                     templet:`<div><span title="{{d.contentUrlDir}}">{{d.contentUrlDir||"--"}}</span></div>`
                    },
                    {field:"operationResult",title:$translate.instant("operationResult"),fixed:"right",align:"center",width:120,
                     templet:function(d){
                        for(let {id,name} of contentService.operationResult){//操作结果
                            if(d.operationResult==id)return `<span class="operationResult${d.LAY_TABLE_INDEX}">${name}</span>`
                        }
                        return `<span class="operationResult${d.LAY_TABLE_INDEX}"">--</span>`
                     }
                    },  
                    {field:"progress",title:$translate.instant("progress"),align:"center",fixed:"right",width:120,
                     templet:`<div>
                        {{#  if(d.progress){ }}
                        <div class="layui-progress layui-progress-big mid" lay-filter="progress{{d.LAY_TABLE_INDEX}}" lay-showpercent="true">
                            {{#  if(d.operationResult==0){ }}
                            <div class="layui-progress-bar layui-bg-blue"  lay-percent={{d.progress}}% ></div>
                            {{#  } else if(d.operationResult==1) { }}
                            <div class="layui-progress-bar"  lay-percent={{d.progress}}% ></div>
                            {{#  } else { }}
                            <div class="layui-progress-bar layui-bg-red"  lay-percent={{d.progress}}% ></div>
                            {{#  } }}
                        </div>
                        {{#  } else { }}
                        <div>--</div>
                        {{#  } }}
                    </div>`
                    },        
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数           
                done:function(){
                    setTimeout(layui.element.init,0);
                }   
            });
            
            //监听选中
            layui.table.on('checkbox(tab)',function(obj){
                $scope.$apply(function(){
                    $scope.selectItems=layui.table.checkStatus('tab').data;
                });
                
            });

            //监听排序重载进度条
            layui.table.on('sort(tab)', function(obj){
                layui.element.init();
            });

            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];

            let url=commonMethod.getServerUrl()+"/rest/content/getContentOttOperationList";
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize
            };
            $http.get(url,{params:obj}).then(({data})=>{
                if(data.success){
                    $scope.pagingOptions.total=data.data.total;
                    $scope.pagingOptions.maxPages=Math.ceil($scope.pagingOptions.total/$scope.pagingOptions.pageSize);

                    $scope.items=data.data.list;

                    //重新加载表格
                    $scope.table.reload({
                        data:$scope.items,
                        limit:$scope.items.length
                    })
                }     

            }).catch((err)=>{});

        };

        //注入
        $scope.inject=()=>{
            if($scope.isInject){
                let dialog=ngDialog.openConfirm({
                    plain:true,
                    scope:$scope,
                    template:require("./inject/inject.html"),
                    controller:require("./inject/injectController"),
                    width:"70%",
                    appendClassName:"ngdialog_p10"
                }).catch(()=>{});

            }else{
                //正在注入中
                layui.layer.msg($translate.instant("injecting"),{icon:3,time:2000});
            }
           
            layui.layer.closeAll('tips');
        };

        //分发
        $scope.distribute=()=>{
            if($scope.isDistribute){
                let dialog=ngDialog.openConfirm({
                    plain:true,
                    scope:$scope,
                    template:require("./distribute/distribute.html"),
                    controller:require("./distribute/distributeController"),
                    width:"70%",
                    appendClassName:"ngdialog_p10"
                }).catch(()=>{});

            }else{
                //正在分发中
                layui.layer.msg($translate.instant("distributing"),{icon:3,time:2000});
            }
            
            layui.layer.closeAll('tips');
        };

        //更新
        $scope.update=()=>{
            if($scope.isUpdate){
                let dialog=ngDialog.openConfirm({
                    plain:true,
                    scope:$scope,
                    template:require("./update/update.html"),
                    controller:require("./update/updateController"),
                    width:"70%",
                    appendClassName:"ngdialog_p100"
                }).catch(()=>{});

            }else{
                //正在更新中
                layui.layer.msg($translate.instant("updating"),{icon:3,time:2000});
            }
            
            layui.layer.closeAll('tips');
        };

        //删除
        $scope.delete=()=>{
            if($scope.isDelete){
                let dialog=ngDialog.openConfirm({
                    plain:true,
                    scope:$scope,
                    template:require("./delete/delete.html"),
                    controller:require("./delete/deleteController"),
                    width:"70%",
                    appendClassName:"ngdialog_p100"
                }).catch(()=>{});

            }else{
                //正在删除中
                layui.layer.msg($translate.instant("deleting"),{icon:3,time:2000});
            }
           
            layui.layer.closeAll('tips');
        };

        //重试
        $scope.retry=()=>{
            let url=commonMethod.getServerUrl()+"/rest/";
            let ids=$scope.selectItems.mapp(value=>{
                if(value.operationResult==2)return value.id
            });
            if(ids.length==0){
                layui.layer.msg($translate.instant("selectFail"),{icon:2,time:2000});
                return
            }

            $http.post(url,ids).then(({data})=>{
              if(data.success){

                $scope.getPageData();
              }
                
            },err=>{})

        };

        $scope.init();

        //监听内容状态改变事件
        $scope.$on("contentOTTChange",function(e,data){
          
            //同种指令运行中则不能进行同种类型的操作
            if(data.status==1){//正在进行中
                switch (data.commandType){
                    case "OTTContentInjectionReq":
                        $scope.isInject=false;
                    break;
                    case "OTTContentDistributeReq":
                        $scope.isDistribute=false;
                    break;
                    case "OTTContentUpdateReq":
                        $scope.isUpdate=false;
                    break;
                    case "OTTContentDeleteReq":
                        $scope.isDelete=false;
                    break;
                }
            }else {
                $scope.isInject=true;
                $scope.isDistribute=true;
                $scope.isUpdate=true;
                $scope.isDelete=true;
            }
            
  
            //流水号相同的更新进程
            for(let index=0;index<$scope.items.length;index++){
                let value=$scope.items[index];
                if(value.streamingNo==data.streamingNo){
                    // 更新状态和进程
                    $(".operationResult"+index).text("--");
                    for(let {id,name} of contentService.operationResult){
                        if(data.status==id){
                            $(".operationResult"+index).text(name);
                            break
                        }

                    }
                    layui.element.progress('progress'+index, data.progress);
                    
                    break;
                }
            };
            
            
        });
        
    };
    module.exports=contentOTTCtrl;

})(angular.module("app"));