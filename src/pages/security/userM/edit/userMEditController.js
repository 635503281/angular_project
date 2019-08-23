(function(app){
    "use strict";

    const {encodeAES}=require("../../../../js/jiami");

    app.controller("userMEditCtrl",userMEditCtrl);
    userMEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod"];
    function userMEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);
            
            //确认密码值
            $scope.confirmPassword=null;

            //获取角色
            $scope.getRoleList();

            if($scope.id==0){//添加

                $scope.item={
                    role:null,//角色id
                    name:null,//用户名
                    password:null,//密码
                    enable:false,//是否激活
                    email:null,//邮件
                    telephone:null,//手机
                    description:null,//描述
                    createUser:sessionStorage.getItem("userName")//创建者
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/userManagement/user/getUser?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;

                        $scope.item.telephone=parseInt($scope.item.telephone);
                    }
                    
                }).catch((err)=>{});
            }

        };

        //获取角色列表
        $scope.getRoleList=()=>{
            let url=commonMethod.getServerUrl()+"/rest/roleManagement/role/getList?first=-1&max=-1";
            $http.get(url,{headers:{noLoading:true}}).then(({data})=>{
                if(data.success&&data.data.list.length>0){
                    $scope.roleList=data.data.list;
                }
            }).catch(()=>{});
        };
        
        //保存
        $scope.save=()=>{
       
            if($scope.id==0){//添加
                //生成16位的key
                let key="";
                for(let i=0;i<16;i++){
                    if($scope.item.name[i])key+=$scope.item.name[i];
                    else key+="1";
                }

                let url=commonMethod.getServerUrl()+"/rest/userManagement/user/addUser";
                //密码加密
                let obj=angular.copy($scope.item);
                obj.password=encodeAES(key,obj.password);
    
                $http.post(url,obj).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("add_S")).then($scope.return);
                    }
                   
                }).catch((err)=>{});
                
            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/userManagement/user/modifyUser";
                $http.post(url,$scope.item).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("modify_S")).then($scope.return);
                    }    
                   
                }).catch((err)=>{});

            }

        };

        //取消
        $scope.return=()=>{
            $state.go("index.security.userM.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=userMEditCtrl;

})(angular.module("app"));