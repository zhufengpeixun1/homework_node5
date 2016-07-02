/* 默认加载数据 */
var data = {};
getDefaultData();
function getDefaultData(){
    /* 创建xhr对象 初始化页面 */
    var xhr = new XMLHttpRequest();
    /* 设置请求方法 */
    xhr.open("GET","./json",true);
    /* 监听xhr状态 */
    xhr.onreadystatechange=function () {
        /* 200（成功） 201（已创建) 202（已接受） 203（非授权信息）204（无内容） 205（重置内容） 206（部分内容） */
        if( xhr.readyState == 4 && /2\d{2}/.test(xhr.status) ){
           // console.log(typeof xhr.response);/* 拿回的字符串 */
            var result=JSON.parse(xhr.response);
            var content=document.getElementById("content");
            var str="";
            result.data.forEach(function(item){
                str+='<tr>'+
                        ' <td>'+item.id+'</td>'+
                        '<td>'+item.name+'</td>'+
                        '<td><button class="btn btn-danger" onclick="deleData('+item.id+')">删除</button></td>'+
                     '</tr>';
            });
            content.innerHTML=str;
        };
    };
    /* 发送xhr请求 */
    xhr.send();
};
/* 新增 */
function savaData(){
    /* 获取新数据 */
    var newData={};
    var newName=document.getElementById("name").value;
    newData.name=newName;
    /* 发送新数据 */
    var xhr = new XMLHttpRequest();
    xhr.open("POST","./json",true);
    xhr.onreadystatechange=function () {
        if( xhr.readyState == 4 && /2\d{2}/.test(xhr.status) ){
            var content=document.getElementById("content");
            var tr=document.createElement("tr");
            var r=JSON.parse(xhr.response);
            if(r.code=="ok"){
                tr.innerHTML='<td>'+r.data.id+'</td>'+
                                '<td>'+r.data.name+'</td>'+
                                '<td><button class="btn btn-danger" onclick="deleData('+r.data.id+')">删除</button></td>';

                content.appendChild(tr);
                $("#myModal").modal("hide");
            }else{
                alert("保存失败")
            }
        }
    };
    /* 发送xhr请求 */
    xhr.send(JSON.stringify(newData));
};
/* 删除 */
function deleData(userId) {
    var deleDataId={};
    deleDataId.id=userId;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE","./json",true);
    xhr.onreadystatechange=function () {
        if( xhr.readyState == 4 && /2\d{2}/.test(xhr.status) ){
            var content=document.getElementById("content");
            var tr=document.createElement("tr");
            var r=JSON.parse(xhr.response);
            if(r.code=="OK"){
                alert("删除成功了,自己刷新页面吧,我实在懒得用原生处理DOM了!");
            }else{
                alert("保存失败")
            };
        };
    };
    /* 发送xhr请求 */
    xhr.send(JSON.stringify(deleDataId));
};


