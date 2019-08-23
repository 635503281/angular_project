//样式
require("../css/main.less");
//通用js
require("./common");

//select2
require("../plugins/select2/select2.min.js");
require("../plugins/select2/select2.min.css");

//模块
import angular from "angular";
    //路由
require("angular-ui-router");
    //国际化
require("angular-translate");
    //ngDialog
require("ng-dialog"); 
require("ng-dialog/css/ngDialog.css"); 
require("ng-dialog/css/ngDialog-theme-default.css");  
	//ngFileUpload
require("ng-file-upload"); 
    //组件
require("../components/components");
    // http拦截器
require("./factory");
    //自定义指令
require("./directive");
    //自定义服务
require("./service");
    //自定义过滤器
require("./filter");
    //自定义常量
require("./constant/constant");


//实例，注入模块
var app=angular.module("app",[
    "ui.router",
    "pascalprecht.translate",
    "ngDialog",
	"ngFileUpload",
    "InterceptorFactory",
    "Components",
    "Directives",
    "Services",
    "Filters",
    "Constant",
]);
//设置http拦截器
app.config(["$httpProvider",function($httpProvider){
    $httpProvider.interceptors.push('LoadingInterceptor');
}]);
//设置多语言
app.config(['$translateProvider' ,function($translateProvider){
    $translateProvider.translations('zh-cn',require("../i10n/zh-cn.json"))//中文
                      .translations("en-us",require("../i10n/en-us.json"));//英文

    var lang=sessionStorage.getItem('lang')||'zh-cn';
    $translateProvider.preferredLanguage(lang);//初始语言
    $translateProvider.useSanitizeValueStrategy("escape");//转义策略

    //使用 $translate.use(lang); $translate.instant(key) ||{{key|tanslate}}  
}]);
//设置url哈希#后面不带!
app.config(["$locationProvider",function($locationProvider){ 
    $locationProvider.hashPrefix(''); 
}]);
//设置a标签不跳转是不为不安全
app.config(["$compileProvider",function($compileProvider){
    //注:有些版本的angularjs为$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);,两种都试一下可以即可
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
}]);


//路由
require("./router");


