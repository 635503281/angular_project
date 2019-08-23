(function(){
    "use strict";

    module.exports=["$scope","$http","$translate","commonMethod","nodeService","contentService",'Upload',
            function($scope,$http,$translate,commonMethod,nodeService,contentService,Upload){

        //初始化
        $scope.init=()=>{
            $scope.loadFile = null;
            //是否直接上传
            $scope.Dupload=true;
        };

        //导出
        $scope.export=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/exportTemplate";
            $('.ipDispatchTemplateDownLoad').attr('href', url);
        }
        
        //选择文件
		$scope.selectFile = function(file){
            $scope.errMsg=null;
            $scope.loadFile=null;
            $(".fileProgress").removeClass("layui-bg-red").addClass("layui-bg-blue").width(0);
            
            console.log('选中文件+++++')
            console.log(file)
            if(file){
                if(file.name.split(".").pop()!= "xls"&& file.name.split(".").pop() != "xlsx"){
                    commonMethod.layuiTip($translate.instant('fileFormatError'),"notice");
                    
                }else{
                    $scope.loadFile=file;
                    //是否直接上传
                    if($scope.Dupload){
                        $scope.submit();
                    }else{
                        $(".fileName").removeClass("finish");
                        $(".fileStatus").removeClass("red").text("");
                        $(".fileOperation_btn").removeClass("none");
                    }
                    
                }
            }
        };

        //重试
        $scope.retry=()=>{
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
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/ip/policy/import";
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
                        //  $scope.closeThisDialog();
                         $scope.getPageData();
                         console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);

                    }else{
                        $(".fileProgress").removeClass("layui-bg-blue").addClass("layui-bg-red");
                        $(".fileStatus").addClass("red").text(`${$translate.instant("upload_F")}`);

                        $scope.errMsg=resp.data.displayMessage;
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

    }];
})();