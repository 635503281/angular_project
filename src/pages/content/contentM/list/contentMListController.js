(function(app){
    "use strict";

    app.controller("contentMListCtrl",contentMListCtrl);
    contentMListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","nodeService","commonMethod","ngDialog","contentService","$filter"];
    function contentMListCtrl($scope,$rootScope,$http,$translate,$state,nodeService,commonMethod,ngDialog,contentService,$filter){ 
        //初始化
        $scope.init=async()=>{
            //tablist
            $scope.tabList=[
                {id:1,name:$translate.instant("currentContent"),isShow:true},
                {id:2,name:$translate.instant("historyContent"),isShow:true}
            ];
            //当前tab页
            $scope.currentTab=$filter('filter')($scope.tabList,{isShow:true})[0]?$filter('filter')($scope.tabList,{isShow:true})[0].id:0;

            //分页参数
            $scope.pagingOptions={
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                currentPage: 1,
                total: 0,// 存放list总记录数
                maxPages: 1,// 最大页数
            };

            //指令类型
            $scope.commandType=Object.assign({null:$translate.instant("all")},contentService.commandType);
            delete $scope.commandType.contentQueryReq;

            //操作结果
            $scope.operationResult=[{id:null,name:$translate.instant("all")},...contentService.operationResult];

            $rootScope.loading=true;
            //节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("all")}];
            $scope.nodeList=(await nodeService.getSCNodeList()).map(value=>{
                if(value.nodeID==null)value.nodeName=$translate.instant("all");
                return value
            });
            
            //展示数据
            $scope.items=[
                // {   
                //     createTime:1536717447000,
                //     nodeName:"test",
                //     commandType:"contentUpdateReq",
                //     cpId:"1",
                //     contentId:"1",
                //     contentName:"test",
                //     contentUrlDir:"test12sdfgsdgdgsgfsdgsdgsdgsdgsdgsdgsd",
                //     operationResult:0,//2-fail, 1-running, 0-success, -1-unknown
                //     progress:40,         
                // }
            ];

            //选中数据
            $scope.selectItems=[];

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
            //选中数据
            $scope.selectItems=[];
            $scope.noData=true;

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
                contentUrlDir:null,//内容URL或目录 
                operationResult:null,//操作结果
                commandType:"null",//指令类型
                times:null//时间
            };

            let toolbar='';
            switch(index){
                case 1://当前内容
                    toolbar=`<div><div class="operation_btn">
                    <button class="btn icon_search {{${$rootScope.contentM.contentQueryBtn}?'':'none'}}" lay-event="query" title=${$rootScope.contentM.contentQueryName}></button>
                    {{#  if(d.operationResult==1||d.operationResult==5||d.operationResult==7){ }}
                    <button class="btn icon_cancel cancelBtn{{d.LAY_TABLE_INDEX}} {{${$rootScope.contentM.cancelBtn}?'':'none'}}" lay-event="cancel" title=${$rootScope.contentM.cancelName}></button>
                    {{#  } else { }}
                    <button class="btn icon_cancel cancelBtn{{d.LAY_TABLE_INDEX}} {{${$rootScope.contentM.cancelBtn}?'':'none'}}" lay-event="cancel" title=${$rootScope.contentM.cancelName} disabled></button>
                    {{#  } }}  
                 </div></div>`
                    
                break;
                case 2://历史内容
                    toolbar=`<div><div class="operation_btn">
                    <button class="btn icon_search {{${$rootScope.contentM.contentQueryBtn}?'':'none'}}" lay-event="query" title=${$rootScope.contentM.contentQueryName}></button>
                    {{#  if(d.operationResult==2||d.operationResult==4||d.operationResult==6){ }}
                    <button class="btn icon_reset retryBtn{{d.LAY_TABLE_INDEX}} {{${$rootScope.contentM.retryBtn}?'':'none'}}" lay-event="retry" title=${$rootScope.contentM.retryName}></button>
                    {{#  } else { }}
                    <button class="btn icon_reset retryBtn{{d.LAY_TABLE_INDEX}} {{${$rootScope.contentM.retryBtn}?'':'none'}}" lay-event="retry" title=${$rootScope.contentM.retryName} disabled></button>
                    {{#  } }}   
                </div></div>`

                break;
            }
            
            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"nodeId",title:$translate.instant("nodeName"),align:"left",fixed:"left",minWidth:150,
                     templet:d=>{
                         for(let{nodeID,nodeName} of $scope.nodeList){
                             if(d.nodeId==nodeID&&d.nodeId)return nodeName
                         }
                         return d.nodeId||"--"
                     }
                    },  
                    {field:"createTime",title:$translate.instant("createTime"),sort:true,align:"left",width:160,
                     templet:`<div><span title="{{new Date(d.createTime).format('yyyy-MM-dd hh:mm:ss')}}">
                                {{new Date(d.createTime).format('yyyy-MM-dd hh:mm:ss')}}
                            </span></div>`
                    },
                    {field:"commandType",title:$translate.instant("commandType"),align:"left",minWidth:120,
                     templet:function(d){
                        for(let key in contentService.commandType){   
                            if(d.commandTypeAnother&&key==d.commandTypeAnother){
                                return contentService.commandType[key]
                            }else if(!d.commandTypeAnother&&key==d.commandType){
                                return contentService.commandType[key]
                            }
                        }
                        return "--"
                     }
                    },
                    {field:"cpId",title:$translate.instant("cpId"),align:"left",minWidth:120,
                     templet:`<div>{{d.cpId||"--"}}</div>`
                    },
                    {field:"contentId",title:$translate.instant("contentId"),align:"left",minWidth:200,
                     templet:`<div>{{d.contentId||"--"}}</div>`
                    },
                    {field:"contentName",title:$translate.instant("contentName"),align:"left",minWidth:200,
                     templet:`<div>{{d.contentName||"--"}}</div>`
                    },
                    {field:"contentUrlDir",title:$translate.instant("contentUrlDir"),align:"left",minWidth:200,
                     templet:`<div><span title="{{d.contentUrlDir}}">{{d.contentUrlDir||"--"}}</span></div>`
                    },
                    {field:"message",title:$translate.instant("message"),align:"left",minWidth:200,
                     templet:`<div><span class="message{{d.LAY_TABLE_INDEX}}" title="{{d.message}}">{{d.message||"--"}}</span></div>`
                    },
                    {field:"responseType",title:$translate.instant("responseType"),align:"left",minWidth:140,
                     templet:d=>{
                        switch(d.responseType){
                            case 0 :return $translate.instant("noNeed");break;
                            case 1 :return $translate.instant("need");break;      
                        }
                        return $translate.instant("noNeed")
                     }
                    },
                    {field:"operationResult",title:$translate.instant("operationResult"),fixed:"right",align:"left",width:130,
                     templet:function(d){
                        for(let {id,name} of contentService.operationResult){//操作结果
                            if(d.operationResult==id)return `<span class="operationResult${d.LAY_TABLE_INDEX}">${name}</span>`
                        }
                        return `<span class="operationResult${d.LAY_TABLE_INDEX}"">--</span>`
                     }
                    },  
                    {field:"progress",title:$translate.instant("progress"),align:"left",fixed:"right",width:120,
                     templet:`<div>
                        {{#  if(d.progress!=null){ }}
                        <div class="layui-progress layui-progress-big mid progress{{d.LAY_TABLE_INDEX}}" lay-filter="progress{{d.LAY_TABLE_INDEX}}" lay-showpercent="true">
                            <span class="null"></span>
                            {{#  if(d.operationResult==0){ }}
                            <div class="layui-progress-bar layui-bg-blue"  lay-percent={{d.progress}}% ></div>
                            {{#  } else if(d.operationResult==1) { }}
                            <div class="layui-progress-bar"  lay-percent={{d.progress}}% ></div>
                            {{#  } else { }}
                            <div class="layui-progress-bar layui-bg-red"  lay-percent={{d.progress}}% ></div>
                            {{#  } }}
                        </div>
                        {{#  } else { }}
                        <div class="layui-progress layui-progress-big mid progress{{d.LAY_TABLE_INDEX}} bg-t" lay-filter="progress{{d.LAY_TABLE_INDEX}}" lay-showpercent="true">
                            <span class="null">--</span>
                            <div class="layui-progress-bar"  lay-percent></div>
                        </div>
                        {{#  } }}
                     </div>`
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:toolbar
                    } 
                       
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

            //重试、查询、取消
            layui.table.on("tool(tab)",function({data,event}){
                let data1=data;
                switch(event){
                    case "retry"://重试
                        commonMethod.commonTip({tip:$translate.instant("isRetry")}).then(function(){
                            let retryUrl=commonMethod.getServerUrl()+"/rest/content/contentOperateRetry";
                            $http.post(retryUrl,data1).then(({data})=>{        
                                if(data.success){
                                    //是否是注入重试
                                    if(data1.commandType=="contentInjectionReq"||data1.commandType=="contentInjectionBatchReq"){
                                        if((data.data[0].matchDistributePolicyList&&data.data[0].matchDistributePolicyList.length>0)||
                                            (data.data[0].matchInjectPolicyList&&data.data[0].matchInjectPolicyList.length>0)||
                                            (data.data[0].matchSyncPolicyList&&data.data[0].matchSyncPolicyList.length>0)){

                                            $scope.layerItems=data.data.map((value,index)=>{
                                                value.id=index;
                                                if(value.matchDistributePolicyList&&value.matchDistributePolicyList.length>0)value.matchDistributePolicyList[0].LAY_CHECKED=true;
                                                if(value.matchInjectPolicyList&&value.matchInjectPolicyList.length>0)value.matchInjectPolicyList[0].LAY_CHECKED=true;
                                                if(value.matchSyncPolicyList&&value.matchSyncPolicyList.length>0)value.matchSyncPolicyList[0].LAY_CHECKED=true;
                        
                                                value.injectD=false;value.distributeD=false;value.syncD=false;
                                                return value
                                            });
                                            
                                            //匹配策略
                                            ngDialog.openConfirm({
                                                plain:true,
                                                scope:$scope,
                                                template:require("../inject/layer/injectLayer.html"),
                                                controller:require("../inject/layer/injectLayer"),
                                                width:"70%",
                                                showClose: false,
                                                closeByDocument :false,
                                                appendClassName:"commonDialog"
                                            }).catch(()=>{});
    
                                            //刷新列表
                                            $rootScope.$on("injectFinish",function(){
                                                $scope.pagingOptions.currentPage=1;
                                                $scope.getPageData();
                                            });

                                        }else{
                                            let url1=commonMethod.getServerUrl()+"/rest/content/contentInject";
                                            $http.post(url1,[data.data[0].contentInject]).then(({data})=>{
                                                if(data.success){
                                                    // 提示信息
                                                    for(let {id,name} of contentService.operationResult){
                                                        if(data.data==id){
                                                            switch(data.data){
                                                                case 1://运行中
                                                                    commonMethod.layuiTip($translate.instant("sameContent"),"err");
                                                                break;
                                                                case 2:
                                                                case 4: 
                                                                    commonMethod.layuiTip(name,"err").then(()=>{
                                                                        $scope.pagingOptions.currentPage=1;
                                                                        $scope.getPageData();
                                                                    });  
                                                                break;
                                                                case -1:
                                                                    commonMethod.layuiTip(name,"notice").then(()=>{
                                                                        $scope.pagingOptions.currentPage=1;
                                                                        $scope.getPageData();
                                                                    });  
                                                                break;
                                                                default:
                                                                    commonMethod.layuiTip(name).then(()=>{
                                                                        $scope.pagingOptions.currentPage=1;
                                                                        $scope.getPageData();
                                                                    });
                                                                
                                                                break;
                                                            }
                                
                                                            break;
                                                        }
                                                    }
                                                    
                                                }

                                            }).catch(()=>{ });

                                        }

                                    }else{
                                        commonMethod.layuiTip($translate.instant("retry_S")).then(function(){
                                            $scope.pagingOptions.currentPage=1;
                                            $scope.getPageData();  
                                        });
                                        
                                    }
                                      
                                }
                                                
                            }).catch((err)=>{});

                        },()=>{});
                             
                    break;
                    case "query"://查询
                        let queryUrl=commonMethod.getServerUrl()+"/rest/content/contentQuery";
                        let obj={
                            nodeId:data1.nodeId,
                            cpId:data1.cpId,
                            contentId:data1.contentId,
                            contentUrl:data1.contentUrlDir,
                        };
                        $http.post(queryUrl,obj).then(({data})=>{
                            if(data.success){
                                layui.layer.open({
                                    type: 1,
                                    title: false,
                                    area: ['60%', '400px'],
                                    closeBtn: 1,
                                    shadeClose: true,
                                    skin: 'commonDialog',
                                    content: `
                                     <div class="commonDialog_box">
                                        <h3>${$translate.instant("contentQuery")}</h3>
                                        <form>
                                            <div class="commonDialog_main">
                                                <div class="square_box">
                                                    <div><p>${$translate.instant("cpId")}</p><p>${data.data.cpId?data.data.cpId:"--"}</p></div>
                                                    <div><p>${$translate.instant("contentUrl")}</p><p>${data.data.contentUrl?data.data.contentUrl:"--"}</p></div>
                                                    <div><p>${$translate.instant("contentId")}</p><p>${data.data.contentId?data.data.contentId:"--"}</p></div>
                                                    <div><p>${$translate.instant("contentName")}</p><p>${data.data.contentName?data.data.contentName:"--"}</p></div>
                                                    <div><p>${$translate.instant("contentSize")}</p><p>${data.data.contentSize!=null?data.data.contentSize:"--"}</p></div>
                                                </div>  

                                            </div>
                                        </form>
                                    </div>
                                    `
                                });
                            }
                        },err=>{});
                        
                    break;
                    case "cancel"://取消
                        commonMethod.commonTip({tip:$translate.instant("isCancel")}).then(function(){
                            let cancelUrl=commonMethod.getServerUrl()+"/rest/content/contentCancel?id="+data1.id;
                            $http.get(cancelUrl).then(({data})=>{
                                if(data.success){
                                    commonMethod.layuiTip($translate.instant("cancel_S"));
                                    $scope.getPageData();
                                }

                            },err=>{})

                        },()=>{});
                        
                    break;

                }

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

            let url=commonMethod.getServerUrl();
            switch($scope.currentTab){
                case 1:url+="/rest/content/getContentOperationList";break;
                case 2:url+="/rest/content/getContentOperationHistoryList";break;
            }
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,
                
                startTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[0]:null,
                endTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[1]:null,
                nodeId:$scope.searchOptions.nodeId,
                cpId:$scope.searchOptions.cpId,
                contentUrlDir:$scope.searchOptions.contentUrlDir,
                operationResult:$scope.searchOptions.operationResult,
                commandType:$scope.searchOptions.commandType!="null"?$scope.searchOptions.commandType:null
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

        //重置
        $scope.reset=()=>{
            $scope.searchOptions={
                nodeId:null,
                cpId:null,
                contentUrlDir:null,
                operationResult:null,
                commandType:"null",
                times:null
            };
            $scope.search();
        };

        //批量注入
        // $scope.injectMore=()=>{
        //     commonMethod.fileUpload({
        //         title:$translate.instant('injectMore'),
        //         isTemplateDownLoad:true,
        //         templateDownLoadUrl:'static/assets/file/inject_template.xlsx',
        //         url:'/rest/content/matchFilePolicy',
        //         isAutoUpload:true,
        //         types:['xls','xlsx'],
        //         formatError:'fileFormatError',
        //         notes:[$translate.instant('inject_tip1'),$translate.instant('inject_tip2')],
        //         success:function(data){
        //             return new Promise((resolve,reject)=>{
        //                 //解决状态条初始化问题
        //                 setTimeout(function(){$(".fileProgress").width("100%")},100);

        //                 $scope.layerItems=data.data.map((value,index)=>{
        //                     value.id=index;
        //                     if(value.matchDistributePolicyList&&value.matchDistributePolicyList.length>0)value.matchDistributePolicyList[0].LAY_CHECKED=true;
        //                     if(value.matchInjectPolicyList&&value.matchInjectPolicyList.length>0)value.matchInjectPolicyList[0].LAY_CHECKED=true;
        //                     if(value.matchSyncPolicyList&&value.matchSyncPolicyList.length>0)value.matchSyncPolicyList[0].LAY_CHECKED=true;
    
        //                     value.injectD=false;value.distributeD=false;value.syncD=false;
        //                     return value
        //                 });

        //                 //匹配策略
        //                 ngDialog.openConfirm({
        //                     plain:true,
        //                     scope:$scope,
        //                     template:require("../inject/layer/injectLayer.html"),
        //                     controller:require("../inject/layer/injectLayer"),
        //                     width:"70%",
        //                     showClose: false,
        //                     closeByDocument :false,
        //                     appendClassName:"commonDialog"
        //                 }).catch(()=>{});
                        
        //             })
        //         }
                
        //     }).catch(()=>{});

        //     //刷新列表
        //     $rootScope.$on("injectFinish",function(){
        //         if($scope.pagingOptions.currentPage==1)$scope.getPageData();
        //         else $scope.pagingOptions.currentPage=1; 
        //     });

        // };

        //批量同步、分发、更新、删除、注入
        $scope.importMore=(title,templateUrl,url)=>{
            commonMethod.fileUpload({
                title:$translate.instant(title),
                isTemplateDownLoad:true,
                templateDownLoadUrl:templateUrl,
                url:url,
                isAutoUpload:true,
                types:['xls','xlsx'],
                formatError:'fileFormatError',
                notes:[$translate.instant('inject_tip2')],
                success:function(data){
                    return new Promise((resolve,reject)=>{
                        //直接提示在运行中
                        if(data.success){
                            resolve();
                            commonMethod.layuiTip($translate.instant("fileIsRuning")).then(()=>{
                                if($scope.pagingOptions.currentPage==1)$scope.getPageData();
                                else $scope.pagingOptions.currentPage=1;
                            });
                            
                        }
                    })
                }
                
            }).catch(()=>{});
            
        };
        
        $scope.init();

        //监听内容状态改变事件
        $scope.$on("contentMChange",function(e,data){
            // data:{
            //     streamingNo:null,//流水号
            //     commandType://指令类型，判断是否能够继续点同类型的下发
            //     status:2-fail, 1-running, 0-success, -1-unneeded（unknown）取模
            //     progress:0-100
            //     contentId
            //     cpId
            //     contentUrl
            //     message
            //     serviceIp
            // }

       
            //流水号相同的更新进程
            for(let index=0;index<$scope.items.length;index++){
                let value=$scope.items[index];
                if(value.streamingNo==data.streamingNo){
                    // 更新状态
                    $(".operationResult"+index).text("--");
                    for(let {id,name} of contentService.operationResult){
                        if(data.status==id){
                            $(".operationResult"+index).text(name);
                            break
                        }
                    }

                    // 更新进度条，如果有进程则更新进度条，没有进度则显示--
                    if(data.progress){
                        $(".progress"+index).removeClass("bg-t").find(".null").text("");
                        layui.element.progress('progress'+index, data.progress+"%");
                        // 给进度条添加不同的颜色                       
                        $(".progress"+index).find(".layui-progress-bar").removeClass("layui-bg-blue").removeClass("layui-bg-red");
                        switch (data.status) {
                            case 0:$(".progress"+index).find(".layui-progress-bar").addClass("layui-bg-blue"); break;
                            case 1:     break;
                            default:$(".progress"+index).find(".layui-progress-bar").addClass("layui-bg-red"); break;
                        }

                    }else{
                        $(".progress"+index).addClass("bg-t").find(".null").text("--");
                        layui.element.progress('progress'+index, '');
                    }

                    // 更新操作按钮的状态
                    switch (data.status){
                        case 1://取消按钮能点，其他状态不能点
                        case 5:
                            $(".cancelBtn"+index).removeAttr("disabled");
                            $(".retryBtn"+index).attr('disabled',"true");
                        break;
                        case 2://重试按钮能点，其他状态不能点
                        case 4:
                        case 6:
                            $(".retryBtn"+index).removeAttr("disabled");
                            $(".cancelBtn"+index).attr('disabled',"true");
                        break;
                        default:
                            $(".cancelBtn"+index).attr('disabled',"true");
                            $(".retryBtn"+index).attr('disabled',"true");
                        break;
                    }
                    
                    // 更新message
                    let msg=data.message||"--";
                    $(".message"+index).text(msg);

                    // 同步更新$scope.items中的数据
                    $scope.items[index].operationResult=data.status;
                    $scope.items[index].progress=data.progress;
                        
                    break;
                }
            };
   
        });

    };
    module.exports=contentMListCtrl;

})(angular.module("app"));