(function(){
    "use strict";

    module.exports=["$scope","$rootScope","$http","$translate","commonMethod","contentService","ngDialog",
            function($scope,$rootScope,$http,$translate,commonMethod,contentService,ngDialog){
        
        //初始化        
        $scope.init=()=>{
            //数据对象      
            $scope.allItems=$scope.layerItems.map(value=>value.contentInject);

            //是否禁用所有
            $scope.forbiddenAll=false;

            //分页参数
            $scope.pagingOptions={
                pageSizes: [10, 20, 30, 50, 100 , 200],
                pageSize: 10,
                currentPage: 1,
                total: 0,// 存放list总记录数
                maxPages: 1,// 最大页数
            };

            $scope.getPageData();
        };  

        //初始化table
        $scope.initTab=(tab,length,key,i)=>{
            setTimeout(function(){
                let flag=true;
                layui.table.init(tab,{
                    limit:length,//渲染显示的个数  
                    done:function(res){
                        if(res.data&&res.data.length>0){
                            res.data[0].LAY_CHECKED=true;
                        }else{
                            res.data=[];
                        }
                        
                        if(flag){
                            setTimeout(function(){
                                layui.table.reload( tab,{data:res.data,limit:length});
                                layui.element.init();

                                //解决上传状态条初始化问题
                                if($('.fileProgress').length>0){
                                    $(".fileProgress").width("100%");
                                }
                                
                            },0);
                            flag=false;
                        }     
                        
                    }
                });
                layui.table.on(`radio(${tab})`,function(obj){
                    $scope.$apply(function(){
                        let  value=$scope.$eval(obj.data.value);
                        console.log(value);
             
                        switch(key){
                            case "matchInjectPolicyList":
                                $scope.allItems[i].delayedHours=value.delayedHours;
                                $scope.allItems[i].dailyStartTime=value.dailyStartTime;
                                $scope.allItems[i].dailyEndTime=value.dailyEndTime;
                            break;
                            case "matchDistributePolicyList":
                                 $scope.allItems[i].distributeNodes=value.distributeNodes;
                                
                            break;
                            case "matchSyncPolicyList":
                                $scope.allItems[i].syncNodes=value.syncNodes;

                            break;
                        }
                        
                    });
                    
                });
            },0);
            
            
        };

        //分页
        $scope.getPageData=()=>{
            $scope.pagingOptions.total=$scope.layerItems.length;
            $scope.pagingOptions.maxPages=Math.ceil($scope.pagingOptions.total/$scope.pagingOptions.pageSize);
            $scope.items=$scope.layerItems.slice(($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,$scope.pagingOptions.currentPage*$scope.pagingOptions.pageSize);
        }

        //全部禁用
        $scope.forbiddenA=flag=>{
              $(".layui-table-cell input").attr("disabled",flag);layui.form.render();   
              if(flag){
                $scope.layerItems.map(value=>{
                    value.injectD=false;
                    value.distributeD=false;
                    value.syncD=false;
                });
              }  
        };

        //局部禁用
        $scope.forbiddenI=(flag,id)=>{
            $(`#${id}+div .layui-table-cell input`).attr("disabled",flag);layui.form.render();
        };

        //注入
        $scope.layerInject=()=>{
            //处理数据
            let arr=angular.copy($scope.allItems);
            arr.map(function(obj,i){
                //处理distributeNodes和syncNodes
                if(Array.isArray($scope.layerItems[i].contentInject.distributeNodes)){
                      obj.distributeNodes=$scope.layerItems[i].contentInject.distributeNodes.map(value=>value.nodeID);
                }else obj.distributeNodes=[];  
                if(Array.isArray($scope.layerItems[i].contentInject.syncNodes)){
                      obj.syncNodes=$scope.layerItems[i].contentInject.syncNodes.map(value=>value.nodeID);
                }else obj.syncNodes=[];

                //禁用所有
                if($scope.forbiddenAll){
                    obj.delayedHours=null;
                    obj.dailyStartTime=null;
                    obj.dailyEndTime=null;
                    obj.distributeNodes=[];
                    obj.syncNodes=[];
                }else{
                    //是否禁用单条
                    if($scope.layerItems[i].injectD){
                        obj.delayedHours=null;
                        obj.dailyStartTime=null;
                        obj.dailyEndTime=null;
                    }
                    if($scope.layerItems[i].distributeD)obj.distributeNodes=[];
                    if($scope.layerItems[i].syncD)obj.syncNodes=[];
                }

            });
            
            $scope.loading=true;//注入中
            let url=commonMethod.getServerUrl()+"/rest/content/contentInject";
            $http.post(url,arr,{headers:{noLoading:true}}).then(({data})=>{
                if(data.success){
                    $scope.loading=false;
                    // 提示信息
                    for(let {id,name} of contentService.operationResult){
                        if(data.data==id){
                            switch(data.data){
                                case 1://运行中
                                    commonMethod.layuiTip($translate.instant("sameContent"),"err");
                                break;
                                case 2:
                                case 4:
                                    commonMethod.layuiTip(name,"err").then(function(){
                                        $rootScope.$emit("injectFinish");
                                    });
                                    
                                break;
                                case -1:
                                    commonMethod.layuiTip(name,"notice").then(function(){
                                        $rootScope.$emit("injectFinish");
                                    });
                                    
                                break;
                                default:
                                    commonMethod.layuiTip(name).then(function(){
                                        $rootScope.$emit("injectFinish");
                                    });
                                   
                                break;
                            }

                            break;
                        }
                    }
                    ngDialog.closeAll();
                    
                }else{
                    $scope.loading=false;
                }
            }).catch(()=>{ $scope.loading=false;}); 

        };

        $scope.init();

    }];

})();