(function(app){
    "use strict";

    app.controller("receiveConfigCtrl",receiveConfigCtrl);
    receiveConfigCtrl.$inject=["$scope","$http","$translate","$state","commonMethod","ngDialog"];
    function receiveConfigCtrl($scope,$http,$translate,$state,commonMethod,ngDialog){
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

            //查询字段
            $scope.searchOptions={
                times:null,//时间
                node_id:null,//节点
                nodeName:null,
                transactionID:null,//消息ID
                commandType:null,//指令类型
                filePath:null,//文件路径
            };

            //展示数据
            $scope.items=[];

            //CCS SNS节点列表
            //nodeService.getSCNodeList().then(list=>{
            //  list[0].nodeName=$translate.instant("all");
            //   $scope.nodeList=list;
            //});

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"nodeID",title:$translate.instant("nodeID"),align:"left",minWidth:140,
                    templet:`<div>{{d.recvRecord.nodeID||"--"}}</div>`
                    },
                    {field:"nodeName",title:$translate.instant("nodeName"),align:"left",minWidth:150,
                    templet:`<div>{{d.recvRecord.nodeName||"--"}}</div>`
                    },
                    {field:"ip",title:$translate.instant("ip"),align:"left",minWidth:180,
                    templet:`<div>{{d.recvRecord.ip||"--"}}</div>`
                    },
                    {field:"commandType",title:$translate.instant("commandType"),align:"left",minWidth:150,
                    templet:`<div>{{d.recvRecord.commandType||"--"}}</div>`
                    },
                    {field:"transactionID",title:$translate.instant("transactionID"),align:"left",minWidth:120,
                     templet:`<div>{{d.recvRecord.transactionID||"--"}}</div>`
                    },
                    {field:"filePath",title:$translate.instant("filePath"),align:"left",minWidth:300,width:"30%",
                     templet:d=>{
                        let path=JSON.stringify(d.recvRecord.filePath).replace(/\"/g,"'");
                        return `<span><a class="blue" title="${d.recvRecord.filePath}" onClick="angular.element(this).scope().readXml(${path})">${d.recvRecord.filePath||"--"}</a></span>` 
                     }   
                    },
                    {field:"success",title:$translate.instant("status"),align:"left",minWidth:120,
                     templet:d=>{
                         if(d.recvRecord.success)return $translate.instant("success");
                         else return $translate.instant("fail");
                     }
                    },
                    {field:"errorMessage",title:$translate.instant("errorMessage"),align:"left",minWidth:150,width:"20%",
                     templet:`<div>{{d.recvRecord.errorMessage||"--"}}</div>` 
                    },
                    {field:"createTime",title:$translate.instant("createTime"),sort:true,align:"left",width:160,
                    templet:`<div>{{new Date(d.recvRecord.createTime).format("yyyy-MM-dd hh:mm:ss")}}</div>`
                    }
                    
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数
                
            });

            $scope.getPageData();
        };

        //分页
        $scope.getPageData=function(){
            let url=commonMethod.getServerUrl()+"/rest/getRecvRecords";//接收配置

            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,

                // node_id:$scope.searchOptions.node_id,
                nodeName:$scope.searchOptions.nodeName?$scope.searchOptions.nodeName:null,
                transactionID:$scope.searchOptions.transactionID,
                commandType:$scope.searchOptions.commandType,
                filePath:$scope.searchOptions.filePath,
                startTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[0]:null,
                endTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[1]:null,
            }
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

        //查询
        $scope.search=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getPageData();
        };

        //读xml文件
        $scope.readXml=(path)=>{
            if(path){
                let url=commonMethod.getServerUrl()+"/rest/downloadRecordXmlFile?filePath="+path.replace(/\\/g,"%5C").replace(/\//g,"%2F");
                $http.get(url,{headers:{showErr:true}}).then(({data})=>{
                    if(data&&(typeof data)=='string'){
                        if($(".layui-layer").length>0)layui.layer.closeAll();
                        ngDialog.openConfirm({
                            plain:true,
                            appendClassName: "commonDialog",
                            width: '70%',
                            template:`<div class="commonDialog_box">
                                <h3 class="commonTip_tip">${path}</h3>
                                <form style="padding-bottom:32px;">
                                    <div class="commonDialog_main" style="max-height:600px;overflow:auto;"><xmp style="margin:0;">${data}</xmp></div>
                                </form>
                            </div>
                            `
                        }).catch(()=>{});

                    }else{
                        if(data.displayMessage||data.errorMessage){
                            commonMethod.layuiTip(data.displayMessage||data.errorMessage,'err');
                            return
                        }
                        
                        commonMethod.layuiTip($translate.instant("file_noExist"),'notice');
                    }

                }).catch(()=>{});

            }       
            
        };

        $scope.init();
    };
    module.exports=receiveConfigCtrl;

})(angular.module("app"));