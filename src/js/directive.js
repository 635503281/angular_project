
(function(){
    "use strict";
    angular.module("Directives",[])
    .directive("renderfinish",[function(){
        return {
            restrict:"A",
            link:function($scope,ele,attrs){
                if($scope.$last===true){
                    $scope.$emit("renderfinish");

                    var fun = $scope.$eval(attrs.renderfinish);
                    if(fun && typeof(fun)=='function'){
                        fun();  //回调函数
                    }
                }
            }
        }
    }])
    .directive("syncView",[function(){
        return {
            restrict:"A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                ele.on("change",function(){
                    console.log(ele.val())
                })
            }
        }
    }])
    //input框位数限制
    .directive("maxlimit",[function(){
        return {
            restrict:"A",
            link:function($scope,ele,attrs){
                if(attrs["maxlimit"]){
                    let num=parseInt(attrs["maxlimit"]);
                    ele.on("input",function(){
                        if(this.value.length>num)this.value=this.value.slice(0,num);
                    });
                }
                

            }
        }
    }])
    //input(number)最大值限制
    .directive("maxnum",[function(){
        return {
            restrict:"A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                if(attrs["maxnum"]){
                    let num=parseInt(attrs["maxnum"]);
                    ele.on("input",function(){
                        if(this.value>num){
                            this.value=num;
                            ngModel.$setViewValue(num);
                        }
                    });
                }
                

            }
        }
    }])
    //input(number)最小值限制
    .directive("minnum",[function(){
        return {
            restrict:"A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                if(attrs["minnum"]){
                    let num=parseInt(attrs["minnum"]);
                    ele.on("input",function(){
                        if(this.value<num){
                            this.value=num;
                            ngModel.$setViewValue(num);
                        }
                    });
                }
                

            }
        }
    }])
    //tip hover提示 用法一：直接string 用法二：object={tip:"",direction:3}
    .directive("tip",[function(){
        return {
            restrict:"A",
            link:function($scope,ele,attrs){
                if(attrs["tip"]){

                    ele.hover(function(){
                        let option={
                            tip:attrs.tip,//提示文字
                            direction:3,//方向,默认下
                        };              
                        try{
                            let op=eval("("+attrs['tip']+")");//初始配置 注意eval,属性值必须是string
                            if(typeof op =="object")option=Object.assign(option,op);
                        }catch(err){
                            // console.log(err);
                        }
                        
                        //option={tips:1->上 2->右 3->下 4->左}
                        layui.layer.tips(option.tip,this,{time:0,tips:option.direction});
                    },function(){
                        layui.layer.closeAll('tips'); 
                    });
                }
                

            }
        }
    }])
    //初始化加载element
    .directive("initLayui",[function(){
        return {
            restrict:"A",
            link:function($scope,ele,attrs){            
                setTimeout(layui.element.init,0);
            }
        }
    }])
    //layDate单个时间插件，必须有id
    .directive("layDate",[function(){
        return {
            restrict:"A",
            require:"ngModel",
            scope:{
                ngModel:"="
            },
            link:function($scope,ele,attrs,ngModel){
                var lang=sessionStorage.getItem("lang");
                switch (lang){
                    case "zh-cn":lang="cn";break;
                    case "en-us":lang="en";break;
                    default: lang="cn";break;
                }
                var config={
                    elem: '#' + attrs.id,
                    type: attrs.dateType!= undefined&&attrs.dateType!=""? attrs.dateType: 'datetime',
                    lang:lang,
                    trigger:'click',
                    // format: attrs.format != undefined && attrs.format != ''? attrs.format : 'yyyy-MM-dd HH:mm:ss',
                    change:function(value){
                        ele.val(value);
                        ngModel.$setViewValue(value);
                    },
                    done:function(value){
                        ele.val(value);
                        ngModel.$setViewValue(value);
                    }
                };
                // 初始化
                setTimeout(function(){layui.laydate.render(config)},0);
                
            }
        }
    }])
    //layDate选择范围时间插件，必须有id
    .directive("layRangeDate",[function(){
        return {
            restrict:"A",
            require:"ngModel",
            scope:{
                ngModel:"="
            },
            link:function($scope,ele,attrs,ngModel){
                var lang=sessionStorage.getItem("lang");
                switch (lang){
                    case "zh-cn":lang="cn";break;
                    case "en-us":lang="en";break;
                    default: lang="cn";break;
                }
                var config={
                    elem: '#' + attrs.id,
                    type: attrs.dateType!= undefined&&attrs.dateType!=""? attrs.dateType: 'datetime',
                    trigger:'click',
                    lang:lang,
                    range:'~',
                    // format:'yyyy-MM-dd HH:mm:ss',
                    change:function(value){
                        ele.val(value);
                        ngModel.$setViewValue(value);
                    },
                    done:function(value){
                        ele.val(value);
                        ngModel.$setViewValue(value);
                    }
                };
                
                // 初始化
                setTimeout(function(){layui.laydate.render(config)},0);
                
                
                
            }
        }
    }])
    // ip校验
    .directive("ipCheck", [function () {
        return {
            restrict: "A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                 $(ele).on('blur',function(){
                    if($(ele).val()){
                        $scope.$apply(function() {
                            const reg = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
                            let flag =reg.test($(ele).val());
                            ngModel.$setValidity('ipErr', flag);
                        });

                    }else{
                        $scope.$apply(function() {
                            ngModel.$setValidity('ipErr', true);
                        });
                    }

                });
            }
        }
 	}])
    // ipv6校验
    .directive("ipv6Check", [function () {
        return {
            restrict: "A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                $(ele).on('blur',function(){
                    if($(ele).val()){
                        $scope.$apply(function() {
                            const reg=/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^:((:[0-9a-fA-F]{1,4}){1,6}|:)$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:)$|^([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:)$|^([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:)$|^([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:)$|^([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?$|^([0-9a-fA-F]{1,4}:){6}:$/;
                            let flag =reg.test($(ele).val());
                            ngModel.$setValidity('ipv6Err', flag);
                        });

                    }else{
                        $scope.$apply(function() {
                            ngModel.$setValidity('ipv6Err', true);
                        });
                    }

                });
            }
        }
    }])
    // 端口校验
    .directive("portCheck", [function () {
        return {
            restrict: "A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                 $(ele).on('blur',function(){
                    if($(ele).val()){
                        $scope.$apply(function() {
                            const reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
                            let flag =reg.test($(ele).val());
                            ngModel.$setValidity('portErr', flag);
                        });

                    }else{
                        $scope.$apply(function() {
                            ngModel.$setValidity('portErr', true);
                        });
                    }

                });
            }
        }
    }])
    // 地址校验
    .directive("addrCheck", [function () {
        return {
            restrict: "A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                $(ele).on('blur',function(){
                    if($(ele).val()){
                        $scope.$apply(function() {
                            const reg = /^(http|https):\/\/(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
                            let flag =reg.test($(ele).val());
                            ngModel.$setValidity('addrErr', flag);
                        });

                    }else{
                        $scope.$apply(function() {
                            ngModel.$setValidity('addrErr', true);
                        });
                    }

                });
            }
        }
    }])
    // 有效期校验[0,86400]
    .directive("periodCheck", [function () {
        return {
            restrict: "A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                $(ele).on('blur',function(){
                    if($(ele).val()){
                        $scope.$apply(function(){
                            if(isNaN($(ele).val()) || $(ele).val() < 0 || $(ele).val() > 86400 )
                                ngModel.$setValidity('periodErr',false)
                            else if (0 != $(ele).val() % 1)
                                ngModel.$setValidity('periodErr',false)
                            else if ($(ele).val()!=0 && $(ele).val().indexOf('0')==0)
                                ngModel.$setValidity('periodErr',false)
                            else
                                ngModel.$setValidity('periodErr',true)
                        })

                    }else{
                        $scope.$apply(function() {
                            ngModel.$setValidity('periodErr', true);
                        });
                    }

                });
            }
        }
    }])
    //ngModel绑定的""(空字符串)转为null
    .directive("nullValue",[function(){
        return{
            restrict:"A",
            require:"ngModel",
            link:function($scope,ele,attrs,ngModel){
                $(ele).on("blur",function(){
                    if($(ele).val()==null||$(ele).val()==""){
                        $scope.$apply(function() {
                            ngModel.$setViewValue(null);
                        });
                    }
                })
            }
        }
    }])
    //自定义table指令
    .directive("myTable",["$compile",function($compile){
        // <div>
        //     <div my-table='arr' repeat='ng-repeat中循环的子项' height="最大高度">
        //         <table>
        //             <thead><tr><th fixedR='tbody中对应的<td></td>标签'></th></tr></thead>
        //             <tbody><tr><td></td></tr></tbody>
        //         </table>
        //     </div>
        // </div>
        return{
            restrict:"A",
            scope:true,
            link:function($scope,ele,attr){
                var watchAttr=attr["myTable"];
                var repeatItem=attr["repeat"];
                var maxHeight=attr["height"]||"500px";

                var Jele=$(ele);
                Jele.css({"max-height":maxHeight});
                var timer=setInterval(function(){
                    if(!Jele.width())return
                    clearInterval(timer);

                    var elementHead=Jele.find("thead").clone()[0];

                    //插入头部
                    var parentElement=$("<div style='overflow:hidden;position:relative;min-width: auto;z-index:1;'><table></table></div>");
                    parentElement.find("table").append(elementHead);
                    $compile(parentElement)($scope).insertBefore(Jele);
                    Jele.css("margin-top",-parentElement.height()).find("thead").css("visibility","hidden"); 

                    //右边固定table
                    var elementR=$("<div style='position:absolute;right:0;top:0;overflow:hidden;min-width: auto;width: min-content'><table><thead><tr></tr></thead><tbody></tbody></table></div>");
                    var elementRHead=$("<div style='position:absolute;right:0;top:0;z-index:2;min-width: auto;width: min-content'><table><thead><tr></tr></thead></table></div>");
                    var elementR_tr=$('<tr ng-repeat="'+repeatItem+" in "+ watchAttr+' track by $index" on-finish-render="changeTableData()"></tr>');
                    
                    //左边固定table
                    var elementL=$("<div style='position:absolute;left:0;top:0;overflow:hidden;min-width: auto;width: min-content'><table><thead><tr></tr></thead><tbody></tbody></table></div>");
                    var elementLHead=$("<div style='position:absolute;left:0;top:0;z-index:1;min-width: auto;width: min-content'><table><thead><tr></tr></thead></table></div>");
                    var elementL_tr=$('<tr ng-repeat="'+repeatItem+" in "+ watchAttr+' track by $index" on-finish-render="changeTableData()"></tr>');
                    
                    //滚动条的宽度 和 高度
                    var barWidth=Jele[0].offsetWidth - Jele[0].clientWidth;
                    var barHeight=Jele[0].offsetHeight - Jele[0].clientHeight;

                    //生成固定table
                    $(elementHead).find("th").each(function(index,itemHead){
                        if($(itemHead).attr("fixedR")!=undefined){//右固定
                            var fixedR=$($(itemHead).attr("fixedR"))[0];
                            elementR.find("thead tr").append($(itemHead).clone()[0]);
                            elementRHead.find("thead tr").append($(itemHead).clone()[0]);
                            fixedR.setAttribute("fixedR","");
                            elementR_tr.append(fixedR);    

                        }else if($(itemHead).attr("fixedL")!=undefined){//左固定
                            var fixedL=$($(itemHead).attr("fixedL"))[0];
                            elementL.find("thead tr").append($(itemHead).clone()[0]);
                            elementLHead.find("thead tr").append($(itemHead).clone()[0]);
                            fixedL.setAttribute("fixedL","");
                            elementL_tr.append(fixedL);
                        
                        }
                            
                    });
                    
                    //将固定table加入dom中
                    if(elementRHead.find("tr").html()){
                        $scope.$apply(function(){
                            elementR.css({"right":barWidth+'px',"bottom":barHeight+'px'}).find("tbody").append(elementR_tr);
                            $compile(elementR)($scope).insertAfter(Jele);
                            elementRHead.css({"right":barWidth+'px'});
                            $compile(elementRHead)($scope).insertAfter(Jele);
                        });  
                    }
                    if(elementLHead.find("tr").html()){
                        $scope.$apply(function(){
                            elementL.css({"bottom":barHeight+'px'}).find("tbody").append(elementL_tr);
                            $compile(elementL)($scope).insertAfter(Jele);
                            $compile(elementLHead)($scope).insertAfter(Jele);
                        });  
                    }

                    //改变数组长度时，滚动条的变化
                    $scope.changeTableData=function(){ 
                        var watchAttrArr=$scope;
                        watchAttr.split(".").map(function(va){watchAttrArr=watchAttrArr[va];});
                        
                        barWidth=Jele[0].offsetWidth - Jele[0].clientWidth;//滚动条的宽度
                        barHeight=Jele[0].offsetHeight - Jele[0].clientHeight;//滚动条的高度
                        if(watchAttrArr&&watchAttrArr.length>0&&barHeight){
                            elementR.css({"display":"block","right":barWidth+'px',"bottom":barHeight+'px'});
                            elementRHead.css({"display":"block","right":barWidth+'px'});
                            elementL.css({"display":"block","bottom":barHeight+'px'})
                            elementLHead.css({"display":"block"});
                        }else{
                            elementR.css("display","none");
                            elementRHead.css("display","none");
                            elementL.css("display","none");
                            elementLHead.css("display","none");
                        }

                        parentElement.width(Jele.width() - barWidth);

                    }
                    $scope.changeTableData()

                    //监听滚动事件保证滚动条位置一致
                    Jele.on("scroll",function(){
                        parentElement.scrollLeft(this.scrollLeft); 
                        elementL.scrollTop(this.scrollTop);  
                        elementR.scrollTop(this.scrollTop);
                    });

                    //监听数组长度变化
                    $scope.$watch(watchAttr,function(ne,pre){
                        if(ne&&pre&&ne.length!=pre.length){
                            $scope.changeTableData();
                            if(ne.length>pre.length)Jele.scrollTop(Jele[0].scrollHeight);   
                        }     
                    },true);

                    //监听屏幕宽度变化
                    function resize(){
                        barWidth=Jele[0].offsetWidth - Jele[0].clientWidth;//滚动条的宽度
                        parentElement.width(Jele.width() - barWidth);
                    }
                    window.removeEventListener("resize",resize);
                    window.addEventListener("resize",resize);

                },5);
                    
            },
            
        }
    }])

})();