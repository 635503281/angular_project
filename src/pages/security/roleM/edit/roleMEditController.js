(function(app){
    "use strict";

    app.controller("roleMEditCtrl",roleMEditCtrl);
    roleMEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","menuService"];
    function roleMEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,menuService){
        layui.use('dtree',function(){
            //初始化
            $scope.init=()=>{
                //传过来的id值
                $scope.id=parseInt($stateParams.id);

                let url=commonMethod.getServerUrl()+"/rest/roleManagement/role/getRole?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;

                        let arr=menuService.changeTreeData(angular.copy($scope.item.permissionRoot.children),{name:"title",selected:"checkArr"});
                        $scope.makeTree(arr);
                    }
                    
                }).catch((err)=>{});
 
            };

            //生成权限数tree
            $scope.makeTree=arr=>{
                let arrList=menuService.treeTransArray(angular.copy($scope.item.permissionRoot.children),"children");
                $scope.tree= layui.dtree.render({
                    elem: "#tree",
                    data:arr, 
                    dot:false,
                    ficon:"0",
                    icon:"0",
                    checkbar: true,  
                    checkbarType: "all", // 默认就是all，其他的值为： no-all  p-casc   self  only
                    checkbarFun:{
                        chooseBefore:function($i,node){
                            //changeCheck事件对于非最后一级才有用（isLeaf=false)
                            let flag = true;
                            if(node.ischecked == "0"){
                                for(let menu of arrList){
                                    if(String(node.nodeId)===String(menu.id)&&menu.related){
                                        let selectedArr=layui.dtree.getCheckbarNodesParam("tree");
                                        for(let selectMenu of selectedArr){
                                            if(String(selectMenu.nodeId)===String(menu.related))return flag   
                                        }
                                        flag=false;
                                        $scope.tree.checkStatus($i).noCheck();
                                        if(node.isLeaf == false)$scope.tree.changeCheck();
                                        break;
                                    }
                                }
                         
                            }else{
                                for(let menu of arrList){
                                    if(String(node.nodeId)===String(menu.related)){
                                        $scope.tree.checkStatus($(`i.dtree-theme-checkbox[data-id=${menu.id}]`)).noCheck();
                                        if(node.isLeaf == false)$scope.tree.changeCheck();
                                    }
                                }
                            }
                            
                            return flag
                        }
                    }
                });
            };
            
            //保存
            $scope.save=async()=>{
                let url=commonMethod.getServerUrl()+"/rest/roleManagement/role/addRole";//添加
                if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/roleManagement/role/modifyRole";//修改
                //只要id（即tree中的nodeId）
                $scope.item.rolePermissions= layui.dtree.getCheckbarNodesParam("tree").map(value=>value.nodeId);
                $scope.item.permissionRoot=null;
                
                try{
                    let {data}=await $http.post(url,$scope.item);
                    if(data.success){
                        let msg=$scope.id==0?$translate.instant("add_S"):$translate.instant("modify_S");
                        commonMethod.layuiTip(msg).then($scope.return);
                    }

                }catch(e){}
               
            };

            //取消
            $scope.return=()=>{
                $state.go("index.security.roleM.list",{flag:1});
            };

            $scope.init();
        });
     
    };
    module.exports=roleMEditCtrl;

})(angular.module("app"));