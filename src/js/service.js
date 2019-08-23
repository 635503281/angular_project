
(function(){
    "use strict";

    angular.module("Services",[])
    .service("commonMethod",["$rootScope","$injector","$translate","$q",function($rootScope,$injector,$translate,$q){
        let strPath = window.document.location.pathname; 
        let appName = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        let serverUrl = window.location.origin + appName;
        return {
            //获取地址
            getServerUrl:()=>serverUrl,

            //确认取消弹框
    		confirmDialog: message=>{//使用时要带上失败回调不然会报错 如：commonMethod.confirmDialog(value).catch(function(){})
                $rootScope.message = message; 
                return $injector.get('ngDialog').openConfirm({ 
                    template:require("../template/confirmDlg.html"),
                    plain:true,//template是一个路径，要是直接写html结构的话，必须加上plain:true使用纯字符串作为模板
                    className: 'ngdialog-theme-default',
                    scope: $rootScope,
                    closeByDocument: false,
                    width:350,
               
                })
            },

            //提示弹框
            tipDialog: message=>{
                   $rootScope.message = message;
                   return $injector.get('ngDialog').openConfirm({
                       template:require("../template/tipDlg.html"),
                       plain:true,
                       className: 'ngdialog-theme-default',
                       scope: $rootScope,
                       closeByDocument: false,
                       width:350
                   })
            },

            //layui确认弹出框
            layuiConfirm:(message,ti)=>{
                let title=ti||$translate.instant('tip_title');
                let defer=$q.defer();
                layui.layer.confirm(message,{
                        icon:3,
                        title:title,
                        btn:[$translate.instant('ok'),$translate.instant('cancel')]
                    },

                    function(index){
                        defer.resolve();
                        layui.layer.close(index);
                    }
                   
                )

                return defer.promise

            },

            //layui提示框
            layuiOpen:(message,ti)=>{
                let title=ti||$translate.instant('tip_title');
                let defer=$q.defer();
                layui.layer.open({
                    title: title,
                    content:message,
                    btn:[$translate.instant('ok')],
                    yes:function(index){
                        defer.resolve();
                        layui.layer.close(index);
                    }
                });
                return defer.promise
            },

            //延时提示
            layuiTip:(message,icon="success",time=2000)=>{
                /**
                 * message ->提示消息
                 * icon ->图标 默认成功
                 * time ->超时时间 默认2000ms
                 */  
                var defer = $q.defer();
                layui.layer.msg(message,{time,icon},function(){
                    defer.resolve();
                });
                return defer.promise    
            },

            //table/list中的定位删除弹框
            listDelTip: function(message, target, direction) {
                /**
                 * message:提示信息
                 * target：目标元素
                 * direction 方向 默认3在下面
                 **/
                var direction = direction || 3;
                var defer = $q.defer();
                layui.layer.tips(message, target, {
                    time: 0,
                    tips: [direction, "#fff"],
                    skin: "listDelTip",
                    btn: [$translate.instant("cancel"), $translate.instant("ok")],
                    btn2: function(index) {
                        defer.resolve();
                        layui.layer.close(index);
                    }

                });
                return defer.promise

            },

            //通用确认弹框
            commonTip: function(obj) {
                /**params为对象{tip,icon,message,type,timeout}
                 * tip:提示信息
                 * icon:图标 success/err/notice/annotation
                 * message：另外的信息 默认null
                 * type:弹框类型 1-确认弹框(2个按钮) 2-提示弹框(1个按钮),默认1
                 * timeout:关闭时间(ms) ,默认0，不关闭
                 **/
                return $injector.get('ngDialog').openConfirm({
                    template:require("../template/commonTip.html"),
                    plain:true,
                    appendClassName: "commonTip",
                    showClose: false,
                    closeByDocument :false,
                    width: 408,
                    controller: ["$scope", "$interval", function($scope, $interval) {
                        $scope.tip = obj.tip;
                        $scope.icon = obj.icon || "notice";
                        $scope.message = obj.message || null;
                        $scope.type = obj.type || 1;
                        $scope.timeout = (obj.timeout || 0) / 1000;
                        $scope.timeoutType = typeof $scope.timeout;

                        if ($scope.timeout != 0 && $scope.timeoutType == "number") {
                            var time = $interval(function() {
                                if ($scope.timeout-- == 0) {
                                    $scope.confirm('Save');
                                    $interval.cancel(time);
                                }
                            }, 1000);
                        }
                    }]
                });

            },

            //单个文件上传
            fileUpload:function(obj){
                let defaultConfig={
                    title:$translate.instant("uploadFile"),//标题
                    showClose:true,//是否显示关闭
                    url:null, // 请求接口
                    isTemplateDownLoad:false,//是否有模板下载
                    templateDownLoadUrl:null,//模板下载地址
                    isAutoUpload:false,//是否自动上传（选择完文件自动上传）
                    types:[],//校验文件类型
                    formatError:"fileFormatError_C",//文件格式错误提示
                    notes:[],//注意事项
                    success:function(data){//上传成功执行函数promise
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise 
                    },
                }
                obj=Object.assign(defaultConfig,obj);
                //添加注意事项标题
                if(obj.notes.length>0)obj.notes.unshift($translate.instant('considerations'));

                return $injector.get('ngDialog').openConfirm({
                    template:require("../template/fileUpload.html"),
                    plain:true,
                    appendClassName: "commonDialog",
                    showClose: obj.showClose,
                    closeByDocument :false,
                    width: "60%",
                    controller: ["$scope","commonMethod","Upload","$translate", function($scope, commonMethod,Upload,$translate) {
                        //初始化
                        $scope.init=()=>{
                            //选择的文件
                            $scope.loadFile = null;

                            $scope.config=obj;
                        };
    
                        //选择文件
                        $scope.selectFile = function(file){
                            $scope.errMsg=null;
                            $scope.loadFile=null;
                            $(".fileProgress").removeClass("layui-bg-red").addClass("layui-bg-blue").width(0);

                            if(file){
                                // 有文件类型校验
                                if($scope.config.types.length>0){
                                    //校验文件格式
                                    let fileType= file.name.split(".").pop();
                                    if(!$scope.config.types.includes(fileType)){
                                        commonMethod.layuiTip($translate.instant($scope.config.formatError),"notice");
                                        return 
                                    }
                                }

                                $scope.loadFile=file;
                                //是否自动上传
                                if($scope.config.isAutoUpload){
                                    $scope.submit();
                                }else{
                                    $(".fileName").removeClass("finish");
                                    $(".fileStatus").removeClass("red").text("");
                                    $(".fileOperation_btn").removeClass("none");
                                }  
                                
                            }
                           
                        };
    
                        //重试
                        $scope.retry=(file,i)=>{
                            $scope.submit();
                        };
    
                        //删除
                        $scope.del=()=>{
                            $scope.loadFile=null;
                            $scope.errMsg=null;
                        };

                        //提交
                        $scope.submit = function() {
                            $(".fileProgress").removeClass("layui-bg-red").addClass("layui-bg-blue").width(0);
                            $(".fileName").removeClass("finish");
                            $(".fileStatus").removeClass("red").text("");
                            $(".fileOperation_btn").removeClass("none");

                            $scope.errMsg=null;
                            let url=commonMethod.getServerUrl()+$scope.config.url;;
                            if($scope.loadFile){
                                Upload.upload({
                                    url: url,
                                    data: {file: $scope.loadFile},
                                    headers: {
                                        'Content-Type': 'multipart/form-data;',
                                        "noLoading":true,
                                    }
                                }).then(function (resp) {
                                    $(".fileName").addClass("finish");
                                    if(resp.data.success){
                                        $(".fileStatus").text(`${$translate.instant("upload_S")}`);
                                        $(".fileOperation_btn").addClass("none");

                                        //成功回调
                                        if($scope.config.success){
                                            $scope.config.success(resp.data).then($scope.closeThisDialog);
                                        }  

                                    }else{
                                        $(".fileProgress").removeClass("layui-bg-blue").addClass("layui-bg-red");
                                        $(".fileStatus").addClass("red").text(`${$translate.instant("upload_F")}`);

                                        $scope.errMsg=resp.data.displayMessage||resp.data.errorMessage;
                                    }
                                    
                                },
                                err=>{
                                    console.log('Error status: ' + err.status);
                                },
                                evt=> {//上传中
                                    let progressPercentage = parseInt(100.0 * evt.loaded / evt.total) + "%";
                                    layui.element.progress('progress', progressPercentage);
                                    $(".fileStatus").text(`${$translate.instant("upload_L")}`);
                                });

                            }
                        };
    
                        $scope.init();
                    }]
                });
            },

            // 时间戳转化成时间格式
            getNewDate:time=>{
                let date=new Date(time);
                let newDate={
                    year:date.getFullYear(),
                    month:(date.getMonth()+1)<10?"0"+(date.getMonth()+1):date.getMonth()+1,
                    ri:date.getDate()<10?"0"+date.getDate():date.getDate(),
                    hours:date.getHours()<10?"0"+date.getHours():date.getHours(),
                    minutes:date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes(),
                    seconds:date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds()
                };
                
                return `${newDate.year}-${newDate.month}-${newDate.ri}  ${newDate.hours}:${newDate.minutes}:${newDate.seconds}`;
            },

        }

    }])
    .service("loginService",["$state","$injector",function($state,$injector){

        return{
            isLogin: function () {
                var loginBool=false;
                var loginFlag = sessionStorage.getItem("cdnc_login");
                var cdnc_token= sessionStorage.getItem("cdnc_token");
            	if(loginFlag=="true"&&cdnc_token){
            		loginBool=true;
            	}
            	return loginBool;
            },

            setLoginFlag: function (value) {
                sessionStorage.setItem("cdnc_login", value);
            },

            setToken: function (value) {
                sessionStorage.setItem("cdnc_token", value);
            },

            getToken: function () {
            	var token = sessionStorage.getItem("cdnc_token");
                return token;
            },

            setMenu:function(menu){
                sessionStorage.setItem("cdnc_menu", JSON.stringify(menu));
            },
            getMenu:function(){
                var menu=sessionStorage.getItem("cdnc_menu");
                return JSON.parse(menu)
            },

            //获取语言列表
            getLangList:()=>{
                let defer=$injector.get("$q").defer();
                if(sessionStorage.getItem("langList")&&sessionStorage.getItem("lang")){
                    defer.resolve([JSON.parse(sessionStorage.getItem("langList")),sessionStorage.getItem("lang")]);

                }else{
                    let url=$injector.get("commonMethod").getServerUrl()+"/rest/v1/getLanguages"; 
                    $injector.get("$http").get(url,{headers:{noLoading:true,page:"login"}}).then(({data})=>{
                        if(data.success&&data.data){
                            let langList=[];
                            let defaultLang='zh-cn';
                            if(data.data.available_locales&&data.data.available_locales.length>0){
                                langList=data.data.available_locales.separate(2).map(value=>{
                                    let lang=value[0].toLowerCase().replace("_","-");//处理语言
                                    return {lang,name:value[1]}
                                });
                                sessionStorage.setItem("langList",JSON.stringify(langList));
                            }
                            if(data.data.default_locale){
                                defaultLang=data.data.default_locale.toLowerCase().replace("_","-");  
                            }
                            sessionStorage.setItem("lang",defaultLang);
                            
                            defer.resolve([langList,defaultLang]);

                        }else defer.reject([[],null]);
                        
                    }).catch(e=>{console.log(e);defer.reject([[],null])});
                }   

                return defer.promise
            },

            exit:function(){
                // 调用退出接口
                let url=$injector.get("commonMethod").getServerUrl()+"/rest/v1/logout";
                $injector.get("$http").delete(url,{headers:{responseError:true}}).then(function({data}){
                    this.clear();

                }.bind(this))
                .catch(function(e){ this.clear(); }.bind(this));
      
            },

            //清理sessiont并跳到登录页面
            clear:function(){
                //清空所有sessionStorage
                for(var key in sessionStorage){
                    if(key != "lang") sessionStorage.removeItem(key);
                }
                //关闭所有的弹框
                $injector.get('ngDialog').closeAll();
                $state.go("login");
            }


        }

    }])
    .service("nodeService",["$q","$http","$translate","commonMethod",function($q,$http,$translate,commonMethod){
        const item1={nodeID:null,nodeName:$translate.instant("nothing")};
        const item2={groupID:null,groupName:$translate.instant("nothing")};

        return {
            // 节点类型(SNS->5、9、10、13)(CCS->4、8、10)
            nodeTypeList:[
                {id:1,name:$translate.instant("nodeType_1"),type:"OMS"},
                {id:2,name:$translate.instant("nodeType_2"),type:"TCS"},
                {id:3,name:$translate.instant("nodeType_3"),type:"GCS"},
                {id:4,name:$translate.instant("nodeType_4"),type:"CCS"},
                {id:5,name:$translate.instant("nodeType_5"),type:"SNS"},
                {id:6,name:$translate.instant("nodeType_6"),type:"CRS"},
                {id:7,name:$translate.instant("nodeType_7"),type:"LTC"},
                {id:8,name:$translate.instant("nodeType_8"),type:"CCS"},
                {id:9,name:$translate.instant("nodeType_9"),type:"SNS"},
                {id:10,name:$translate.instant("nodeType_10"),type:"CCS_SNS"},
                {id:11,name:$translate.instant("nodeType_11"),type:"WebCache"},
                {id:12,name:$translate.instant("nodeType_12"),type:"LTC"},
                {id:13,name:$translate.instant("nodeType_13"),type:"SNS"},
                {id:14,name:$translate.instant("nodeType_14"),type:"IBS"},
                {id:0,name:$translate.instant("nodeType_0"),type:"OTHER"}
            ],
    
            //设备类型
            deviceTypeList:[
                {id:1,name:$translate.instant("deviceType_1")},
                {id:2,name:$translate.instant("deviceType_2")},
                {id:3,name:$translate.instant("deviceType_3")},
                {id:4,name:$translate.instant("deviceType_4")},
                {id:5,name:$translate.instant("deviceType_5")},
                {id:6,name:$translate.instant("deviceType_6")},
                {id:7,name:$translate.instant("deviceType_7")},
                {id:8,name:$translate.instant("deviceType_8")},
                {id:9,name:$translate.instant("deviceType_9")},
                {id:0,name:$translate.instant("other")},
            ],

            //运行模式
            serviceModeList:[
                {id:0,name:$translate.instant("serviceMode_0")},
                {id:1,name:$translate.instant("serviceMode_1")},
                {id:2,name:$translate.instant("serviceMode_2")},
                {id:3,name:$translate.instant("serviceMode_3")},
                {id:4,name:$translate.instant("serviceMode_4")},
            ],

            //服务的类型
            contentModeList:[
                {id:0,name:$translate.instant("contentMode_0")},
                {id:1,name:$translate.instant("contentMode_1")},
                {id:2,name:$translate.instant("contentMode_2")},
                {id:3,name:$translate.instant("contentMode_3")},
            ],

            //调度方式
            dispatchTypeList:[
                {id:1,name:$translate.instant("dispatchType_1")},
                {id:2,name:$translate.instant("dispatchType_2")}
            ],

            //群组类型
            groupTypeList:[
                {id:1,name:$translate.instant("groupType_1")},
                {id:2,name:$translate.instant("groupType_2")},
                {id:3,name:$translate.instant("groupType_3")},
                {id:4,name:$translate.instant("groupType_4")},
                {id:5,name:$translate.instant("groupType_5")},
                {id:0,name:$translate.instant("groupType_0")},
            ],

            //默认空值
            defaultNode:item1,

            //默认空值
            defaultGroup:item2,

            //获取SNS节点列表
            getSNSNodeList:function(headers){
                const item1={nodeID:null,nodeName:$translate.instant("nothing")};
                let headerObj={headers:{noLoading:true}};
                if(headers)Object.assign(headerObj,headers.headers);

                let defer=$q.defer();
                let url=commonMethod.getServerUrl()+"/rest/common/node/querySNSNodeEntry";
                $http.get(url,headerObj).then(({data})=>{
                    if(data.success){
                        let list=data.data.list;
                        if(!list)list=[];
                        list.unshift(item1);
                        defer.resolve(list);
                    }else{
                        defer.resolve([item1]);
                    }

                }).catch((err)=>{defer.resolve([item1])});

                return defer.promise
            },

            //获取CCS节点列表
            getCCSNodeList:function(headers){
                const item1={nodeID:null,nodeName:$translate.instant("nothing")};
                let headerObj={headers:{noLoading:true}};
                if(headers)Object.assign(headerObj,headers.headers);

                let defer=$q.defer();
                let url=commonMethod.getServerUrl()+"/rest/common/node/queryCCSNodeEntry";
                $http.get(url,headerObj).then(({data})=>{
                    if(data.success){
                        let list=data.data.list;
                        if(!list)list=[];
                        list.unshift(item1);
                        defer.resolve(list);
                    }else{
                        defer.resolve([item1]);
                    }

                }).catch((err)=>{defer.resolve([item1])});

                return defer.promise
            },

            //获取SNS和CCS节点列表[4,5,8,9,10,13]
            getSCNodeList:function(){
                let arr=[4,5,8,9,10,13];
                return this.getNodeList(arr)
            },

            //获取节点列表
            getNodeList:function(arr){//nodeTypes传数组  [4,8,10]-CCS; [5,9,10,13]-SNS; [7,12]-LTC  
                if(arr){
                    const item1={nodeID:null,nodeName:$translate.instant("nothing")};
                    let defer=$q.defer();
                    let url=commonMethod.getServerUrl()+"/rest/common/node/queryNodeEntryByNodeType?nodeTypes="+arr;
                    $http.get(url,{headers:{noLoading:true}}).then(({data})=>{
                        if(data.success){
                            let list=data.data.list;
                            if(!list)list=[];
                            list.unshift(item1);
                            defer.resolve(list);
                        }else{
                            defer.resolve([item1]);
                        }

                    }).catch((err)=>{defer.resolve([item1])});

                    return defer.promise
                }
                
            },

            //获取所有的节点列表
            getAllNodeList:()=>{
                const item1={id:null,nodeID:null,nodeName:$translate.instant("nothing")};
                let defer=$q.defer();
                let url=commonMethod.getServerUrl()+"/rest/common/node/queryNodeEntry";
                $http.get(url,{headers:{noLoading:true}}).then(({data})=>{
                    if(data.success){
                        let list=data.data.list;
                        if(!list)list=[];
                        list.unshift(item1);
                        defer.resolve(list);
                    }else{
                        defer.resolve([item1]);
                    }

                }).catch((err)=>{defer.resolve([item1])});

                return defer.promise
            },

            //根据节点获取分组
            getGroupByNode:(nodeId,headers)=>{
                const item2={groupID:null,groupName:$translate.instant("nothing")};
                let headerObj={headers:{noLoading:true}};
                if(headers)Object.assign(headerObj,headers.headers);

                let url=commonMethod.getServerUrl()+"/rest/common/node/queryGroupEntry";
                if(nodeId)url=commonMethod.getServerUrl()+"/rest/common/node/queryGroupEntry?nodeId="+nodeId;

                let defer=$q.defer();
                $http.get(url,headerObj).then(({data})=>{
                    if(data.success){
                        let list=data.data.list;
                        if(!list)list=[];
                        list.unshift(item2);
                        defer.resolve(list);
                    }else{
                        defer.resolve([item2]);
                    }

                }).catch((err)=>{defer.resolve([item2])});

                return defer.promise
               
            },

            //根据节点获取设备
            getDeviceByNode:nodeId=>{
                const item3={deviceId:null,deviceName:$translate.instant("nothing")};
                let url=commonMethod.getServerUrl()+"/rest/common/node/queryDeviceEntry"
                if(nodeId)url=commonMethod.getServerUrl()+"/rest/common/node/queryDeviceEntry?nodeId"+nodeId;
                   
                let defer=$q.defer();
                $http.get(url,{headers:{noLoading:true}}).then(({data})=>{
                    if(data.success){
                        let list=data.data.list;
                        if(!list)list=[];
                        list.unshift(item3);
                        defer.resolve(list);
                    }else{
                        defer.resolve([item3]);
                    }

                }).catch((err)=>{defer.resolve([item3])});

                return defer.promise
            }

        } 

    }])
    .service("contentService",["$translate",function($translate){
        return {
            //指令类型
            commandType:{
                contentInjectionReq:$translate.instant("contentInjectionReq"),
                contentInjectionBatchReq:$translate.instant("contentInjectionBatchReq"),
                contentDistributeReq:$translate.instant("contentDistributeReq"),
                contentDistributeBatchReq:$translate.instant("contentDistributeBatchReq"),
                contentSynchronizationReq:$translate.instant("contentSynchronizationReq"),
                contentSynchronizationBatchReq:$translate.instant("contentSynchronizationBatchReq"),
                contentUpdateReq:$translate.instant("contentUpdateReq"),
                contentUpdateBatchReq:$translate.instant("contentUpdateBatchReq"),
                contentDeleteReq:$translate.instant("contentDeleteReq"),
                contentDeleteBatchReq:$translate.instant("contentDeleteBatchReq"),
                contentQueryReq:$translate.instant("contentQueryReq")
            },

            //OTT指令类型
            ottCommandType:{
                OTTContentInjectionReq:$translate.instant("OTTContentInjectionReq"),
                OTTContentDistributeReq:$translate.instant("OTTContentDistributeReq"),
                OTTContentUpdateReq:$translate.instant("OTTContentUpdateReq"),
                OTTContentDeleteReq:$translate.instant("OTTContentDeleteReq")
            },

            //操作结果
            operationResult:[
                {id:7,name:$translate.instant("delayedIssued")},//延时下发
                {id:6,name:$translate.instant("msgCancel")},//消息已取消
                {id:5,name:$translate.instant("msgSend")},//消息已发送
                {id:4,name:$translate.instant("msgFail")},//消息发送失败
                {id:3,name:$translate.instant("msgSuccess")},//消息发送成功
                {id:2,name:$translate.instant("fail")},//失败
                {id:1,name:$translate.instant("running")},//进行中
                {id:0,name:$translate.instant("success")},//成功
                {id:-1,name:$translate.instant("unknown")}//未知
            ],

        }
    }])
    .service("cpService", ["$q", "$http", "$translate", "commonMethod", function ($q, $http, $translate, commonMethod) {
        const item1 = {cpId: null, name: $translate.instant("nothing")};
        const item2 = {id: null, domainName: $translate.instant("nothing")};

        return {
            //默认空值
            defaultCp: item1,

            //默认空值
            defaultDomain: item2,

            //获取CP列表
            getCpList: function () {
                const item1 = {cpId: null, name: $translate.instant("nothing")};
                let defer = $q.defer();
                let url = commonMethod.getServerUrl() + "/rest/v1/dispatch/cpManagement/queryCpEntry";
                $http.get(url,{headers:{noLoading:true}}).then(({data}) => {
                    if(data.success){
                        let list = data.data.list;
                        if (!list) list = [];
                        list.unshift(item1);
                        defer.resolve(list);
                    }else defer.resolve([item1]);

				}).catch((err) => {
					defer.resolve([item1]);
				});
                return defer.promise
            },
            
            //根据cpId获取域名列表
            getDomainByCp: (cpId) => {
				if(cpId) {
                    const item2 = {id: null, domainName: $translate.instant("nothing")};
					let defer = $q.defer();
                    let url = commonMethod.getServerUrl() + "/rest/v1/dispatch/cpManagement/getDomainList?cpId=" + cpId;
                    $http.get(url,{headers:{noLoading:true}}).then(({data}) => {
                        if(data.success){	
							let list = data.data.list;
							if (!list)list = [];
                            list.unshift(item2);
							defer.resolve(list);
						}else defer.resolve([item2]);
						
					}).catch((err) => {
                        defer.resolve([item2]);
					});

                    return defer.promise
                }
            }
        }
    }])
    .service("publicService",["$translate","$http","commonMethod",function($translate,$http,commonMethod){

        return{
            //省份标号
            provinceList:[
                {id:null,name:$translate.instant("nothing"),alias:null},
                {id:"01",name:$translate.instant("BJ"),alias:"BJ"},//北京
                {id:"02",name:$translate.instant("TJ"),alias:"TJ"},//天津
                {id:"03",name:$translate.instant("HE"),alias:"HE"},//河北
                {id:"04",name:$translate.instant("SX"),alias:"SX"},//山西
                {id:"05",name:$translate.instant("NM"),alias:"NM"},//内蒙古
                {id:"06",name:$translate.instant("LN"),alias:"LN"},//辽宁
                {id:"07",name:$translate.instant("JL"),alias:"JL"},//吉林
                {id:"08",name:$translate.instant("HL"),alias:"HL"},//黑龙江
                {id:"09",name:$translate.instant("SH"),alias:"SH"},//上海
                {id:"10",name:$translate.instant("JS"),alias:"JS"},//江苏
                {id:"11",name:$translate.instant("ZJ"),alias:"ZJ"},//浙江
                {id:"12",name:$translate.instant("AH"),alias:"AH"},//安徽
                {id:"13",name:$translate.instant("FJ"),alias:"FJ"},//福建
                {id:"14",name:$translate.instant("JX"),alias:"JX"},//江西
                {id:"15",name:$translate.instant("SD"),alias:"SD"},//山东
                {id:"16",name:$translate.instant("HA"),alias:"HA"},//河南
                {id:"17",name:$translate.instant("HB"),alias:"HB"},//湖北
                {id:"18",name:$translate.instant("HN"),alias:"HN"},//湖南
                {id:"19",name:$translate.instant("GD"),alias:"GD"},//广东
                {id:"20",name:$translate.instant("HI"),alias:"HI"},//海南
                {id:"21",name:$translate.instant("GX"),alias:"GX"},//广西
                {id:"22",name:$translate.instant("CQ"),alias:"CQ"},//重庆
                {id:"23",name:$translate.instant("SC"),alias:"SC"},//四川
                {id:"24",name:$translate.instant("GZ"),alias:"GZ"},//贵州
                {id:"25",name:$translate.instant("YN"),alias:"YN"},//云南
                {id:"26",name:$translate.instant("SN"),alias:"SN"},//陕西
                {id:"27",name:$translate.instant("GS"),alias:"GS"},//甘肃
                {id:"28",name:$translate.instant("QH"),alias:"QH"},//青海
                {id:"29",name:$translate.instant("NX"),alias:"NX"},//宁夏
                {id:"30",name:$translate.instant("XJ"),alias:"XJ"},//新疆
                {id:"31",name:$translate.instant("XZ"),alias:"XZ"},//西藏
            ],

            //城市编号
            cityList:[
                {id:null,name:$translate.instant("nothing")},
                {id:"010",name:$translate.instant("citys.010")},//北京
                {id:"021",name:$translate.instant("citys.021")},//上海
                {id:"022",name:$translate.instant("citys.022")},//天津
                {id:"023",name:$translate.instant("citys.023")},//重庆
                {id:"024",name:$translate.instant("citys.024")},//沈阳
                {id:"0299",name:$translate.instant("citys.0299")},//雄安新区
                {id:"0310",name:$translate.instant("citys.0310")},//邯郸
                {id:"0311",name:$translate.instant("citys.0311")},//石家庄
                {id:"0312",name:$translate.instant("citys.0312")},//保定
                {id:"0313",name:$translate.instant("citys.0313")},//张家口
                {id:"0314",name:$translate.instant("citys.0314")},//承德
                {id:"0315",name:$translate.instant("citys.0315")},//唐山
                {id:"0316",name:$translate.instant("citys.0316")},//廊坊
                {id:"0317",name:$translate.instant("citys.0317")},//沧州
                {id:"0318",name:$translate.instant("citys.0318")},//衡水
                {id:"0319",name:$translate.instant("citys.0319")},//邢台
                {id:"0335",name:$translate.instant("citys.0335")},//秦皇岛
                {id:"0349",name:$translate.instant("citys.0349")},//朔州
                {id:"0350",name:$translate.instant("citys.0350")},//忻州
                {id:"0351",name:$translate.instant("citys.0351")},//太原
                {id:"0352",name:$translate.instant("citys.0352")},//大同
                {id:"0353",name:$translate.instant("citys.0353")},//阳泉
                {id:"0354",name:$translate.instant("citys.0354")},//晋中
                {id:"0355",name:$translate.instant("citys.0355")},//长治
                {id:"0356",name:$translate.instant("citys.0356")},//晋城
                {id:"0357",name:$translate.instant("citys.0357")},//临汾
                {id:"0358",name:$translate.instant("citys.0358")},//吕梁
                {id:"0359",name:$translate.instant("citys.0359")},//运城
                {id:"0370",name:$translate.instant("citys.0370")},//商丘
                {id:"0371",name:$translate.instant("citys.0371")},//郑州
                {id:"0372",name:$translate.instant("citys.0372")},//安阳
                {id:"0373",name:$translate.instant("citys.0373")},//新乡
                {id:"0374",name:$translate.instant("citys.0374")},//许昌
                {id:"0375",name:$translate.instant("citys.0375")},//平顶山
                {id:"0376",name:$translate.instant("citys.0376")},//信阳
                {id:"0377",name:$translate.instant("citys.0377")},//南阳
                {id:"0378",name:$translate.instant("citys.0378")},//开封
                {id:"0379",name:$translate.instant("citys.0379")},//洛阳
                {id:"0391",name:$translate.instant("citys.0391")},//焦作
                {id:"0392",name:$translate.instant("citys.0392")},//鹤壁
                {id:"0393",name:$translate.instant("citys.0393")},//濮阳
                {id:"0394",name:$translate.instant("citys.0394")},//周口
                {id:"0395",name:$translate.instant("citys.0395")},//漯河
                {id:"0396",name:$translate.instant("citys.0396")},//驻马店
                {id:"0397",name:$translate.instant("citys.0397")},//济源
                {id:"0398",name:$translate.instant("citys.0398")},//三门峡
                {id:"0410",name:$translate.instant("citys.0410")},//铁岭
                {id:"0411",name:$translate.instant("citys.0411")},//大连
                {id:"0412",name:$translate.instant("citys.0412")},//鞍山
                {id:"0413",name:$translate.instant("citys.0413")},//抚顺
                {id:"0414",name:$translate.instant("citys.0414")},//本溪
                {id:"0415",name:$translate.instant("citys.0415")},//丹东
                {id:"0416",name:$translate.instant("citys.0416")},//锦州
                {id:"0417",name:$translate.instant("citys.0417")},//营口
                {id:"0418",name:$translate.instant("citys.0418")},//阜新
                {id:"0419",name:$translate.instant("citys.0419")},//辽阳
                {id:"0421",name:$translate.instant("citys.0421")},//朝阳
                {id:"0427",name:$translate.instant("citys.0427")},//盘锦
                {id:"0429",name:$translate.instant("citys.0429")},//葫芦岛
                {id:"0431",name:$translate.instant("citys.0431")},//长春
                {id:"0432",name:$translate.instant("citys.0432")},//吉林
                {id:"0433",name:$translate.instant("citys.0433")},//延边
                {id:"0434",name:$translate.instant("citys.0434")},//四平
                {id:"0435",name:$translate.instant("citys.0435")},//通化
                {id:"0436",name:$translate.instant("citys.0436")},//白城
                {id:"0437",name:$translate.instant("citys.0437")},//辽源
                {id:"0438",name:$translate.instant("citys.0438")},//松原
                {id:"0439",name:$translate.instant("citys.0439")},//白山
                {id:"0451",name:$translate.instant("citys.0451")},//哈尔滨
                {id:"0452",name:$translate.instant("citys.0452")},//齐齐哈尔
                {id:"0453",name:$translate.instant("citys.0453")},//牡丹江
                {id:"0454",name:$translate.instant("citys.0454")},//佳木斯
                {id:"0455",name:$translate.instant("citys.0455")},//绥化
                {id:"0456",name:$translate.instant("citys.0456")},//黑河
                {id:"0457",name:$translate.instant("citys.0457")},//大兴安岭
                {id:"0458",name:$translate.instant("citys.0458")},//伊春
                {id:"0459",name:$translate.instant("citys.0459")},//大庆
                {id:"0464",name:$translate.instant("citys.0464")},//七台河
                {id:"0467",name:$translate.instant("citys.0467")},//鸡西
                {id:"0468",name:$translate.instant("citys.0468")},//鹤岗
                {id:"0469",name:$translate.instant("citys.0469")},//双鸭山
                {id:"0470",name:$translate.instant("citys.0470")},//海拉尔
                {id:"0471",name:$translate.instant("citys.0471")},//呼和浩特
                {id:"0472",name:$translate.instant("citys.0472")},//包头
                {id:"0473",name:$translate.instant("citys.0473")},//乌海
                {id:"0474",name:$translate.instant("citys.0474")},//集宁
                {id:"0475",name:$translate.instant("citys.0475")},//通辽
                {id:"0476",name:$translate.instant("citys.0476")},//赤峰
                {id:"0477",name:$translate.instant("citys.0477")},//鄂尔多斯
                {id:"0478",name:$translate.instant("citys.0478")},//临河
                {id:"0479",name:$translate.instant("citys.0479")},//锡林浩特
                {id:"0482",name:$translate.instant("citys.0482")},//乌兰浩特
                {id:"0483",name:$translate.instant("citys.0483")},//巴彦浩特
                {id:"025",name:$translate.instant("citys.025")},//南京
                {id:"0510",name:$translate.instant("citys.0510")},//无锡
                {id:"0511",name:$translate.instant("citys.0511")},//镇江
                {id:"0512",name:$translate.instant("citys.0512")},//苏州
                {id:"0513",name:$translate.instant("citys.0513")},//南通
                {id:"0514",name:$translate.instant("citys.0514")},//扬州
                {id:"0515",name:$translate.instant("citys.0515")},//盐城
                {id:"0516",name:$translate.instant("citys.0516")},//徐州
                {id:"0517",name:$translate.instant("citys.0517")},//淮安
                {id:"0518",name:$translate.instant("citys.0518")},//连云港
                {id:"0519",name:$translate.instant("citys.0519")},//常州
                {id:"0523",name:$translate.instant("citys.0523")},//泰州
                {id:"0527",name:$translate.instant("citys.0527")},//宿迁
                {id:"0530",name:$translate.instant("citys.0530")},//菏泽
                {id:"0531",name:$translate.instant("citys.0531")},//济南
                {id:"0532",name:$translate.instant("citys.0532")},//青岛
                {id:"0533",name:$translate.instant("citys.0533")},//淄博
                {id:"0534",name:$translate.instant("citys.0534")},//德州
                {id:"0535",name:$translate.instant("citys.0535")},//烟台
                {id:"0536",name:$translate.instant("citys.0536")},//潍坊
                {id:"0537",name:$translate.instant("citys.0537")},//济宁
                {id:"0538",name:$translate.instant("citys.0538")},//泰安
                {id:"0539",name:$translate.instant("citys.0539")},//临沂
                {id:"0543",name:$translate.instant("citys.0543")},//滨州
                {id:"0546",name:$translate.instant("citys.0546")},//东营
                {id:"0631",name:$translate.instant("citys.0631")},//威海
                {id:"0632",name:$translate.instant("citys.0632")},//枣庄
                {id:"0633",name:$translate.instant("citys.0633")},//日照
                {id:"0634",name:$translate.instant("citys.0634")},//莱芜
                {id:"0635",name:$translate.instant("citys.0635")},//聊城
                {id:"0550",name:$translate.instant("citys.0550")},//滁州
                {id:"0551",name:$translate.instant("citys.0551")},//合肥
                {id:"0552",name:$translate.instant("citys.0552")},//蚌埠
                {id:"0553",name:$translate.instant("citys.0553")},//芜湖
                {id:"0554",name:$translate.instant("citys.0554")},//淮南
                {id:"0555",name:$translate.instant("citys.0555")},//马鞍山
                {id:"0556",name:$translate.instant("citys.0556")},//安庆
                {id:"0557",name:$translate.instant("citys.0557")},//宿州
                {id:"0558",name:$translate.instant("citys.0558")},//阜阳
                {id:"0559",name:$translate.instant("citys.0559")},//黄山
                {id:"0561",name:$translate.instant("citys.0561")},//淮北
                {id:"0562",name:$translate.instant("citys.0562")},//铜陵
                {id:"0563",name:$translate.instant("citys.0563")},//宣城
                {id:"0564",name:$translate.instant("citys.0564")},//六安
                {id:"0566",name:$translate.instant("citys.0566")},//池州
                {id:"0567",name:$translate.instant("citys.0567")},//亳州
                {id:"0570",name:$translate.instant("citys.0570")},//衢州
                {id:"0571",name:$translate.instant("citys.0571")},//杭州
                {id:"0572",name:$translate.instant("citys.0572")},//湖州
                {id:"0573",name:$translate.instant("citys.0573")},//嘉兴
                {id:"0574",name:$translate.instant("citys.0574")},//宁波
                {id:"0575",name:$translate.instant("citys.0575")},//绍兴
                {id:"0576",name:$translate.instant("citys.0576")},//台州
                {id:"0577",name:$translate.instant("citys.0577")},//温州
                {id:"0578",name:$translate.instant("citys.0578")},//丽水
                {id:"0579",name:$translate.instant("citys.0579")},//金华
                {id:"0580",name:$translate.instant("citys.0580")},//舟山
                {id:"0591",name:$translate.instant("citys.0591")},//福州
                {id:"0592",name:$translate.instant("citys.0592")},//厦门
                {id:"0593",name:$translate.instant("citys.0593")},//宁德
                {id:"0594",name:$translate.instant("citys.0594")},//莆田
                {id:"0595",name:$translate.instant("citys.0595")},//泉州
                {id:"0596",name:$translate.instant("citys.0596")},//漳州
                {id:"0597",name:$translate.instant("citys.0597")},//龙岩
                {id:"0598",name:$translate.instant("citys.0598")},//三明
                {id:"0599",name:$translate.instant("citys.0599")},//南平
                {id:"020",name:$translate.instant("citys.020")},//广州
                {id:"0660",name:$translate.instant("citys.0660")},//汕尾
                {id:"0662",name:$translate.instant("citys.0662")},//阳江
                {id:"0663",name:$translate.instant("citys.0663")},//揭阳
                {id:"0668",name:$translate.instant("citys.0668")},//茂名
                {id:"0750",name:$translate.instant("citys.0750")},//江门
                {id:"0751",name:$translate.instant("citys.0751")},//韶关
                {id:"0752",name:$translate.instant("citys.0752")},//惠州
                {id:"0753",name:$translate.instant("citys.0753")},//梅州
                {id:"0754",name:$translate.instant("citys.0754")},//汕头
                {id:"0755",name:$translate.instant("citys.0755")},//深圳
                {id:"0756",name:$translate.instant("citys.0756")},//珠海
                {id:"0757",name:$translate.instant("citys.0757")},//佛山
                {id:"0758",name:$translate.instant("citys.0758")},//肇庆
                {id:"0759",name:$translate.instant("citys.0759")},//湛江
                {id:"0760",name:$translate.instant("citys.0760")},//中山
                {id:"0762",name:$translate.instant("citys.0762")},//河源
                {id:"0763",name:$translate.instant("citys.0763")},//清远
                {id:"0766",name:$translate.instant("citys.0766")},//云浮
                {id:"0768",name:$translate.instant("citys.0768")},//潮州
                {id:"0769",name:$translate.instant("citys.0769")},//东莞
                {id:"027",name:$translate.instant("citys.027")},//武汉
                {id:"0721",name:$translate.instant("citys.0721")},//天门
                {id:"0720",name:$translate.instant("citys.0720")},//江汉
                {id:"0710",name:$translate.instant("citys.0710")},//襄樊
                {id:"0711",name:$translate.instant("citys.0711")},//鄂州
                {id:"0712",name:$translate.instant("citys.0712")},//孝感
                {id:"0713",name:$translate.instant("citys.0713")},//黄冈
                {id:"0714",name:$translate.instant("citys.0714")},//黄石
                {id:"0715",name:$translate.instant("citys.0715")},//咸宁
                {id:"0716",name:$translate.instant("citys.0716")},//荆州
                {id:"0717",name:$translate.instant("citys.0717")},//宜昌
                {id:"0718",name:$translate.instant("citys.0718")},//恩施
                {id:"0719",name:$translate.instant("citys.0719")},//十堰
                {id:"0722",name:$translate.instant("citys.0722")},//随州
                {id:"0724",name:$translate.instant("citys.0724")},//荆门
                {id:"0728",name:$translate.instant("citys.0728")},//潜江
                {id:"0730",name:$translate.instant("citys.0730")},//岳阳
                {id:"0731",name:$translate.instant("citys.0731")},//长沙
                {id:"0732",name:$translate.instant("citys.0732")},//湘潭
                {id:"0733",name:$translate.instant("citys.0733")},//株洲
                {id:"0734",name:$translate.instant("citys.0734")},//衡阳
                {id:"0735",name:$translate.instant("citys.0735")},//郴州
                {id:"0736",name:$translate.instant("citys.0736")},//常德
                {id:"0737",name:$translate.instant("citys.0737")},//益阳
                {id:"0738",name:$translate.instant("citys.0738")},//娄底
                {id:"0739",name:$translate.instant("citys.0739")},//邵阳
                {id:"0743",name:$translate.instant("citys.0743")},//吉首
                {id:"0744",name:$translate.instant("citys.0744")},//张家界
                {id:"0745",name:$translate.instant("citys.0745")},//怀化
                {id:"0746",name:$translate.instant("citys.0746")},//永州
                {id:"0770",name:$translate.instant("citys.0770")},//防城港
                {id:"0771",name:$translate.instant("citys.0771")},//南宁
                {id:"0772",name:$translate.instant("citys.0772")},//柳州
                {id:"0773",name:$translate.instant("citys.0773")},//桂林
                {id:"0774",name:$translate.instant("citys.0774")},//梧州
                {id:"0775",name:$translate.instant("citys.0775")},//玉林
                {id:"0776",name:$translate.instant("citys.0776")},//百色
                {id:"0777",name:$translate.instant("citys.0777")},//钦州
                {id:"0778",name:$translate.instant("citys.0778")},//河池
                {id:"0779",name:$translate.instant("citys.0779")},//北海
                {id:"0780",name:$translate.instant("citys.0780")},//崇左
                {id:"0781",name:$translate.instant("citys.0781")},//来宾
                {id:"0782",name:$translate.instant("citys.0782")},//贵港
                {id:"0783",name:$translate.instant("citys.0783")},//贺州
                {id:"0701",name:$translate.instant("citys.0701")},//鹰潭
                {id:"0790",name:$translate.instant("citys.0790")},//新余
                {id:"0791",name:$translate.instant("citys.0791")},//南昌
                {id:"0792",name:$translate.instant("citys.0792")},//九江
                {id:"0793",name:$translate.instant("citys.0793")},//上饶
                {id:"0794",name:$translate.instant("citys.0794")},//抚州
                {id:"0795",name:$translate.instant("citys.0795")},//宜春
                {id:"0796",name:$translate.instant("citys.0796")},//吉安
                {id:"0797",name:$translate.instant("citys.0797")},//赣州
                {id:"0798",name:$translate.instant("citys.0798")},//景德镇
                {id:"0799",name:$translate.instant("citys.0799")},//萍乡
                {id:"028",name:$translate.instant("citys.028")},//成都
                {id:"0812",name:$translate.instant("citys.0812")},//攀枝花
                {id:"0813",name:$translate.instant("citys.0813")},//自贡
                {id:"0816",name:$translate.instant("citys.0816")},//绵阳
                {id:"0817",name:$translate.instant("citys.0817")},//南充
                {id:"0818",name:$translate.instant("citys.0818")},//达州
                {id:"0825",name:$translate.instant("citys.0825")},//遂宁
                {id:"0826",name:$translate.instant("citys.0826")},//广安
                {id:"0827",name:$translate.instant("citys.0827")},//巴中
                {id:"0830",name:$translate.instant("citys.0830")},//泸州
                {id:"0831",name:$translate.instant("citys.0831")},//宜宾
                {id:"0832",name:$translate.instant("citys.0832")},//内江
                {id:"0283",name:$translate.instant("citys.0283")},//资阳
                {id:"0833",name:$translate.instant("citys.0833")},//乐山
                {id:"0282",name:$translate.instant("citys.0282")},//眉山
                {id:"0834",name:$translate.instant("citys.0834")},//凉山
                {id:"0835",name:$translate.instant("citys.0835")},//雅安
                {id:"0836",name:$translate.instant("citys.0836")},//甘孜
                {id:"0837",name:$translate.instant("citys.0837")},//阿坝
                {id:"0838",name:$translate.instant("citys.0838")},//德阳
                {id:"0839",name:$translate.instant("citys.0839")},//广元
                {id:"0850",name:$translate.instant("citys.0850")},//贵安新区
                {id:"0851",name:$translate.instant("citys.0851")},//贵阳
                {id:"0852",name:$translate.instant("citys.0852")},//遵义
                {id:"0853",name:$translate.instant("citys.0853")},//安顺
                {id:"0854",name:$translate.instant("citys.0854")},//都匀
                {id:"0855",name:$translate.instant("citys.0855")},//凯里
                {id:"0856",name:$translate.instant("citys.0856")},//铜仁
                {id:"0857",name:$translate.instant("citys.0857")},//毕节
                {id:"0858",name:$translate.instant("citys.0858")},//六盘水
                {id:"0859",name:$translate.instant("citys.0859")},//兴义
                {id:"0691",name:$translate.instant("citys.0691")},//版纳 
                {id:"0692",name:$translate.instant("citys.0692")},//德宏
                {id:"0870",name:$translate.instant("citys.0870")},//昭通
                {id:"0871",name:$translate.instant("citys.0871")},//昆明
                {id:"0872",name:$translate.instant("citys.0872")},//大理
                {id:"0873",name:$translate.instant("citys.0873")},//红河
                {id:"0874",name:$translate.instant("citys.0874")},//曲靖
                {id:"0875",name:$translate.instant("citys.0875")},//保山
                {id:"0876",name:$translate.instant("citys.0876")},//文山
                {id:"0877",name:$translate.instant("citys.0877")},//玉溪
                {id:"0878",name:$translate.instant("citys.0878")},//楚雄
                {id:"0879",name:$translate.instant("citys.0879")},//思茅
                {id:"0883",name:$translate.instant("citys.0883")},//临沧
                {id:"0886",name:$translate.instant("citys.0886")},//怒江
                {id:"0887",name:$translate.instant("citys.0887")},//迪庆
                {id:"0888",name:$translate.instant("citys.0888")},//丽江
                {id:"0891",name:$translate.instant("citys.0891")},//拉萨
                {id:"0892",name:$translate.instant("citys.0892")},//日喀则
                {id:"0893",name:$translate.instant("citys.0893")},//山南
                {id:"0894",name:$translate.instant("citys.0894")},//林芝
                {id:"0895",name:$translate.instant("citys.0895")},//昌都
                {id:"0896",name:$translate.instant("citys.0896")},//那曲
                {id:"0897",name:$translate.instant("citys.0897")},//阿里
                {id:"0898",name:$translate.instant("citys.0898")},//海口
                {id:"029",name:$translate.instant("citys.029")},//西安
                {id:"0910",name:$translate.instant("citys.0910")},//咸阳
                {id:"0911",name:$translate.instant("citys.0911")},//延安
                {id:"0912",name:$translate.instant("citys.0912")},//榆林
                {id:"0913",name:$translate.instant("citys.0913")},//渭南
                {id:"0914",name:$translate.instant("citys.0914")},//商洛
                {id:"0915",name:$translate.instant("citys.0915")},//安康
                {id:"0916",name:$translate.instant("citys.0916")},//汉中
                {id:"0917",name:$translate.instant("citys.0917")},//宝鸡
                {id:"0919",name:$translate.instant("citys.0919")},//铜川
                {id:"0930",name:$translate.instant("citys.0930")},//临夏
                {id:"0931",name:$translate.instant("citys.0931")},//兰州
                {id:"0932",name:$translate.instant("citys.0932")},//定西
                {id:"0933",name:$translate.instant("citys.0933")},//平凉
                {id:"0934",name:$translate.instant("citys.0934")},//庆阳
                {id:"0935",name:$translate.instant("citys.0935")},//金昌武威
                {id:"0936",name:$translate.instant("citys.0936")},//张掖
                {id:"0937",name:$translate.instant("citys.0937")},//酒泉嘉峪关
                {id:"0938",name:$translate.instant("citys.0938")},//天水
                {id:"0939",name:$translate.instant("citys.0939")},//陇南
                {id:"0941",name:$translate.instant("citys.0941")},//甘南
                {id:"0943",name:$translate.instant("citys.0943")},//白银
                {id:"0951",name:$translate.instant("citys.0951")},//银川
                {id:"0952",name:$translate.instant("citys.0952")},//石嘴山
                {id:"0953",name:$translate.instant("citys.0953")},//吴忠
                {id:"0954",name:$translate.instant("citys.0954")},//固原
                {id:"0955",name:$translate.instant("citys.0955")},//中卫
                {id:"0970",name:$translate.instant("citys.0970")},//海晏
                {id:"0971",name:$translate.instant("citys.0971")},//西宁
                {id:"0972",name:$translate.instant("citys.0972")},//海东
                {id:"0973",name:$translate.instant("citys.0973")},//黄南
                {id:"0974",name:$translate.instant("citys.0974")},//共和
                {id:"0975",name:$translate.instant("citys.0975")},//果洛
                {id:"0976",name:$translate.instant("citys.0976")},//玉树
                {id:"0977",name:$translate.instant("citys.0977")},//德令哈
                {id:"0979",name:$translate.instant("citys.0979")},//格尔木
                {id:"0901",name:$translate.instant("citys.0901")},//塔城
                {id:"0902",name:$translate.instant("citys.0902")},//哈密
                {id:"0903",name:$translate.instant("citys.0903")},//和田
                {id:"0906",name:$translate.instant("citys.0906")},//阿勒泰
                {id:"0908",name:$translate.instant("citys.0908")},//克州
                {id:"0909",name:$translate.instant("citys.0909")},//博乐
                {id:"0990",name:$translate.instant("citys.0990")},//克拉玛依
                {id:"0991",name:$translate.instant("citys.0991")},//乌鲁木齐
                {id:"0992",name:$translate.instant("citys.0992")},//奎屯
                {id:"0993",name:$translate.instant("citys.0993")},//石河子
                {id:"0994",name:$translate.instant("citys.0994")},//昌吉
                {id:"0995",name:$translate.instant("citys.0995")},//吐鲁番
                {id:"0996",name:$translate.instant("citys.0996")},//库尔勒
                {id:"0997",name:$translate.instant("citys.0997")},//阿克苏
                {id:"0998",name:$translate.instant("citys.0998")},//喀什
                {id:"0999",name:$translate.instant("citys.0999")},//伊犁
            ],
            
            //缓存厂家
            cacheFirmList:[
                {id:"1",name:$translate.instant("HW"),alias:"HW"},//华为
                {id:"2",name:$translate.instant("ZTE"),alias:"ZTE"},//中兴
                {id:"3",name:$translate.instant("CMHI"),alias:"CMHI"},//自研
                {id:"4",name:$translate.instant("FH"),alias:"FH"},//烽火     
            ],

            //缓存类型
            cacheTypeList:[
                {id:0,name:$translate.instant("cacheType_0")},
                {id:1,name:$translate.instant("cacheType_1")},
                {id:2,name:$translate.instant("cacheType_2")},
                {id:3,name:$translate.instant("cacheType_3")},
            ],

            //用户接入类型
            userAccessTypeList:[
                {id:0,name:$translate.instant("userAccessType_0")},
                {id:1,name:$translate.instant("userAccessType_1")},
                {id:2,name:$translate.instant("userAccessType_2")},
                {id:3,name:$translate.instant("userAccessType_3")},
                {id:4,name:$translate.instant("userAccessType_4")},
            ],

            //用户终端类型
            userTerminalTypeList:[
                {id:0,name:$translate.instant("userTerminalType_0")},
                {id:1,name:$translate.instant("userTerminalType_1")},
                {id:2,name:$translate.instant("userTerminalType_2")},
                {id:3,name:$translate.instant("userTerminalType_3")},
            ],

            //告警类型
            alarmTypeList:[
                {id:1,name:$translate.instant("alarmType_1")},
                {id:2,name:$translate.instant("alarmType_2")},
                {id:3,name:$translate.instant("alarmType_3")},
            ],

            //告警级别
            alarmLevelList:[
                {id:1,name:$translate.instant("alarmLevel_1")},
                {id:2,name:$translate.instant("alarmLevel_2")},
                {id:3,name:$translate.instant("alarmLevel_3")},
                {id:4,name:$translate.instant("alarmLevel_4")},
            ],

            //响应状态码
            resCodeList:[
                {id:"0",name:$translate.instant("resCode_0")},
                {id:"1",name:$translate.instant("resCode_1")},
                {id:"2",name:$translate.instant("resCode_2")},
                {id:"3",name:$translate.instant("resCode_3")},
                {id:"4",name:$translate.instant("resCode_4")},
            ],

             //日志操作类型
            operationTypeList:[
                {id:0,name:$translate.instant("all")},
                {id:2,name:$translate.instant("increase")},
                {id:4,name:$translate.instant("modify")},
                {id:8,name:$translate.instant("delete")},
                {id:16,name:$translate.instant("config")},
                {id:32,name:$translate.instant("increaseMore")},
                {id:64,name:$translate.instant("modifyMore")},
                {id:128,name:$translate.instant("deleteMore")},
                {id:256,name:$translate.instant("configMore")},
            ],

            //导出excel
            export:(url,obj={})=>{
                //去掉空的属性
                for(let key in obj){
                    if(obj[key]==null||obj[key]=="")delete obj[key];
                }
                length=Object.keys(obj).length-1;
                Object.keys(obj).map((key,index)=>{
                    if(index==0)url+="?";
                    url+=`${key}=${obj[key]}`;
                    if(index!=length)url+="&";
                })
                $http.get(url,{headers:{showErr:true}}).then(({data})=>{
                    if(data&&(typeof data)=="string"){
                        // window.location.href=url;
                        
                        var a = document.createElement('a');
                        document.body.appendChild(a);
                        a.setAttribute('style', 'display:none');
                        a.setAttribute('href', url);
                        a.click();
                        a.remove();
                        
                    }else{
                        commonMethod.layuiTip($translate.instant("noData"),"notice");
                    }

                }).catch(()=>{});
            }

        }

    }])
    .service("menuService",["menuConstant","$filter",function(menuConstant,$filter){
        //获得一级菜单默认的有权限二级菜单
        this.getFSecondMenu=keyUrl=>{
            for(let {url,children} of menuConstant.menu){
                if(url===keyUrl&&children){
                    return $filter('filter')(children,{isShow:true})[0].url
                    break;
                }
            }
        };

        //获取一级菜单的二级菜单
        this.getSecondMenuList=keyUrl=>{
            for(let {url,children} of menuConstant.menu){
                if(url===keyUrl&&children){
                    return children
                    break;
                }
            }
        };

        //tree转list // tree 为当前树的数据源  key为父节点key值
        this.treeTransArray=function(tree, key) {
            return tree.reduce(function mapp(pre,cur,i,arr){
                pre.push(cur);
                if(cur[key]&&cur[key].length>0)cur[key].reduce(mapp,pre);
                
                return pre
            },[]);
        };

        //list转tree //数组转树 list 数组数据源 ,key 对应父节点id字符串
        this.arrayTransTree= function(list ,key,a="children") {
            return list.filter(parent=>{
                let branchArr=list.filter(child=>String(parent.id)==String(child[key]));
                parent[a]=[];
                if(branchArr.length > 0)parent[a] = branchArr;
                else delete parent[a]
                //过滤出顶层父级
                for(let grandfather of list){
                    if(String(parent[key])!== String(grandfather.id))continue;
                    else return false
                }
                return true 
                
            });
                   
        };	

        //转换生成tree的数据格式
        this.changeTreeData=function(list,obj){
            return list.map((value,i)=>{
                value=Object.replaceAttrs(value,obj);
                //添加checkArr={type:"0",isChecked:"1"(选中)}
                if(value.checkArr){
                    value.checkArr={type:0,isChecked:"1"}; 
                }else{
                    value.checkArr={type:0,isChecked:"0"};
                }
                if(value.children){
                    if(!value.spread){//默认收缩,第一展开
                        if(i==0)value.spread=true;
                        else value.spread=false;
                    }

                    if(value.children.length>0){
                        value.children=this.changeTreeData(value.children,obj);

                        for(let son of value.children){
                            //父菜单不选中，子菜单都不选中
                            if(value.checkArr.isChecked=="0")son.checkArr.isChecked="0";
                            else {//子菜单选择则父菜单选中
                                if(son.checkArr.isChecked=="1"){
                                    value.checkArr.isChecked="1";
                                    break;
                                } 
                            }
                            
                        }
                    }
                    
                };
        
                return value  
            })
        };

        //转换成menu的数据格式
        this.changeMenuData=function(list,obj){
            return list.map(value=>{
                value=Object.replaceAttrs(value,obj);
          
                if(value.children&&value.children.length>0){
                    value.children=this.changeMenuData(value.children,obj);
                };
        
                return value  
            })
        };

    }])

})();