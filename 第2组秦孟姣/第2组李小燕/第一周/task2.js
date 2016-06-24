//2、写循环删除所有文件（异步）(..)

var fs = require('fs');
var path = require('path');

function deleteDir(dir,callback){
    fs.exists(dir,function(exists){
        if(exists){
            fs.readdir(dir,function(err,files){
                if(files.length==0){
                    console.log('此目录为空，无法进行删除操作');
                    return;
                }
                var dirStr = dir.split('/').join(path.sep);
                console.log(dirStr);
                auto(dir,dirStr,callback);
            })
        }else{
            console.log('目录不存在无法进行删除操作');
        }

    })
}

function auto(dir,dirStr,callback,fn){
    console.log(dir+'此目录为哪个目录');
    fs.readdir(dir,function(err,files){
        console.log(dir+'此目录为哪个目录1111111111');
        if(!files){
            return;
        }
        if(files.length==0){
            if(dirStr==dir){
                console.log('此目录已为空，无法进行删除操作');
                return;
            }
            fs.rmdir(dir,callback);
            auto(dir,dirStr,callback,fn);

            console.log(dir+"aaaaa");
        }
        (function next(i){
// console.log(files.length+"子文件个数");
            if(i<files.length){
// console.log(files[i]+"  哪个文件");
                var pathname = path.join(dir, files[i]);
                console.log(pathname+" 44444444");
                fs.stat(pathname, function (err, stats) {
                    if (stats.isDirectory()) {
//console.log(pathname+" 目录目录目录");
                        auto(pathname, dirStr,callback, function () {
                            fs.rmdir(pathname,callback);
                            next(i + 1);
                        });
                    } else {
                        fs.unlink(pathname,callback);
                        next(i + 1);



                    }
                });
            }else{
                fn && fn();
            }

        })(0);


    });
}

deleteDir('a/b',function(){
    console.log('删除成功');
});
