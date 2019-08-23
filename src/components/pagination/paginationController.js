
(function(Components){
    "use strict";
    
    require("./pagination.less");
    /*
    *使用 <pagination paging-options="pagingOptions" get-page-data="getPageData()"></pagination>
    *传 pagingOptions变量和getPageData函数
    */
    Components.directive("pagination",[function(){
        return {
            restrict:'E',
            replace:true,
            scope:{
                pagingOptions:"=",
                getPageData:"&"
            },
            template:require("./pagination.html"),
            controller:["$scope","$translate",function($scope,$translate){
                // $scope.pagingOptions={
                //     pageSizes: [10, 20, 30, 50, 100],
                //     pageSize: 10,
                //     currentPage: 1,
                //     total: 0,// 存放list总记录数
                //     maxPages: 1,// 最大页数
                // }

                //页数list
                $scope.pages=[1];

                //下拉选择条目转换
                $scope.pageSizes=$scope.pagingOptions.pageSizes.map(function(value,index){
                    return {size:value,name:value+$translate.instant("pagingOptions.unit")}
                });

                //判断是否可以向前一页或者跳转到第一页
                $scope.cantPageBackward = function() {
                    // can go to first
                    if ($scope.pagingOptions) {
                        if ($scope.pagingOptions.currentPage <= 1) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }

                };

                //判断是否可以向后一页或者跳转到末页
                $scope.cantPageForward = function() {
                    if ($scope.pagingOptions) {
                        if ($scope.pagingOptions.currentPage < $scope.pagingOptions.maxPages) {
                            return false;
                        } else {
                            return true;
                        }
                    }

                };
 
                //跳转到第一页
                $scope.goFirstPage = function() {
                    if ($scope.pagingOptions) {
                        $scope.pagingOptions.currentPage = 1;
                        //$scope.getPageData();
                    }
                };

                //跳转到上一页
                $scope.goPreviousPage = function() {
                    if ($scope.pagingOptions) {
                        if ($scope.pagingOptions.currentPage > 1) {
                            $scope.pagingOptions.currentPage = parseInt($scope.pagingOptions.currentPage) - 1;
                        }
                        //$scope.getPageData();
                    }
                };
  
                //跳转到下一页
                $scope.goNextPage = function() {
                    if ($scope.pagingOptions) {

                        if ($scope.pagingOptions.currentPage < $scope.pagingOptions.maxPages) {
                            $scope.pagingOptions.currentPage = parseInt($scope.pagingOptions.currentPage) + 1;
                        }
                        //$scope.getPageData();
                    }
                };

                //跳转到末页
                $scope.goLastPage = function() {
                    $scope.pagingOptions.currentPage = $scope.pagingOptions.maxPages;
                    //$scope.getPageData();
                };

                //跳到指定某页
                $scope.goPage=function(i,index){
                    if(i)$scope.pagingOptions.currentPage=i;
                    else{//省略号跳到前后5页
                        if(index==1)$scope.pagingOptions.currentPage=$scope.pagingOptions.currentPage-4;
                        else $scope.pagingOptions.currentPage=$scope.pagingOptions.currentPage+4;
                        
                    }
                };
                
                //监视翻页
                $scope.$watch('pagingOptions', function(newVal, oldVal) {
                    if (newVal.currentPage !== oldVal.currentPage) {
                        if ($scope.pagingOptions.currentPage != '') {
                            if (!isNaN($scope.pagingOptions.currentPage)) {// 为数字
                                if ($scope.pagingOptions.currentPage > $scope.pagingOptions.maxPages) {
                                    $scope.pagingOptions.currentPage = $scope.pagingOptions.maxPages;
                                }else{
                                   if($scope.pagingOptions.currentPage)$scope.getPageData();
                                }
                               
                            } else {
                                // 不为数字
                                $scope.pagingOptions.currentPage = oldVal.currentPage;
                                
                            }
                        }else if(newVal.currentPage==0){//如果为0，则为1
                            $scope.pagingOptions.currentPage=1;
                        }

                    }else{
                        if($scope.pagingOptions.currentPage>$scope.pagingOptions.maxPages&&$scope.pagingOptions.maxPages!=0){
                            $scope.pagingOptions.currentPage=$scope.pagingOptions.maxPages;
                        }
                    }

                    //监听每页个数变化
                    if (newVal.pageSize !==oldVal.pageSize) {
                        if($scope.pagingOptions.currentPage==1)$scope.getPageData();
                        else $scope.pagingOptions.currentPage = 1;
                    }

                    //最大页数为0时,变为1
                    if(newVal.maxPages==0)$scope.pagingOptions.maxPages=1;
                    else{
                        //生成pages列表
                        $scope.changePages();       
                    }

                }, true);

                //生成pages列表
                $scope.changePages=function(){
                    $scope.pages=[];

                    if($scope.pagingOptions.maxPages<=6){//最大页数小于等于6个的时候，不用显示省略号
                        for(let i=1;i<=$scope.pagingOptions.maxPages;i++){
                            $scope.pages.push(i);
                        }
                    }else{
                        //用0代表省略号的位置
                        if($scope.pagingOptions.currentPage<=4){
                            for(let i=2;i<6;i++){
                                $scope.pages.push(i);
                            }
                            $scope.pages.push(0);
                        }else if($scope.pagingOptions.currentPage>4&&$scope.pagingOptions.currentPage<$scope.pagingOptions.maxPages-3){
                            $scope.pages.push(0);
                            for(let i=$scope.pagingOptions.currentPage-2;i<=$scope.pagingOptions.currentPage+2;i++){
                                $scope.pages.push(i);
                            }
                            $scope.pages.push(0);

                        }else if($scope.pagingOptions.currentPage>=$scope.pagingOptions.maxPages-3){
                            $scope.pages.push(0);
                            for(let i=$scope.pagingOptions.maxPages-4;i<$scope.pagingOptions.maxPages;i++){
                                $scope.pages.push(i);
                            }

                        }
                        $scope.pages.unshift(1);
                        $scope.pages.push($scope.pagingOptions.maxPages);
                               
                    }
                    
                };

                //检查currentPage
                $scope.checkCurrentPage=function(){
                    if($scope.pagingOptions.currentPage==null){
                        $scope.pagingOptions.currentPage=1;
                        
                    }
                }

            }]

        }
    }])


})(angular.module('Components'));