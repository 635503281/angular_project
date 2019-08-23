(function(Components){
    "use strict";

    Components.directive("myIframe",[function(){
        return{
            restrict:"E",
            replace:true,
            scope:{
                myId:"@",//iframe的id 必填
                linkUrl:"@",//直接外链url（linkUrl与url二选一）
                url:"@",//通过接口获取地址的接口url
                link:"@",//是否给#main添加lick名   
            },
            template:`<div class="myIframe">
                <iframe id="{{myId}}" style="position:absolute;width:100%;height:100%;border:0;" 
                    ng-src="{{iframeUrl}}">
                </iframe>
            </div>`,
            controller:["$scope","$http","$rootScope","$sce","commonMethod","$translate","$timeout",function($scope,$http,$rootScope,$sce,commonMethod,$translate,$timeout){
                //初始化
                $scope.init=()=>{
                    //添加外链样式
                    if(eval($scope.link))$("#main").addClass('link');
                    
                    $rootScope.loading=true;
            
                    $scope.getIframeUrl();        
                };    
                
                //获取外链地址
                $scope.getIframeUrl=()=>{
                    if($scope.linkUrl){
                        $scope.iframeUrl=$sce.trustAsResourceUrl($scope.linkUrl);
                        $scope.watchIframe($scope.myId);

                    }else if($scope.url){
                        let url=commonMethod.getServerUrl()+$scope.url;
                        $http.get(url,{headers:{noLoading:true}}).then(({data})=>{
                            if(data.success){
                                let str=data.data.split("#/")[0];
                                let format1=data.data.split("://")[1];
                                // 判断url是否配置正确
                                if((data.data.includes("#/")&&str)||format1){
                                    $scope.iframeUrl=$sce.trustAsResourceUrl(data.data); 
                                    $scope.watchIframe($scope.myId);
                                }else{
                                    commonMethod.layuiTip($translate.instant("urlConfigErr"),"notice",0);
                                }
                                    
                            }

                        }).catch(()=>{});
                    }
                   
                };

                //监测是否链接完
                $scope.watchIframe=(id)=>{
                    $timeout(function(){
                        let iframe=document.getElementById(id);
                        if (iframe.attachEvent){
                            iframe.attachEvent("onload", function(){
                                $scope.$apply(function(){$rootScope.loading=false;});
                            });
                        }else{
                            iframe.onload = function(){
                                $scope.$apply(function(){$rootScope.loading=false;});
                            };
                        }

                    })
    
                };
                
                $scope.init();

            }],
        }

    }]);

})(angular.module('Components'));