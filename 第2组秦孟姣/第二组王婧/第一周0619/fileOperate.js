/**
 * Created by WangJing on 16/6/20.
 * NodeJs第五期-第一周-家庭作业
 * 文件操作的方法集合
 * 知识点:fs文件处理、path处理、参数解析
 */

/** 
 * 引入核心模块
 */
var fs=require('fs');
var path = require('path');

/**
 *  同步创建文件夹
 */

//createDirSync('a///d////c//d/'); //函数调用
function createDirSync(paths) {

    //第一步:参数合法化,经测试可以省略...省略后的数组有很多空项,但不影响结果
    paths = path.normalize(paths);

    //第二步:分解参数-使用系统方法sep,path.sep:特定平台的文件分隔符
    // 这里应该不需要sep...,万一用户传的是/,在window下解析出的分隔符是\,应该会出错吧...
    var arr = paths.split(path.sep);

    //第三步:判断处理分解后的参数
    //如果不存在,则创建
    //如果存在,则继续找下一级
    var cur =[];
    for(var i=0;i<arr.length;i++){
        cur = arr.slice(0,i+1);//每次需要判断处理的路径
        if(fs.existsSync(cur.join(path.sep))){
            continue;//存在就继续循环,不做任何处理
        }else{
            fs.mkdirSync(cur.join(path.sep));//将数组用分隔符连接成路径
        }
    };
};

/**
 *  异步创建文件夹
 */
//createDir('a///d////c//d');//函数调用
function createDir(paths) {
    //第一步:参数处理
    paths = path.normalize( paths );

    //第二步:分解参数
    var arr = paths.split(path.sep);
    var cur =[];
    //第三步:循环参数创建文件夹
    for(var i=1;i<=arr.length;i++){//因为下面用到截取数组的原因,i的参数要设置为1,否则报错
        (function (i) {//疑问:循环里调用异步方法有问题,除了闭包,其他方式有什么?
            cur = arr.slice(0,i).join(path.sep);
            if(!fs.existsSync(cur)){
                fs.mkdir(cur,function (err) {
                    console.log(i+":"+err);
                })
            }
        })(i);
    };
};


/**
 *  同步删除文件夹:fs.rmdirSync(path)
 */
//deleteDirSync('a///d////c//d');
function deleteDirSync(paths) {
    paths = path.normalize(paths);
    var arr = paths.split(path.sep);
    var cur=[];
    //for (var i=0;i<arr.length;i++){//不能删除有内容的文件夹,所以需要从最里层的开始删,这行代码会报错
    for (var i=arr.length;i>0;i--){
        cur = arr.slice(0,i).join(path.sep);
        if(fs.existsSync(cur)){
            fs.rmdirSync(cur);
        };
    };
};

/**
 *  异步删除文件夹:fs.rmdir(path,callback)
 */
//deleteDir('a///d////c//d');
function deleteDir(paths) {
    paths = path.normalize(paths);
    var arr = paths.split(path.sep);
    var cur=[];
    for (var i=arr.length;i>0;i--){
        (function (i) {
            cur = arr.slice(0,i).join(path.sep);
            if(fs.existsSync(cur)){
                fs.rmdir(cur,function (err) {
                    console.log(i+":"+err);
                });
            };
        })(i);
    };
};
