//1、写一个异步的创建文件夹的方式
var fs = require('fs');
function mkdirs(dirname, mode,callback){
    fs.exists(dirname,function(exists){
        if(!exists){
            var list = dirname.split('/');
            var len = list.length;
            var i=0;
            var cur = list[i]+"";
            auto(list,mode,len,i,cur,callback);
        }else{
            console.log("目录存在");
        }
    })
}
function auto(list,mode,len,i,cur,callback){
    if(i>=len){
        return;
    }

    fs.exists(cur,function(exists){
        if(!exists){
            fs.mkdir(cur, mode, function(err){});
        }
        i=i+1;
        cur = list.slice(0,i+1).join('/');
        auto(list,mode,len,i,cur,callback);
    })
}
mkdirs('a/b/cd/e',function(err){
    if(!err){
        console.log('创建成功');
    }
});
