(function(app){
    "use strict";

    app.controller("safeChainEditCtrl",safeChainEditCtrl);
    safeChainEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod"];
    function safeChainEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            //防盗链算法
            $scope.templateIDList=[
                {id:null,name:$translate.instant("nothing")},{id:"8000000101",name:$translate.instant("migu_AES")}
            ];

            //选择开闭
            $scope.selectList=[
                {id:0,name:$translate.instant("close")},{id:1,name:$translate.instant("open")}
            ];

            //IP校验模式
            $scope.ipvalidModeList=[
                {id:1,name:$translate.instant("ipvalidMode_1")},{id:2,name:$translate.instant("ipvalidMode_2")},{id:3,name:$translate.instant("ipvalidMode_3")},
            ];

            let miguSelfDefParamVO={
                keyValue:null,//AES加密秘钥
                keyVersion:null,//秘钥版本
                keyEffectiveDate:null,//秘钥生效期
                dualTokenValidTime:null,//新旧秘钥共存期(s)
                masterIndexSecurity:0,//是否对一级索引做防盗链鉴权,1为开启，0为关闭  
                rateIndexSecurity:0,//是否对码率速率做防盗链鉴权,1为开启，0为关闭
                segmentalFileSecurity:0,//是否对分片做防盗链鉴权,1为开启，0为关闭
                masterIndexTimestampCheck:0,//是否对一级索引文件做时戳校验,1为开启，0为关闭
                rateIndexTimestampCheck:0,//是否对码率索引文件做时戳校验,1为开启，0为关闭
                segmentalFileTimestampCheck:0,//否对分片文件做时戳校验,1为开启，0为关闭
                masterIndexURLValidTime:null,//一级索引文件做时戳校验时使用的有效期,最大86400
                rateIndexURLValidTime:null,//码率索引文件做时戳校验时使用的有效期,最大86400
                segmentalFileURLValidTime:null,//分片文件做时戳校验时使用的有效期,最大86400
                dwnldFileSecurity:0,//是否对下载类文件做防盗链鉴权,1为开启，0为关闭
                dwnldFileTimestampCheck:0,//是否对下载类文件做时戳校验,1为开启，0为关闭
                dwnldFileURLValidTime:null,//下载类文件做时戳校验时使用的有效期,最大86400
                ipvalidMode:1,//IP校验模式,1-强制校验IP，2-不校验IP，3-抢占式校验
            }

            if($scope.id==0){//添加

                $scope.item={
                    authID:null,//防盗链ID
                    authName:null,//防盗链名称
                    templateID:null,//防盗链算法ID
                    templateName:null,//防盗链算法名称
                    authSwitch:false,//防盗链开关(传值为0 、1)  
                    miguSelfDefParamVO:miguSelfDefParamVO

                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/auth/getAntiTheftChain";
                $http.post(url,{id:$scope.id}).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data.list[0];
                        //处理数据
                        $scope.item.authSwitch=$scope.item.authSwitch==1?true:false;
                        // 删除miguSelfDefParam，复制miguSelfDefParamVO
                        $scope.item.miguSelfDefParamVO=angular.copy($scope.item.miguSelfDefParam);
                        delete $scope.item.miguSelfDefParam;

                        $scope.item.authID=Number($scope.item.authID);
                        
                        if(!$scope.item.miguSelfDefParamVO){
                            $scope.item.miguSelfDefParamVO=miguSelfDefParamVO;
                        }else{
                            $scope.item.miguSelfDefParamVO.keyEffectiveDate=new Date($scope.item.miguSelfDefParamVO.keyEffectiveDate).format("yyyy-MM-dd hh:mm:ss");
                        }
                    }
                    
                }).catch((err)=>{});
            }

        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/auth/addAntiTheftChain";//添加
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/auth/modifyAntiTheftChain";//修改

            //处理数据
            let obj=angular.copy($scope.item);
            obj.authSwitch=obj.authSwitch?1:0;
            obj.miguSelfDefParamVO.keyEffectiveDate=Date.parse(obj.miguSelfDefParamVO.keyEffectiveDate);
            // 自动填充templateName
            for(let value of $scope.templateIDList.values()){
                if(value.id==obj.templateID){
                    obj.templateName=value.name;
                    break; 
                }
            }
            $http.post(url,obj).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.authentication.safeChain.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=safeChainEditCtrl;

})(angular.module("app"));