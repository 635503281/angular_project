//定义全局函数格式 window.fn=function(){}

window.isValidIpAddress = function(address) {
    var patrn = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
    return patrn.test(address);
}

window.isValidIPv6Addr=function(address) {
    var patrn=/^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;
    return patrn.test(address);
}

window.isValidIpAddressRange=function(startAddr, endAddr){

    if ( !isValidIpAddress(startAddr) || !isValidIpAddress(endAddr) )
        return false;

    var i;
    var startAddrParts = startAddr.split('.');
    var endAddrParts = endAddr.split('.');

    for ( i = 0; i < 4; i++ ){
        if ( parseInt(startAddrParts[i]) < parseInt(endAddrParts[i]) )
            return true;
        else if ( parseInt(startAddrParts[i]) > parseInt(endAddrParts[i]) )
            return false;
    }

    return false;
}

window.isValidIpv6AddressRange=function(startAddr,endAddr) {
    if ( !isValidIPv6Addr(startAddr) || !isValidIPv6Addr(endAddr) )
        return false;

    var startAddrParts = startAddr.split(":");
    var endAddrParts = endAddr.split(":");
    //循环比较对应的项
    for (var i = 0; i < startAddrParts.length; i++) {
        if (startAddrParts[i]=="") {
            if (endAddrParts[i]=="") { //对应的项都位空，往下比较
                continue;
            } else {
                return true;
            }
        } else {
            if (endAddrParts[i]=="") {
                return false;
            } else {   //确定对应的项不为空，将字符串转换为整数进行比较
                var value1 = parseInt(startAddrParts[i], 16);
                var value2 = parseInt(endAddrParts[i], 16);
                if (value1 > value2) {
                    return false;
                } else if (value1 < value2) {
                    return true;
                } else {
                    continue;
                }
            }
        }
    }
    //循环结束，表示两个串表示的地址相同
    return true;
}

//判断浏览器类型
window.getBrowserType=function(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7)return "IE7";
        else if (fIEVersion == 8)return "IE8";
        else if (fIEVersion == 9)return "IE9";
        else if (fIEVersion == 10)return "IE10";
        else if (fIEVersion == 11)return "IE11";
        else return "0";//IE版本过低
        return "IE";
    }
    if (isOpera)return "Opera";
    
    if (isEdge)return "Edge";
    
    if (isFF)return "FF";
    
    if (isSafari)return "Safari";
    
    if (isChrome)return "Chrome";
    
}

//ie中添加includes方法
if(navigator.userAgent.indexOf("Trident")>-1){

    String.prototype.includes=function(str){
        if(this.indexOf(str)>-1){
            return true
        }else{
            return false
        }
    }

    Array.prototype.includes=function(item){
        if(this.indexOf(item)>-1){
            return true
        }else{
            return false
        }
    }

}


//格式化时间
Date.prototype.format = function(fmt){
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

//遍历数组方法 满足条件才添加进返回的数组中
Array.prototype.mapp=function(fn){
    let arr=[];
    let length=this.length;
    for(let i=0;i<length;i++){
       let result=fn(this[i],i);
       if(result)arr.push(result);
    }
    return arr
};

// 将数组按个数分成多个数组
Array.prototype.separate=function(num=5){
    let index = 0;
    let newArray = [];
    while(index < this.length) {
       newArray.push(this.slice(index, index += num));
    }
    return newArray;
};

//替代属性key值
Object.replaceAttrs=function(Oldobj,replaceObj){
    return Object.keys(Oldobj).reduce((newData, key) => {
        let newKey = replaceObj[key] || key;
        newData[newKey] = Oldobj[key];
        return newData
    }, {});
}; 

$(document).bind('click', function (e) {
    var e = e || window.event;
    var elem = e.target || e.srcElement;
    
    //清除layui-table-tips的影响
    if($(".layui-table-tips").length>0){
        while (elem) { //循环判断至跟节点，防止点击的是div子元素
            if (elem.className&&elem.className.includes("layui-table-tips")) {
                return;
            }
            elem = elem.parentNode;
        }
        $(".layui-table-tips").remove();   
    }
       
});

//滚动条事件
window.myScroll=(function(){
    var timer=null,first=true;
    function fn1(){
        
        if($(".select2-dropdown").length>0){//清除ui-select2
            $(".select2.select2-container--open").prev().select2("close");
           
        }else if($(".layui-laydate").length>0){//清除layDate
            $("#main-right").click();
            $("input").blur();
        }

        //清除layTip
        if(".layui-table-tips".length>0){
            $(".layui-table-tips").remove(); 
        }
        
    }
    
    return function(){
        if(first){
            fn1()
            return first=false;
        }
        if (timer) {
            return false;
        }
        
        timer=setTimeout(function(){
            clearTimeout(timer);
            timer = null;
            first=true;
            fn1()     
        },500);

    }

})();


//扩展dtree插件
if(!layui.dtree)layui.extend({dtree: '{/}static/assets/dtree/dtree'});