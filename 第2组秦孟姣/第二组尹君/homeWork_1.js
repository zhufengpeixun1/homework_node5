var fs = require("fs");
// 入口函数
function myDir(path,callback){
  if(typeof path !== "string") return;
  var path_arr = path.split("/");
  callback(path_arr)();
}

// 创建文件夹
function _mkdir(arr){
  var i = 0, str;
  return function fn(){
    if(i==arr.length) return;
    str = arr.slice(0,++i).join("/");
    fs.mkdir(str,function(err){
      if(!err) fn(i);
    });
  }
}

// 删除文件夹
function _rmdir(arr){
  var i = arr.length, str;
  return function fn(){
    if(i==0) return;
    str = arr.slice(0,i--).join("/");
    fs.rmdir(str,function(err){
      if(!err) fn();
    })
  }
}

// myDir("a/b/c/d/e/f/g/h",_mkdir);
